import { userPlanSelectors } from "../../features/plan/userPlanSlice";
import { userAnswersSelectors } from "../../features/questionnaire/userAnswersSlice";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";
import { useSelector } from "react-redux";

const useFinalFootprint = (): {
  finalFootprint: number;
  finalCategorizedFootprint: CategorizedFootprint;
} => {
  const totalFootprint = useSelector(userAnswersSelectors.totalFootprint);
  const categorizedFootprint = useSelector(
    userAnswersSelectors.categorizedFootprint,
  );
  const totalAlreadyDoThisActionsImpact = useSelector(
    userPlanSelectors.totalAlreadyDoThisActionsImpact,
  );
  const alreadyDoThisActions = useSelector(
    userPlanSelectors.alreadyDoThisActions,
  );

  const finalCategorizedFootprint = { ...categorizedFootprint };

  alreadyDoThisActions.forEach((action) => {
    finalCategorizedFootprint[action.category] -= action.calculatedImpact;
  });

  return {
    finalFootprint: totalFootprint - totalAlreadyDoThisActionsImpact,
    finalCategorizedFootprint,
  };
};

export default useFinalFootprint;
