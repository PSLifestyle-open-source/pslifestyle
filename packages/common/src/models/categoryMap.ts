import { Category } from "../types/genericTypes";
import { ActionCategory } from "../types/planTypes";

export type FootprintCategoryType = "01" | "02" | "03" | "04" | "99";

export const actionCategoryMap: ActionCategory[] = [
  "housing",
  "transport",
  "food",
  "purchases",
];

export const footprintCategoryMap: {
  [key in FootprintCategoryType]: Category;
} = {
  "01": "housing",
  "02": "transport",
  "03": "food",
  "04": "purchases",
  "99": "demographic",
};
