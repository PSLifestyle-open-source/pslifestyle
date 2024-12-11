import { WideWidthContainer } from "../../common/components/layout/Container";
import { ProgressBar } from "../../common/components/ui/ProgressBar";
import { ButtonLarge } from "../../common/components/ui/buttons";
import useFinalFootprint from "../../common/hooks/useFinalFootprint";
import { usePercentageFromPickedActions } from "../../common/hooks/usePercentageFromPickedActions";
import { userPlanSelectors } from "../plan/userPlanSlice";
import ImpactDetails from "./ImpactDetails";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface Props {
  onNextClick?: () => unknown;
}

const RecommendationsFooter = ({ onNextClick }: Props) => {
  const selectedActions = useSelector(userPlanSelectors.selectedActions);
  const totalImpact = useSelector(userPlanSelectors.totalImpact);
  const { t } = useTranslation("recommendations");
  const userHasPickedAnAction = Object.keys(selectedActions).length > 0;
  const impactPercentage = usePercentageFromPickedActions() || 0;
  const { finalFootprint } = useFinalFootprint();

  return (
    <div className="fixed bottom-0 bg-green-20 w-full rounded-t-xl">
      <div className="lg:hidden h-3">
        <ProgressBar
          value={impactPercentage}
          baseColorClassName="bg-green-40"
          progressColorClassName="bg-green-100"
        />
      </div>
      <WideWidthContainer className="bottom-0 overflow-hidden">
        <div className="flex flex-row items-center w-full pt-2.5 lg:pt-3.5 pb-3.5 px-4 gap-5">
          <ImpactDetails
            currentValue={totalImpact}
            totalValue={finalFootprint}
            textColorClassName="text-green-dark"
          />
          <div className="flex-grow hidden lg:block h-3">
            <ProgressBar
              value={impactPercentage}
              baseColorClassName="bg-green-40"
              progressColorClassName="bg-green-100"
            />
          </div>
          {onNextClick && (
            <div className="flex justify-center">
              <ButtonLarge
                disabled={!userHasPickedAnAction}
                theme="goalCTA"
                icon={{ position: "right", type: "ArrowRight" }}
                onClick={onNextClick}
                cyData="recommendations.next.button"
              >
                {t("buttonNextQuestion", { ns: "questionnaire" })}
              </ButtonLarge>
            </div>
          )}
        </div>
      </WideWidthContainer>
    </div>
  );
};

export default RecommendationsFooter;
