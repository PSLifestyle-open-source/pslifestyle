/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Action,
  DisplayCondition,
  QuestionChoiceType,
  QuestionType,
} from "../../../common/src/schemas";
import { FeedbackCard } from "../Scripts/ImportParsers/feedbackCardsFetchAndParse";

export type EntireQuestion = {
  variableName?: string;
  id: string;
  label?: string;
  displayCondition?: DisplayCondition[];
  skipFromDataFeed?: boolean;
  sortKey?: string;
  category: string;
  categoryString?: string;
  orderNumber?: string;
  questionText?: string;
  questionTranslationKey?: string;
  descriptionText?: string;
  descriptionTranslationKey?: string;
  formula?: string;
  choiceText?: string;
  choiceValue?: number;
  choiceTranslationKey?: string;
  choices?: QuestionChoiceType[];
  relatedVariableName?: string;
  relatedVariableValue?: string;
  actionTitle?: string;
  actionDescriptionText?: string;
  actionDescriptionTranslationKey?: string;
  actionChoiceText?: string;
  actionChoiceValue?: number | undefined;
  actionChoiceTranslationKey?: string;
  actionChoiceDescriptionText?: string;
  actionChoiceDescriptionTranslationKey?: string;
  actionType?: string;
  tags: string[];
};

export type ObjectPerCountry<T> = {
  [id: string]: T;
};
export type ActionsPerCountry = ObjectPerCountry<Action[]>;
export type QuestionsPerCountry = ObjectPerCountry<QuestionType[]>;
export type ConstantsPerCountry = ObjectPerCountry<{
  [key: string]: number;
}>;
export type FeedbackCardsPerCountry = ObjectPerCountry<FeedbackCard[]>;
