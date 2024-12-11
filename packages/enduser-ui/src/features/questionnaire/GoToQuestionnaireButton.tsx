import ButtonLarge from "../../common/components/ui/buttons/ButtonLarge";
import { IThemedButtonProps } from "../../common/components/ui/buttons/ThemedButton";
import RetakeQuestionnaireAlertDialog from "./RetakeQuestionnaireAlertDialog";
import { useTranslation } from "react-i18next";

interface GoToQuestionnaireButtonProps extends IThemedButtonProps {
  children?: string;
}

export const GoToQuestionnaireButton = ({
  theme,
  children,
  ...props
}: GoToQuestionnaireButtonProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <RetakeQuestionnaireAlertDialog>
      <ButtonLarge
        id="gtm-take-test"
        theme={theme || "primary"}
        className="justify-center"
        cyData="take-test-button"
        {...props}
      >
        {children || t("takeTheTest", { ns: "frontpage" })}
      </ButtonLarge>
    </RetakeQuestionnaireAlertDialog>
  );
};
