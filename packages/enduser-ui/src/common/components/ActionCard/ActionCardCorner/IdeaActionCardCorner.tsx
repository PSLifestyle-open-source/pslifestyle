import Idea from "../../../../assets/icons/idea.svg?react";
import { QuestionTheme } from "../../../../features/questionnaire/QuestionnaireUtils";
import ActionCardCornerContainer from "./ActionCardCornerContainer";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";

interface Props {
  action: CalculatedAction;
}

const IdeaActionCardCorner = ({ action }: Props) => (
  <ActionCardCornerContainer
    variant={action.category.toLowerCase() as QuestionTheme}
  >
    <span className="mx-4 mt-1">
      <Idea style={{ height: "34.5px", width: "35.5px", rotate: "330deg" }} />
    </span>
  </ActionCardCornerContainer>
);

export default IdeaActionCardCorner;
