import {
  CalculatedAction,
  CategorizedActions,
} from "@pslifestyle/common/src/types/planTypes";

export const categorizeActions = (
  actions: CalculatedAction[],
): CategorizedActions => {
  const categorized: CategorizedActions = {
    housing: [],
    transport: [],
    food: [],
    purchases: [],
  };

  actions.forEach((action) => {
    switch (action.category.toLowerCase()) {
      case "transport":
        categorized.transport.push(action);
        break;
      case "food":
        categorized.food.push(action);
        break;
      case "housing":
        categorized.housing.push(action);
        break;
      case "purchases":
        categorized.purchases.push(action);
        break;
      default:
        break;
    }
  });

  return categorized;
};

export const sortActionsByImpact = (
  actions: CalculatedAction[],
): CalculatedAction[] =>
  actions.sort((a, b) => b.calculatedImpact - a.calculatedImpact);
