import { store } from "../../app/store";
import Question from "./Question";
import { QuestionType } from "@pslifestyle/common/src/schemas";
import type { Meta, StoryFn } from "@storybook/react";
import { Provider } from "react-redux";

const meta: Meta<typeof Question> = {
  title: "Questionnaire/Question",
  component: Question,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

export default meta;

const question: QuestionType = {
  id: "Question?",
  sortKey: "",
  questionText: "",
  formula: "",
  variableName: "",
  label: "",
  choices: [
    { choiceText: "1", choiceValue: 1, choiceTranslationKey: "First choice" },
    { choiceText: "2", choiceValue: 2, choiceTranslationKey: "Second choice" },
    { choiceText: "3", choiceValue: 3, choiceTranslationKey: "Third choice" },
    { choiceText: "4", choiceValue: 4, choiceTranslationKey: "Fourth choice" },
  ],
};

export const Default: StoryFn = (args) => (
  <Question question={question} {...args} />
);
export const Housing: StoryFn = (args) => (
  <Question question={{ ...question, sortKey: "01" }} {...args} />
);
export const Transport: StoryFn = (args) => (
  <Question question={{ ...question, sortKey: "02" }} {...args} />
);
export const Food: StoryFn = (args) => (
  <Question question={{ ...question, sortKey: "03" }} {...args} />
);
export const Purchases: StoryFn = (args) => (
  <Question question={{ ...question, sortKey: "04" }} {...args} />
);
