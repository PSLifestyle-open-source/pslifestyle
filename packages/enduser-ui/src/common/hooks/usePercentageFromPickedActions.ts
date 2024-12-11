import { userPlanSelectors } from "../../features/plan/userPlanSlice";
import { userAnswersSelectors } from "../../features/questionnaire/userAnswersSlice";
import { round } from "@pslifestyle/common/src/helpers/securedMathjs";
import { useSelector } from "react-redux";

export const usePercentageFromPickedActions = () => {
  const totalFootprint = useSelector(userAnswersSelectors.totalFootprint);
  const totalImpact = useSelector(userPlanSelectors.totalImpact);

  return round((totalImpact / totalFootprint) * 100, 1);
};
