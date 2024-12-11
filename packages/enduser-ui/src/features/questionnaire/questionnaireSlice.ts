import { AppDispatch, RootState } from "../../app/store";
import { resetStateForTesting } from "../../common/store/actions";
import { filterQuestions } from "../../common/utils/filters";
import { calculateQuestionnaireProgress } from "./QuestionnaireUtils";
import { createAnswersBuilder } from "@pslifestyle/common/src/dataBuilders/answersBuilder";
import getCategoryFromSortKey from "@pslifestyle/common/src/helpers/getCategoryFromSortKey";
import { QuestionType } from "@pslifestyle/common/src/schemas";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";
import {
  CategorizedFootprint,
  NewAnswer,
  NewQuestionnaireMetadata,
} from "@pslifestyle/common/src/types/questionnaireTypes";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface QuestionnaireState {
  questionnaireInProgress: boolean;
  questions: QuestionType[];
  constants: MathScopes;
  metadata: NewQuestionnaireMetadata | null;
  categorizedFootprint: CategorizedFootprint;
  answers: NewAnswer[];
  currentQuestionIndex: number;
  categoryToIntroduce: string | null;
}

const categoriesWithoutIntroduction = ["housing"];

const checkCategoryIntroduction = (
  oldQuestion: QuestionType,
  newQuestion: QuestionType,
): string | null => {
  const previousCategory = getCategoryFromSortKey(oldQuestion.sortKey);
  const newCategory = getCategoryFromSortKey(newQuestion.sortKey);

  return previousCategory &&
    newCategory &&
    previousCategory !== newCategory &&
    !categoriesWithoutIntroduction.includes(newCategory)
    ? newCategory
    : null;
};

const initialState: QuestionnaireState = {
  questionnaireInProgress: false,
  questions: [],
  constants: {},
  metadata: null,
  categorizedFootprint: { food: 0, housing: 0, purchases: 0, transport: 0 },
  answers: [],
  currentQuestionIndex: 0,
  categoryToIntroduce: null,
};

const questionnaireSlice = createSlice({
  name: "questionnaire",
  initialState,
  reducers: {
    setCurrentQuestion(
      state,
      action: PayloadAction<{
        questionIndex: number;
        categoryToIntroduce: string | null;
      }>,
    ) {
      state.currentQuestionIndex = action.payload.questionIndex;
      state.categoryToIntroduce = action.payload.categoryToIntroduce;
    },
    changeToPreviousQuestion(state) {
      if (state.currentQuestionIndex <= 0) {
        state.categoryToIntroduce = null;
        return;
      }

      state.currentQuestionIndex -= 1;
      state.categoryToIntroduce = null;
    },
    acknowledgeCategory(state) {
      state.categoryToIntroduce = null;
    },
    initializeQuestionnaire(
      state,
      action: PayloadAction<{
        questions: QuestionType[];
        constants: MathScopes;
        metadata: NewQuestionnaireMetadata;
      }>,
    ) {
      const { questions, metadata, constants } = action.payload;
      state.questionnaireInProgress = true;
      state.questions = questions;
      state.metadata = metadata;
      state.constants = constants;
    },
    resetQuestionnaire() {
      return initialState;
    },
    setAnswer(state, action: PayloadAction<NewAnswer>) {
      const { answers } = state;
      const newAnswer = action.payload;

      for (let i = 0; i < answers.length; i += 1) {
        if (answers[i].questionId === newAnswer.questionId) {
          if (answers[i].choiceText !== newAnswer.choiceText) {
            answers[i] = newAnswer;
          }
          return;
        }
      }
      state.answers.push(newAnswer);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      resetStateForTesting,
      (_state, action) => action.payload.questionnaire,
    );
  },
});

const questions = (state: RootState) => state.questionnaire.questions;
const answers = (state: RootState) => state.questionnaire.answers;
const constants = (state: RootState) => state.questionnaire.constants;
const metadata = (state: RootState) => state.questionnaire.metadata;
const currentIndex = (state: RootState) =>
  state.questionnaire.currentQuestionIndex;

const answerBuilder = createSelector(
  [questions, constants],
  (questions, constants) => createAnswersBuilder(questions, constants),
);

const calculatedAnswerData = createSelector(
  [answers, answerBuilder],
  (answers, builder) => builder.buildAnswers(answers),
);

const categorizedFootprint = createSelector(
  [calculatedAnswerData],
  (answers) => answers.categorizedFootprint,
);

const calculatedAnswers = createSelector(
  [calculatedAnswerData],
  (answers) => answers.calculatedAnswers,
);

const fullMathScope = createSelector(
  [calculatedAnswerData],
  (answers) => answers.fullMathScope,
);

const availableQuestions = createSelector(
  [questions, fullMathScope],
  (questions, fullMathScope) => filterQuestions(fullMathScope, questions),
);

function changeToNextQuestion() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const available = availableQuestions(state);
    const { currentQuestionIndex } = state.questionnaire;

    if (currentQuestionIndex === available.length - 1) {
      dispatch(
        questionnaireSlice.actions.setCurrentQuestion({
          questionIndex: currentQuestionIndex + 1,
          categoryToIntroduce: null,
        }),
      );
      return;
    }

    const oldCurrentQuestion = available[currentQuestionIndex];
    const newCurrentQuestion = available[currentQuestionIndex + 1];
    const categoryToIntroduce = checkCategoryIntroduction(
      oldCurrentQuestion,
      newCurrentQuestion,
    );

    dispatch(
      questionnaireSlice.actions.setCurrentQuestion({
        questionIndex: currentQuestionIndex + 1,
        // Temporarily, we want to disable transition pages, to test if it will affect user experience
        categoryToIntroduce:
          categoryToIntroduce === "demographic" ? categoryToIntroduce : null,
      }),
    );
  };
}

function addAnswer(newAnswer: NewAnswer) {
  return (dispatch: AppDispatch) => {
    dispatch(questionnaireSlice.actions.setAnswer(newAnswer));
    dispatch(changeToNextQuestion());
  };
}

const questionnaireProgress = createSelector(
  [answers, availableQuestions],
  (answers: NewAnswer[], availableQuestions: QuestionType[]) =>
    calculateQuestionnaireProgress(availableQuestions, answers),
);

const currentQuestion = createSelector(
  [currentIndex, availableQuestions],
  (currentQuestionIndex: number, availableQuestions: QuestionType[]) =>
    availableQuestions[currentQuestionIndex],
);

const isCurrentQuestionAnswered = createSelector(
  [answers, currentIndex],
  (answers: NewAnswer[], currentQuestionIndex: number) =>
    answers[currentQuestionIndex] !== undefined,
);

const isQuestionnaireCompleted = createSelector(
  [currentIndex, availableQuestions],
  (currentIndex, availableQuestions) =>
    currentIndex >= availableQuestions.length,
);

export const questionnaireSelectors = {
  questionnaireProgress,
  currentQuestion,
  isCurrentQuestionAnswered,
  isQuestionnaireCompleted,
  categoryToIntroduce: (state: RootState) =>
    state.questionnaire.categoryToIntroduce,
  answers,
  metadata,
  availableQuestions,
  currentIndex,
  categorizedFootprint,
  calculatedAnswers,
};

export const questionnaireActions = {
  ...questionnaireSlice.actions,
  addAnswer,
  changeToNextQuestion,
};

export default questionnaireSlice;
