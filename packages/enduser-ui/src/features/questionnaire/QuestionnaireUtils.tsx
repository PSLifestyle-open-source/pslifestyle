import { QuestionType } from "@pslifestyle/common/src/schemas";
import { NewAnswer } from "@pslifestyle/common/src/types/questionnaireTypes";

export interface QuestionnaireProgress {
  [key: string]: { theme: string; done: boolean };
}

export type SortKeyThemeCode = "01" | "02" | "03" | "04" | "99" | "other";

export type QuestionTheme =
  | "housing"
  | "transport"
  | "food"
  | "purchases"
  | "demographic"
  | "other";

const QuestionThemeMap: { [key in SortKeyThemeCode]: QuestionTheme } = {
  "01": "housing",
  "02": "transport",
  "03": "food",
  "04": "purchases",
  99: "demographic",
  other: "other",
};

export const questionTheme = (question: QuestionType) => {
  const key: SortKeyThemeCode = (question.sortKey ?? "").split(
    "-",
  )[0] as SortKeyThemeCode;

  return QuestionThemeMap[
    ["01", "02", "03", "04", "99"].includes(key) ? key : "other"
  ];
};

export const calculateQuestionnaireProgress = (
  questions: QuestionType[],
  answers: NewAnswer[],
): QuestionnaireProgress => {
  const answered = answers.map((a) => a.questionId);
  return questions.reduce(
    (acc, question) => ({
      ...acc,
      [question.id]: {
        theme: questionTheme(question),
        done: answered.includes(question.id),
      },
    }),
    {},
  );
};

export const progressForTheme = (
  theme: QuestionTheme,
  progress: QuestionnaireProgress,
) => {
  const questions = Object.values(progress).filter((q) => q.theme === theme);

  return {
    complete: questions.filter((q) => q.done).length,
    total: questions.length,
  };
};
