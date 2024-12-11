import {
  CalculatedAnswer,
  CategorizedFootprint,
} from "../../../../common/src/types/questionnaireTypes";
import { Timestamp } from "firebase-admin/firestore";

export interface SavedAnswerSetMetadata {
  constantsVersion: string;
  questionnaireVersion: string;
  countryCode: string;
  createdAt: Timestamp;
  campaignIds: string[];
}

export interface SavedAnswerSet {
  ordinaryAnswers: CalculatedAnswer[];
  demographicAnswers: CalculatedAnswer[];
  categorizedFootprint: CategorizedFootprint;
  metadata: SavedAnswerSetMetadata;
}

export interface CalculatedAnswerSet {
  ordinaryAnswers: CalculatedAnswer[];
  demographicAnswers: CalculatedAnswer[];
  categorizedFootprint: CategorizedFootprint;
}
