import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import { ButtonLarge } from "../../common/components/ui/buttons";
import BackButtonInContainer from "../../common/components/ui/buttons/BackButtonInContainer";
import { VerticalButtonsContainer } from "../../common/components/ui/buttons/VerticalButtonsContainer";
import { useTranslation } from "react-i18next";

interface Props {
  onDismiss: () => unknown;
}

const IntroToRecommendations = ({ onDismiss }: Props) => {
  const { t } = useTranslation(["intros"]);

  return (
    <>
      <BackButtonInContainer />

      <FullWidthContainer>
        <div className="pb-14">
          <Heading
            level={1}
            type="headline-lg-eb"
            className="text-green-100 mb-3"
            data-cy="introToRecommendations.title"
          >
            {t("introToRecommendations.title")}
          </Heading>
          <Paragraph type="body-lg" data-cy="introToRecommendations.paragraph1">
            {t("introToRecommendations.paragraph1")}
          </Paragraph>
          <Paragraph type="body-lg">
            {t("introToRecommendations.paragraph2")}
          </Paragraph>
        </div>

        <VerticalButtonsContainer className="gap-4">
          <ButtonLarge
            onClick={onDismiss}
            cyData="introToRecommendations.continue.button"
          >
            {t("continue", { ns: "common" })}
          </ButtonLarge>
        </VerticalButtonsContainer>
      </FullWidthContainer>
    </>
  );
};

export default IntroToRecommendations;
