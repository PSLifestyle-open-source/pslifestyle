export type Category =
  | "housing"
  | "transport"
  | "food"
  | "purchases"
  | "demographic";

export type OrdinaryQuestionCategory = Exclude<Category, "demographic">;

export interface MathScopes {
  [key: string]: number;
}

export interface DisplayCondition {
  operator: string;
  value: string;
  variableName: string;
}
