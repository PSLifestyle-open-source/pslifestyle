import { QuestionTheme } from "../../../../features/questionnaire/QuestionnaireUtils";
import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: QuestionTheme;
}

const ActionCardCornerContainer = ({ variant = "other", children }: Props) => (
  <div
    style={{ borderRadius: "0px 24px 0px 200px" }}
    className={classNames("relative flex justify-end w-[120px] h-[120px]", {
      "bg-purple-40": variant === "transport",
      "bg-pink-40": variant === "food",
      "bg-cyan-40": variant === "purchases",
      "bg-orange-40": variant === "housing",
      "bg-yellow-40": variant === "other",
    })}
  >
    <div className="flex flex-col mr-3 mt-5">{children}</div>
  </div>
);

export default ActionCardCornerContainer;
