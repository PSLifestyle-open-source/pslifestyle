import { QuestionTheme } from "../../../../features/questionnaire/QuestionnaireUtils";
import { colors } from "../../../utils/helpers";
import ActionCardCornerContainer from "./ActionCardCornerContainer";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";

interface Props {
  action: CalculatedAction;
}

const ImpactActionCardCorner = ({ action }: Props) => {
  const impactPercentageOnTotalFootprint = action.percentReduction.toFixed(1);

  return (
    <ActionCardCornerContainer
      variant={action.category.toLowerCase() as QuestionTheme}
    >
      <span
        className={`headline-xs-sb text-${
          colors[action.category.toLowerCase()]
        }-dark`}
      >
        -{impactPercentageOnTotalFootprint}%
      </span>
      <span className="body-sm text-center leading-4 mt-px">
        {action.calculatedImpact.toFixed()} kgCO<sub>2</sub>e
      </span>
    </ActionCardCornerContainer>
  );
};

export default ImpactActionCardCorner;
