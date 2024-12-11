import {
  FullWidthContainer,
  WideWidthContainer,
} from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import { Icon } from "../../common/components/ui/Icon";
import { ButtonLarge } from "../../common/components/ui/buttons";
import BackButtonInContainer from "../../common/components/ui/buttons/BackButtonInContainer";
import { VerticalButtonsContainer } from "../../common/components/ui/buttons/VerticalButtonsContainer";
import { useTranslation } from "react-i18next";

interface OutroOfQuestionnaireProps {
  onBackClick: () => void;
  onFinishQuestionnaireClick: () => void;
}

const OutroOfQuestionnaire: React.FC<OutroOfQuestionnaireProps> = ({
  onBackClick,
  onFinishQuestionnaireClick,
}) => {
  const { t } = useTranslation(["intros", "common"]);

  return (
    <>
      <BackButtonInContainer onClick={onBackClick} />
      <FullWidthContainer>
        <WideWidthContainer className="pb-4">
          <Heading
            level={1}
            type="headline-lg-eb"
            className="text-green-100 mb-3"
          >
            {t("outroOfQuestionnaire.title")}
          </Heading>
          <Heading level={2} type="headline-md-b">
            {t("outroOfQuestionnaire.paragraph1")}
          </Heading>
          <div className="flex justify-center items-end pt-2 pb-4">
            <Icon size="extralarge" type="CheckCircle" />
          </div>
        </WideWidthContainer>
        <WideWidthContainer>
          <VerticalButtonsContainer className="gap-4">
            <ButtonLarge
              onClick={onFinishQuestionnaireClick}
              cyData="outroOfQuestionnaire.continue.button"
            >
              {t("continue", { ns: "common" })}
            </ButtonLarge>
          </VerticalButtonsContainer>
        </WideWidthContainer>
      </FullWidthContainer>
    </>
  );
};

export default OutroOfQuestionnaire;
