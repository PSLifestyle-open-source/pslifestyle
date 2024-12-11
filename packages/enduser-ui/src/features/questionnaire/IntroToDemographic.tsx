import {
  FullWidthContainer,
  WideWidthContainer,
} from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import { ButtonLarge } from "../../common/components/ui/buttons";
import BackButtonInContainer from "../../common/components/ui/buttons/BackButtonInContainer";
import { VerticalButtonsContainer } from "../../common/components/ui/buttons/VerticalButtonsContainer";
import { useTranslation } from "react-i18next";

interface IntroToDemographicProps {
  onBackClick: () => unknown;
  onPrimaryButtonClick: () => void;
  onFinishQuestionnaireClick: () => void;
}

const IntroToDemographic: React.FC<IntroToDemographicProps> = ({
  onBackClick,
  onPrimaryButtonClick,
  onFinishQuestionnaireClick,
}) => {
  const { t } = useTranslation(["intros", "common"]);

  return (
    <>
      <BackButtonInContainer onClick={onBackClick} />
      <FullWidthContainer>
        <div className="flex flex-col gap-4 pb-4">
          <Heading
            level={1}
            type="headline-lg-eb"
            className="text-green-100 pb-2"
          >
            {t("introToDemographic.title")}
          </Heading>
          <Heading level={2} type="headline-sm-b">
            {t("introToDemographic.paragraph1")}
          </Heading>
          <Paragraph type="body-lg">
            {" "}
            {t("introToDemographic.paragraph2")}
          </Paragraph>
          <Paragraph type="body-lg">
            {t("introToDemographic.paragraph3")}
          </Paragraph>
          <div className="flex flex-col my-4">
            <div className="flex justify-center items-end">
              <Paragraph type="body-lg">
                {t("introToDemographic.paragraph4")}
              </Paragraph>
            </div>
          </div>
        </div>
        <WideWidthContainer>
          <VerticalButtonsContainer className="gap-4">
            <ButtonLarge
              theme="primary"
              onClick={onPrimaryButtonClick}
              cyData="introToDemographic.answer.button"
            >
              {t("extraQuestionsYes", { ns: "questionnaire" })}
            </ButtonLarge>
            <ButtonLarge
              theme="secondary"
              onClick={onFinishQuestionnaireClick}
              cyData="introToDemographic.goToResults.button"
            >
              {t("goToResults", { ns: "questionnaire" })}
            </ButtonLarge>
          </VerticalButtonsContainer>
        </WideWidthContainer>
      </FullWidthContainer>
    </>
  );
};

export default IntroToDemographic;
