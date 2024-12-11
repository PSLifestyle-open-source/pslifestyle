import { userPlanSelectors } from "../../features/plan/userPlanSlice";
import { getPercentage } from "../utils/helpers";
import { useSelector } from "react-redux";

export const usePercentageOfAccomplishedPlan = () => {
  const totalCompletedActionsImpact = useSelector(
    userPlanSelectors.totalCompletedActionsImpact,
  );
  const totalImpact = useSelector(userPlanSelectors.totalImpact);

  return getPercentage(totalCompletedActionsImpact, totalImpact, 0);
};
