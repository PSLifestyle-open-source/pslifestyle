import FootprintBarChart from "../../common/components/FootprintBarChart";
import { WideWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import { ButtonLarge } from "../../common/components/ui/buttons";
import { determineProfileCardContent } from "./determineProfileCardContent";
import { OrdinaryQuestionCategory } from "@pslifestyle/common/src/types/genericTypes";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface IProfileCardProps {
  totalFootprint: number;
  targetFootprint: number;
  categorizedFootprint: CategorizedFootprint;
  countryCode: string;
  lowestCategoryLabel: OrdinaryQuestionCategory;
  highestCategoryLabel: OrdinaryQuestionCategory;
}

interface ProfileInformationProps {
  imagePath: string;
  titleTranslationKey: string;
  descriptionTranslationKey: string;
}

const ProfileInformationDesktop = ({
  imagePath,
  titleTranslationKey,
  descriptionTranslationKey,
}: ProfileInformationProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("results");

  return (
    <div className="hidden sm:flex flex-row-reverse sm:items-stretch">
      <div
        className="h-48 sm:h-auto sm:ml-6 w-full bg-contain sm:bg-cover sm:flex-1 bg-right sm:bg-left"
        style={{
          backgroundImage: `url('${imagePath}')`,
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="px-8 pt-4 sm:pb-8 flex flex-col sm:w-96">
        <Heading level={2} type="headline-md-b" className="mb-4">
          {t(titleTranslationKey, { ns: "results" })}
        </Heading>
        <Paragraph type="body-md" className="mb-6">
          {t(descriptionTranslationKey, {
            ns: "results",
          })}
        </Paragraph>
        <div className="text-center sm:text-left">
          <ButtonLarge
            theme="blackCTA"
            onClick={() => navigate("/recommendations")}
            icon={{ position: "right", type: "ChevronRight" }}
          >
            {t("goToRecommendationsProfileCard", { ns: "results" })}
          </ButtonLarge>
        </div>
      </div>
    </div>
  );
};
const ProfileInformationMobile = ({
  imagePath,
  titleTranslationKey,
  descriptionTranslationKey,
}: ProfileInformationProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation("results");

  return (
    <div className="sm:hidden">
      <div className="h-40 flex flex-row items-end">
        <Heading
          level={1}
          type="headline-md-b"
          className=" min-w-[200xp] w-[62%] pl-6"
        >
          {t(titleTranslationKey, { ns: "results" })}
        </Heading>
        <div
          className="h-72 w-72 bg-cover"
          style={{
            backgroundImage: `url('${imagePath}')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left 25px",
          }}
        />
      </div>
      <div className="px-6">
        <Paragraph type="body-md" className="pt-2.5 mb-5">
          {t(descriptionTranslationKey, {
            ns: "results",
          })}
        </Paragraph>
        <div className="text-center mb-4">
          <ButtonLarge
            theme="blackCTA"
            onClick={() => navigate("/recommendations")}
            icon={{ position: "right", type: "ChevronRight" }}
          >
            {t("goToRecommendationsProfileCard", { ns: "results" })}
          </ButtonLarge>
        </div>
      </div>
    </div>
  );
};

const TargetVisualization = ({
  totalFootprint,
  targetFootprint,
}: Pick<IProfileCardProps, "totalFootprint" | "targetFootprint">) => {
  const { t } = useTranslation("results");
  const targetFootprintBarLength =
    targetFootprint > totalFootprint
      ? "100%"
      : `${(targetFootprint / totalFootprint) * 100}%`;
  const totalFootprintBarLength =
    totalFootprint > targetFootprint
      ? "100%"
      : `${(totalFootprint / targetFootprint) * 100}%`;
  return (
    <div className="px-4 pt-4 pb-6 sm:px-8 sm:pt-8 flex flex-col">
      <div className="flex flex-row gap-2 mb-3">
        <div
          className="h-2 bg-cyan-100 flex-1"
          style={{ width: totalFootprintBarLength }}
        />
        <div
          className="hidden sm:block h-2 bg-green-100"
          style={{ width: targetFootprintBarLength }}
        />
        <div className="sm:hidden h-2 flex-1">
          <div
            className="h-2 bg-green-100"
            style={{ width: targetFootprintBarLength }}
          />
        </div>
      </div>
      <div className="flex flex-row px-2 sm:px-0 gap-4">
        <div className="flex-1 pr-1">
          <p className="title-sm">{t("myFootprint", { ns: "results" })}</p>
          <p className="leading-4">
            <span
              className="headline-xl-eb"
              data-cy="round(userFootprintByCategory.overall)"
            >
              {totalFootprint}
            </span>
            <span>&nbsp;</span>
            <span className="body-sm whitespace-pre">kg CO2e</span>
          </p>
        </div>
        <div className="flex-1 sm:flex-none pl-1">
          <p className="title-sm">
            {t("targetTargetVisualization", { ns: "results" })}
          </p>
          <p className="leading-4">
            <span className="headline-sm-eb block">{targetFootprint} </span>
            <span className="body-sm whitespace-pre">kg CO2e</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({
  targetFootprint,
  totalFootprint,
  categorizedFootprint,
  countryCode,
  lowestCategoryLabel,
  highestCategoryLabel,
}: IProfileCardProps) => {
  const { titleTranslationKey, descriptionTranslationKey, imagePath } =
    determineProfileCardContent(
      countryCode,
      lowestCategoryLabel,
      highestCategoryLabel,
      totalFootprint,
    );

  return (
    <WideWidthContainer className="bg-yellow-60 sm:rounded-2xl bg-[url('/images/icons/windmill-yellow.svg')] bg-no-repeat sm:mb-6 sm:mt-4">
      <TargetVisualization
        targetFootprint={targetFootprint}
        totalFootprint={totalFootprint}
      />
      <ProfileInformationDesktop
        imagePath={imagePath}
        titleTranslationKey={`profileCard.${titleTranslationKey}.title`}
        descriptionTranslationKey={`profileCard.${titleTranslationKey}.${descriptionTranslationKey}`}
      />
      <ProfileInformationMobile
        imagePath={imagePath}
        titleTranslationKey={`profileCard.${titleTranslationKey}.title`}
        descriptionTranslationKey={`profileCard.${titleTranslationKey}.${descriptionTranslationKey}`}
      />
      <div className="mx-4 mt-4 mb-8">
        <FootprintBarChart categorizedFootprint={categorizedFootprint} />
      </div>
    </WideWidthContainer>
  );
};

export default ProfileCard;
