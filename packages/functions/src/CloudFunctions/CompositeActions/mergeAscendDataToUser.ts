import { collections } from "../../constants";
import { findAuthenticatedUserByEmail } from "../Repository/authenticatedUsers";
import { calculatePlan } from "../Utilities/calculatePlan";
import { prepareCalculatedAnswerSet } from "../Utilities/prepareCalculatedAnswerSet";
import { AscendUserData } from "../Utilities/types";
import { hashMail } from "../Utilities/utilities";
import { saveAnswerSet } from "./saveAnswerSet";
import { savePlan } from "./savePlan";
import * as admin from "firebase-admin";
import { DocumentSnapshot, Transaction } from "firebase-admin/firestore";

export const mergeAscendDataToUser = async (
  transaction: Transaction,
  email: string,
): Promise<void> => {
  const user = await findAuthenticatedUserByEmail(email);
  const ascendUserDataResponse = (await admin
    .firestore()
    .collection(collections.ascendUserDataStorage)
    .doc(hashMail(email))
    .get()) as DocumentSnapshot<AscendUserData>;
  const ascendUserData = ascendUserDataResponse.data();

  if (!ascendUserData) {
    return;
  }

  const { plan, answerSet, createdAt } = ascendUserData;

  const calculatedAnswerSet = await prepareCalculatedAnswerSet(answerSet);
  const savedAnswerSet = await saveAnswerSet(
    transaction,
    { email },
    calculatedAnswerSet,
    {
      createdAt,
      campaignIds: user?.campaignIds || [],
      countryCode: answerSet.metadata.countryCode,
      constantsVersion: answerSet.metadata.constantsVersion,
      questionnaireVersion: answerSet.metadata.questionnaireVersion,
    },
  );

  const calculatedPlan = await calculatePlan(
    savedAnswerSet,
    { email: email },
    plan,
  );

  await savePlan(
    transaction,
    { email },
    savedAnswerSet.metadata.createdAt.toDate().toISOString(),
    calculatedPlan,
    {
      createdAt,
      campaignIds: user?.campaignIds || [],
    },
  );
  await transaction.delete(
    admin
      .firestore()
      .collection(collections.ascendUserDataStorage)
      .doc(hashMail(email)),
  );
};
