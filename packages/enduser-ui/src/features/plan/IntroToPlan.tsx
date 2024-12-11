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

const IntroToPlan = ({ onDismiss }: Props) => {
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
            data-cy="introToPlan.title"
          >
            {t("introToPlan.title")}
          </Heading>
          <Paragraph type="body-lg" data-cy="introToPlan.paragraph1">
            {t("introToPlan.paragraph1")}
          </Paragraph>
          <Paragraph type="body-lg">{t("introToPlan.paragraph2")}</Paragraph>
        </div>

        <VerticalButtonsContainer className="gap-4">
          <ButtonLarge onClick={onDismiss} cyData="introToPlan.continue.button">
            {t("continue", { ns: "common" })}
          </ButtonLarge>
        </VerticalButtonsContainer>
      </FullWidthContainer>
    </>
  );
};

export default IntroToPlan;
