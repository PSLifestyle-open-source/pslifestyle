import { WideWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import { ButtonLarge } from "../../common/components/ui/buttons";
import { OrdinaryQuestionCategory } from "@pslifestyle/common/src/types/genericTypes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ICategoryBasedMotivatorBoxProps {
  highestCategoryLabel: OrdinaryQuestionCategory;
}

const imagePathMap: Record<OrdinaryQuestionCategory, string> = {
  housing: "/images/icons/sofa.png",
  food: "/images/icons/burger.png",
  transport: "/images/icons/backpack.png",
  purchases: "/images/icons/bag.png",
};

const CategoryBasedCallToAction = ({
  highestCategoryLabel,
}: ICategoryBasedMotivatorBoxProps) => {
  const { t } = useTranslation(["results"]);
  const navigate = useNavigate();

  const imagePath = new URL(imagePathMap[highestCategoryLabel], import.meta.url)
    .href;

  return (
    <WideWidthContainer className="px-4 sm:px-0 mb-6">
      <div className="bg-pink-40 before:bg-pink-60 rounded-2xl bg-windmill-small flex flex-col sm:flex-row-reverse sm:items-stretch">
        <div
          className="h-48 sm:h-auto sm:ml-6 w-full bg-contain sm:bg-cover sm:flex-1 bg-right sm:bg-left"
          style={{
            backgroundImage: `url('${imagePath}')`,
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="px-6 pb-10 sm:pl-10 sm:pt-16 sm:pb-12 flex flex-col sm:w-96">
          <Heading level={2} type="headline-md-b" className="mb-4">
            {t(`categoryBasedCallToAction.${highestCategoryLabel}.title`, {
              ns: "results",
            })}
          </Heading>
          <Paragraph type="body-md" className="mb-6">
            {t(
              `categoryBasedCallToAction.${highestCategoryLabel}.description`,
              { ns: "results" },
            )}
          </Paragraph>
          <div className="text-center sm:text-left">
            <ButtonLarge
              theme="blackCTA"
              onClick={() => navigate("/recommendations")}
              icon={{ position: "right", type: "ChevronRight" }}
            >
              {t("makeYourPlanButton", { ns: "results" })}
            </ButtonLarge>
          </div>
        </div>
      </div>
    </WideWidthContainer>
  );
};

export default CategoryBasedCallToAction;
