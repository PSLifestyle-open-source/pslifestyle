import {
  footprintCategoryMap,
  FootprintCategoryType,
} from "../models/categoryMap";
import { Category } from "../types/genericTypes";

const getCategoryFromSortKey = (sortKey: string): null | Category => {
  if (!sortKey) {
    return null;
  }

  return footprintCategoryMap[sortKey.slice(0, 2) as FootprintCategoryType];
};

export default getCategoryFromSortKey;
