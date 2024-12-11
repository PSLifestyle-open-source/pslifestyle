import { OrdinaryQuestionCategory, Category } from "./genericTypes";

export interface NewQuestionnaireMetadata {
  questionnaireVersion: string;
  constantsVersion: string;
  countryCode: string;
}

export interface NewAnswer {
  questionId: string;
  choiceText: string;
  sortKey: string;
}

export interface CalculatedAnswer {
  questionId: string;
  questionText: string;
  choiceText: string;
  choiceValue: string | number;
  label: string;
  sortKey: string;
  variables: Record<string, number>;
  footprint: number;
  category: Category;
}

export interface NewAnswerSet {
  answers: NewAnswer[];
  metadata: NewQuestionnaireMetadata;
}

export type CategorizedFootprint = Record<OrdinaryQuestionCategory, number>;
