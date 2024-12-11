import { userAnswersSelectors } from "../../features/questionnaire/userAnswersSlice";
import { OrdinaryQuestionCategory } from "@pslifestyle/common/src/types/genericTypes";
import { useSelector } from "react-redux";

export const useDetermineHighestLowestCategory = () => {
  const categorizedFootprint = useSelector(
    userAnswersSelectors.categorizedFootprint,
  );
  let lowestCategory: { label: OrdinaryQuestionCategory; footprint: number } = {
    label: "housing", // any is okay at this point
    footprint: 99999999,
  };
  let highestCategory: { label: OrdinaryQuestionCategory; footprint: number } =
    {
      label: "housing", // any is okay at this point
      footprint: 0,
    };

  Object.entries(categorizedFootprint).forEach(([label, footprint]) => {
    if (Math.round(footprint) > highestCategory.footprint) {
      highestCategory = { label: label as OrdinaryQuestionCategory, footprint };
    }
    if (Math.round(footprint) < lowestCategory.footprint) {
      lowestCategory = { label: label as OrdinaryQuestionCategory, footprint };
    }
  });

  return { lowestCategory, highestCategory };
};
