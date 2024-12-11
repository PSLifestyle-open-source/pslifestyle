import { RootState } from "../../app/store";
import { resetStateForTesting } from "../../common/store/actions";
import {
  CalculatedAction,
  ActionState,
  SkippedAction,
} from "@pslifestyle/common/src/types/planTypes";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserPlanState {
  applicableActions: CalculatedAction[];
  selectedActions: CalculatedAction[];
  alreadyDoThisActions: CalculatedAction[];
  skippedActions: SkippedAction[];
}

const initialState: UserPlanState = {
  applicableActions: [],
  selectedActions: [],
  alreadyDoThisActions: [],
  skippedActions: [],
};

const userPlanSlice = createSlice({
  name: "userPlan",
  initialState,
  reducers: {
    resetUserPlan() {
      return initialState;
    },
    initializeUserPlan(
      state,
      action: PayloadAction<{
        applicableActions?: CalculatedAction[];
        selectedActions?: CalculatedAction[];
        alreadyDoThisActions?: CalculatedAction[];
        skippedActions?: SkippedAction[];
      }>,
    ) {
      const {
        applicableActions,
        selectedActions,
        alreadyDoThisActions,
        skippedActions,
      } = action.payload;
      state.applicableActions = applicableActions || state.applicableActions;
      state.selectedActions = selectedActions || state.selectedActions;
      state.alreadyDoThisActions =
        alreadyDoThisActions || state.alreadyDoThisActions;
      state.skippedActions = skippedActions || state.skippedActions;
    },
    skipAction(state, action: PayloadAction<SkippedAction>) {
      const skippedAction = action.payload;
      const { selectedActions, applicableActions } = state;

      state.skippedActions.push(skippedAction);
      state.selectedActions = selectedActions.filter(
        (action) => action.id !== skippedAction.id,
      );
      state.applicableActions = applicableActions.filter(
        (action) => action.id !== skippedAction.id,
      );
    },
    addAction(state, action: PayloadAction<string>) {
      const actionId = action.payload;
      const { applicableActions, selectedActions } = state;

      const newAction = applicableActions.find(
        (action) => action.id === actionId,
      );
      if (
        !newAction ||
        selectedActions.find((action) => action.id === actionId)
      ) {
        return;
      }

      state.selectedActions.push(newAction);
    },
    removeAction(state, action: PayloadAction<string>) {
      const actionId = action.payload;
      const { selectedActions } = state;

      state.selectedActions = selectedActions.filter(
        (action) => action.id !== actionId,
      );
    },
    changeActionState(
      state,
      action: PayloadAction<{ actionId: string; newState: ActionState }>,
    ) {
      const { actionId, newState } = action.payload;
      const { selectedActions } = state;

      for (let i = 0; i < selectedActions.length; i += 1) {
        if (selectedActions[i].id === actionId) {
          selectedActions[i].state = newState;
          break;
        }
      }
    },
    addAlreadyDoThisAction(state, action: PayloadAction<string>) {
      const actionId = action.payload;
      const { applicableActions, alreadyDoThisActions } = state;

      const newAction = applicableActions.find(
        (action) => action.id === actionId,
      );
      if (
        !newAction ||
        alreadyDoThisActions.find((action) => action.id === actionId)
      ) {
        return;
      }

      state.alreadyDoThisActions.push(newAction);
    },
    removeAlreadyDoThisAction(state, action: PayloadAction<string>) {
      const actionId = action.payload;
      const { alreadyDoThisActions } = state;

      state.alreadyDoThisActions = alreadyDoThisActions.filter(
        (action) => action.id !== actionId,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      resetStateForTesting,
      (_state, action) => action.payload.userPlan,
    );
  },
});

export default userPlanSlice;

const impactSum = (actionList: CalculatedAction[]) =>
  actionList.reduce(
    (sum, selectedAction) => sum + selectedAction.calculatedImpact,
    0,
  );

const selectedActions = (state: RootState) => state.userPlan.selectedActions;
const skippedActions = (state: RootState) => state.userPlan.skippedActions;

const totalImpact = createSelector([selectedActions], (selectedActions) =>
  impactSum(selectedActions),
);

const actionsByState = createSelector([selectedActions], (selectedActions) => {
  const byState = {
    completed: [] as CalculatedAction[],
    new: [] as CalculatedAction[],
  };
  selectedActions.forEach((action) => {
    if (action.state === "completed" || action.state === "new") {
      byState[action.state].push(action);
    }
  });
  return byState;
});

const completedActions = createSelector(
  [actionsByState],
  (actionsByState) => actionsByState.completed,
);

const alreadyDoThisActions = (state: RootState) =>
  state.userPlan.alreadyDoThisActions;

const totalAlreadyDoThisActionsImpact = createSelector(
  [alreadyDoThisActions],
  (alreadyDoThisActions) => impactSum(alreadyDoThisActions),
);

const totalCompletedActionsImpact = createSelector(
  [completedActions],
  (completedActions) => impactSum(completedActions),
);

const isActionSelected = createSelector(
  [selectedActions, (state: RootState, actionId: string) => actionId],
  (selectedActions, actionId) =>
    selectedActions.some((action) => action.id === actionId),
);

export const userPlanSelectors = {
  completedActions,
  alreadyDoThisActions,
  totalImpact,
  totalCompletedActionsImpact,
  totalAlreadyDoThisActionsImpact,
  selectedActions,
  skippedActions,
  isActionSelected,
  applicableActions: (state: RootState) => state.userPlan.applicableActions,
};

export const userPlanActions = userPlanSlice.actions;
