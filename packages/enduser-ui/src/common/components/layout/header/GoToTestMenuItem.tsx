import RetakeQuestionnaireAlertDialog from "../../../../features/questionnaire/RetakeQuestionnaireAlertDialog";
import { IMenuItemRendererProps } from "./types";

const GoToTestMenuItem = ({
  onClick,
  enabled,
  linkText,
  className,
}: IMenuItemRendererProps) => (
  <RetakeQuestionnaireAlertDialog onPreTrigger={onClick}>
    <button
      type="button"
      className={`w-[100%] cursor-pointer ${
        enabled ? "font-bold" : "text-neutral-40"
      }`}
    >
      <div
        data-cy="menuLinks"
        className={`${className} flex items-center border-b md:border-0 border-transparent-black h-12 hover:bg-neutral-20 md:px-4`}
      >
        {linkText}
      </div>
    </button>
  </RetakeQuestionnaireAlertDialog>
);

export default GoToTestMenuItem;
