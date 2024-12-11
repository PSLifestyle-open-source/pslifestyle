import { FullWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import { ButtonLarge } from "../../common/components/ui/buttons";
import BackButtonInContainer from "../../common/components/ui/buttons/BackButtonInContainer";
import { VerticalButtonsContainer } from "../../common/components/ui/buttons/VerticalButtonsContainer";
import useTrack from "../../common/hooks/useTrack";
import { colors } from "../../common/utils/helpers";
import IntroToDemographic from "./IntroToDemographic";
import { useTranslation } from "react-i18next";

interface IntroToQuestionnaireCategoryProps {
  category: string;
  onBackClick: () => void;
  onPrimaryButtonClick: () => void;
  onFinishQuestionnaireClick: () => void;
  visibleQuestionIndex: number;
}

const IntroToQuestionnaireCategory: React.FC<
  IntroToQuestionnaireCategoryProps
> = ({
  category,
  onBackClick,
  onPrimaryButtonClick,
  onFinishQuestionnaireClick,
  visibleQuestionIndex,
}) => {
  const { t } = useTranslation(["intros"]);

  const isOnFirstQuestion = visibleQuestionIndex === 0;

  useTrack(category);

  if (category === "demographic") {
    return (
      <IntroToDemographic
        onBackClick={onBackClick}
        onPrimaryButtonClick={onPrimaryButtonClick}
        onFinishQuestionnaireClick={onFinishQuestionnaireClick}
      />
    );
  }

  return (
    <>
      <BackButtonInContainer
        onClick={!isOnFirstQuestion ? onBackClick : undefined}
      />
      <FullWidthContainer>
        <div className="flex flex-col gap-4 pb-4 px-4 text-center">
          <Heading
            level={1}
            type="headline-lg-eb"
            className={`text-${colors[category]}-100`}
          >
            {t(`introToQuestionnaireCategory.${category}.title`)}
          </Heading>
          <img
            className="h-[128px] flex flex-col gap-4 w-fit mx-auto my-4"
            alt=""
            src={`/images/${category}.svg`}
          />
          <Paragraph type="body-lg">
            {t(`introToQuestionnaireCategory.${category}.paragraph1`)}
          </Paragraph>
          <Paragraph type="body-lg">
            {t(`introToQuestionnaireCategory.${category}.paragraph2`)}
          </Paragraph>
          <VerticalButtonsContainer className="gap-4">
            <ButtonLarge
              onClick={onPrimaryButtonClick}
              cyData="enterNextCategory.button"
            >
              {t("continue", { ns: "common" })}
            </ButtonLarge>
          </VerticalButtonsContainer>
        </div>
      </FullWidthContainer>
    </>
  );
};

export default IntroToQuestionnaireCategory;
