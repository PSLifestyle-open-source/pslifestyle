import { Category, DisplayCondition } from "./genericTypes";

export type ActionCategory = Exclude<Category, "demographic">;

export type ActionState = "completed" | "new";

export interface ImpactFormula {
  conditions: DisplayCondition[];
  formula: string;
}

export interface RawRecommendedAction {
  impactFormulas: ImpactFormula[];
  category: ActionCategory;
  id: string;
  tags: string[];
  title: string;
  type: string;
  displayCondition?: DisplayCondition[];
  skipIdsIfSelected: [];
}

export interface CalculatedAction {
  category: ActionCategory;
  id: string;
  tags: string[];
  title: string;
  type: string;
  skipIdsIfSelected: string[];
  calculatedImpact: number;
  percentReduction: number;
  actionsVersion: string;
  state: ActionState;
}

export interface SkippedAction {
  id: string;
  reasons: string[];
}

export type CategorizedActions = Record<ActionCategory, CalculatedAction[]>;

export type TagTheme =
  | "housing"
  | "transport"
  | "food"
  | "purchases"
  | "demographic"
  | "challenge"
  | "idea"
  | "action"
  | "other";

export interface CalculatedPlan {
  selectedActions: CalculatedAction[];
  alreadyDoThisActions: CalculatedAction[];
  skippedActions: SkippedAction[];
}

export interface NewAddedAction {
  id: string;
  state: ActionState;
}

export interface NewPlan {
  selectedActions: NewAddedAction[];
  alreadyDoThisActions: NewAddedAction[];
  skippedActions: SkippedAction[];
}
