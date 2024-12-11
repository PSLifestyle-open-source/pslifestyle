import { NewPlan } from "../../../../common/src/types/planTypes";
import { NewAnswerSet } from "../../../../common/src/types/questionnaireTypes";
import { Timestamp } from "firebase-admin/firestore";
import { Algorithm } from "jsonwebtoken";

export type tokenSignOptionsParamsType = {
  issuer: string;
  subject: string;
  audience: string;
  expiresIn: string;
  algorithm: Algorithm;
};

export type verifyTokenParamsType = {
  email: string;
  iss: string;
  sub: string;
  aud: string;
};

export interface AnonUserId {
  anonId: string;
}

export interface LoggedInUserId {
  email: string;
}

export type EitherLoggedInOrAnonUserId = AnonUserId | LoggedInUserId;

export interface AscendUserData {
  createdAt: Timestamp;
  answerSet: NewAnswerSet;
  plan: NewPlan;
}
