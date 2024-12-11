import { NewPlan } from "../../../../common/src/types/planTypes";
import { NewAnswerSet } from "../../../../common/src/types/questionnaireTypes";
import { collections } from "../../constants";
import { fetchLatestUserAnswerSet } from "../Repository/answers";
import { fetchLatestUserPlan } from "../Repository/plans";
import { hashMail } from "../Utilities/utilities";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

const doesUserHavePlan = async (email: string): Promise<boolean> => {
  const answerSet = await fetchLatestUserAnswerSet({ email });
  if (!answerSet) {
    return false;
  }
  return !!(await fetchLatestUserPlan(
    { email },
    answerSet.metadata.createdAt.toDate().toISOString(),
  ));
};

export const saveAscendUserData = async (
  email: string,
  answerSet: NewAnswerSet,
  plan: NewPlan,
) => {
  if (await doesUserHavePlan(email)) {
    throw new functions.https.HttpsError(
      "already-exists",
      "User has existing plan",
    );
  }

  await admin
    .firestore()
    .collection(collections.ascendUserDataStorage)
    .doc(hashMail(email))
    .set(
      {
        createdAt: Timestamp.fromDate(new Date()),
        answerSet,
        plan,
      },
      { merge: true },
    );

  console.log("Persisted data for the ascending purpose in temporary storage");
};
