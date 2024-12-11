import { collections } from "../../constants";
import { upgradeUserToV1Model } from "../Repository/authenticatedUsers";
import { updateUser } from "../Repository/user";
import { AuthenticatedUser } from "../Types/user";
import { calculatePlan } from "../Utilities/calculatePlan";
import { prepareCalculatedAnswerSet } from "../Utilities/prepareCalculatedAnswerSet";
import { hashMail } from "../Utilities/utilities";
import { saveAnswerSet } from "./saveAnswerSet";
import { savePlan } from "./savePlan";
import * as admin from "firebase-admin";
import { Timestamp, Transaction } from "firebase-admin/firestore";

interface LegacyAnswerSet {
  metaData: {
    constantsVersion: string;
    questionnaireVersion: string;
    countryCode: string;
    timestampEnd: Timestamp;
    campaignId: string | null;
  };
  questions: { id: string; answer: string; sortKey: string }[];
  demographic: { id: string; answer: string; sortKey: string }[];
}

interface LegacyPlan {
  pickedActions: { id: string; completed: boolean }[];
  skippedRecommendations: Record<string, { reasons?: string[] }>;
}

export const upgradeUserDataToV1 = async (
  transaction: Transaction,
  user: AuthenticatedUser,
  email: string,
): Promise<void> => {
  if (user.version === 1) {
    return;
  }

  await upgradeUserToV1Model(transaction, user);

  if (user.latestAnswerAt) {
    const answerSetRef = admin
      .firestore()
      .collection(collections.authenticatedUsers)
      .doc(hashMail(email))
      .collection(collections.answers)
      .doc(user.latestAnswerAt.toDate().toISOString());
    const legacyAnswerSetResponse = await answerSetRef.get();

    const legacyAnswerSet = legacyAnswerSetResponse.data() as
      | LegacyAnswerSet
      | undefined;

    if (!legacyAnswerSet || !legacyAnswerSet.questions) {
      return;
    }
    const calculatedAnswerSet = await prepareCalculatedAnswerSet({
      answers: [
        ...legacyAnswerSet.questions.map(
          (legacyQuestion: {
            id: string;
            answer: string;
            sortKey: string;
          }) => ({
            questionId: legacyQuestion.id,
            choiceText: legacyQuestion.answer,
            sortKey: legacyQuestion.sortKey,
          }),
        ),
        ...legacyAnswerSet.demographic.map(
          (legacyQuestion: {
            id: string;
            answer: string;
            sortKey: string;
          }) => ({
            questionId: legacyQuestion.id,
            choiceText: legacyQuestion.answer,
            sortKey: legacyQuestion.sortKey,
          }),
        ),
      ],
      metadata: {
        constantsVersion: legacyAnswerSet.metaData.constantsVersion,
        questionnaireVersion: legacyAnswerSet.metaData.questionnaireVersion,
        countryCode: legacyAnswerSet.metaData.countryCode,
      },
    });

    const campaignIds: string[] = (
      Array.isArray(user.campaignIds)
        ? [...user.campaignIds, legacyAnswerSet.metaData.campaignId]
        : [legacyAnswerSet.metaData.campaignId]
    ).filter((x): x is string => !!x);

    await transaction.delete(answerSetRef);
    const savedAnswerSet = await saveAnswerSet(
      transaction,
      { email },
      calculatedAnswerSet,
      {
        constantsVersion: legacyAnswerSet.metaData.constantsVersion,
        questionnaireVersion: legacyAnswerSet.metaData.questionnaireVersion,
        countryCode: legacyAnswerSet.metaData.countryCode,
        createdAt: legacyAnswerSet.metaData.timestampEnd,
        campaignIds: campaignIds,
      },
    );

    if (user.latestPlanAt) {
      const planRef = admin
        .firestore()
        .collection(collections.authenticatedUsers)
        .doc(hashMail(email))
        .collection(collections.answers)
        .doc(user.latestAnswerAt.toDate().toISOString())
        .collection(collections.plans)
        .doc(user.latestPlanAt.toDate().toISOString());
      const legacyPlanResponse = await planRef.get();
      const legacyPlan = legacyPlanResponse.data() as LegacyPlan | undefined;

      if (!legacyPlan) {
        return;
      }
      const calculatedPlan = await calculatePlan(
        savedAnswerSet,
        { email: email },
        {
          selectedActions: legacyPlan.pickedActions.map((pickedAction) => ({
            id: pickedAction.id,
            state: pickedAction.completed ? "completed" : "new",
          })),
          alreadyDoThisActions: [],
          skippedActions: Object.keys(legacyPlan.skippedRecommendations).map(
            (skippedActionKey) => ({
              id: skippedActionKey,
              reasons:
                legacyPlan.skippedRecommendations[skippedActionKey].reasons ||
                [],
            }),
          ),
        },
      );
      await transaction.delete(planRef);
      await savePlan(
        transaction,
        { email },
        user.latestAnswerAt.toDate().toISOString(),
        calculatedPlan,
        {
          createdAt: user.latestPlanAt,
          campaignIds: campaignIds,
        },
      );
    }
  }

  await updateUser(transaction, { email }, { version: 1 });
};
