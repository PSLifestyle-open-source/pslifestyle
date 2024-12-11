import { RootState } from "../../app/store";
import { resetStateForTesting } from "../../common/store/actions";
import { createDeepEqualSelector } from "../../common/store/utils";
import { fetchUserAnswers } from "../../firebase/api/fetchUserAnswers";
import {
  CalculatedAnswer,
  CategorizedFootprint,
} from "@pslifestyle/common/src/types/questionnaireTypes";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export interface UserAnswersState {
  isLoading: boolean;
  answerSetId: string | null;
  ordinaryAnswers: CalculatedAnswer[];
  categorizedFootprint: CategorizedFootprint;
}

const initialState: UserAnswersState = {
  isLoading: false,
  answerSetId: null,
  ordinaryAnswers: [],
  categorizedFootprint: { housing: 0, food: 0, purchases: 0, transport: 0 },
};

export const fetchSavedAnswers = createAsyncThunk(
  "userAnswers/fetchSavedAnswers",
  async () => {
    try {
      const { data } = await fetchUserAnswers();
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

const userAnswersSlice = createSlice({
  name: "userAnswers",
  initialState,
  reducers: {
    initializeUserAnswers(
      state,
      action: PayloadAction<{
        answerSetId: string;
        ordinaryAnswers: CalculatedAnswer[];
        categorizedFootprint: CategorizedFootprint;
      }>,
    ) {
      const { answerSetId, ordinaryAnswers, categorizedFootprint } =
        action.payload;
      state.answerSetId = answerSetId;
      state.ordinaryAnswers = ordinaryAnswers;
      state.categorizedFootprint = categorizedFootprint;
    },
    resetUserAnswers() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSavedAnswers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSavedAnswers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchSavedAnswers.fulfilled, (state, action) => {
      const { answerSetId, ordinaryAnswers, categorizedFootprint } =
        action.payload;
      state.answerSetId = answerSetId;
      state.ordinaryAnswers = ordinaryAnswers;
      state.categorizedFootprint = categorizedFootprint;
      state.isLoading = false;
    });
    builder.addCase(
      resetStateForTesting,
      (_state, action) => action.payload.userAnswers,
    );
  },
});
export default userAnswersSlice;

const selectOrdinaryAnswers = createDeepEqualSelector(
  [(state) => state.userAnswers.ordinaryAnswers],
  (ordinaryAnswers) => ordinaryAnswers,
);

const allVariables = createSelector(
  [selectOrdinaryAnswers],
  (ordinaryAnswers) =>
    ordinaryAnswers.reduce(
      (
        aggregator: Record<string, number>,
        ordinaryAnswer: CalculatedAnswer,
      ) => ({
        ...aggregator,
        ...ordinaryAnswer.variables,
      }),
      {},
    ) as Record<string, number>,
);

const totalFootprint = createSelector(
  [(state: RootState) => state.userAnswers.categorizedFootprint],
  (categorizedFootprint) =>
    Object.values(categorizedFootprint).reduce(
      (sum, categoryFootprint) => sum + categoryFootprint,
      0,
    ),
);

const hasAnswers = createSelector(
  [(state) => state.userAnswers.answerSetId],
  (answerSetId) => answerSetId != null,
);

export const userAnswersSelectors = {
  allVariables,
  totalFootprint,
  categorizedFootprint: (state: RootState) =>
    state.userAnswers.categorizedFootprint,
  answerSetId: (state: RootState) => state.userAnswers.answerSetId,
  hasAnswers,
  ordinaryAnswers: selectOrdinaryAnswers,
  isLoading: (state: RootState) => state.userAnswers.isLoading,
};

export const userAnswersActions = userAnswersSlice.actions;
