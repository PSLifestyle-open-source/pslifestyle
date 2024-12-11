import LogoSvg from "../../assets/images/logo.svg";
import useFinalFootprint from "../../common/hooks/useFinalFootprint";
import { colors } from "../../common/utils/helpers";
import { locationSelectors } from "../location/locationSlice";
import { userPlanSelectors } from "./userPlanSlice";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface ShareablePlanProps {
  setRef: (ref: HTMLDivElement | null) => void;
  selectedActions: CalculatedAction[];
}

type ShareablePickedActionProps = {
  id: string;
  index: number;
  category: string;
};

const ShareablePickedAction = ({
  id,
  index,
  category,
}: ShareablePickedActionProps) => {
  const { t } = useTranslation(["questionAndRecommendationTranslations"]);
  const country = useSelector(locationSelectors.country);
  const bgColor = `bg-${colors[category.toLowerCase()]}-40`;
  const textColor = `text-${colors[category.toLowerCase()]}-dark`;
  return (
    <div className={`rounded-full ${bgColor} flex my-2`}>
      <div className="font-bold text-neutral-white text-heading-sm py-1.5 border-neutral-white border-r-2 pl-2 w-[60px] flex align-center">
        {index + 1}.
      </div>
      <div
        className={`font-bold ${textColor} text-heading-sm py-1.5 border-neutral-white border-l-2 flex justify-center flex-1 text-center`}
      >
        {t(`${id}_actionTitle_${country?.code}`, {
          ns: "questionAndRecommendationTranslations",
        })}
      </div>
    </div>
  );
};

const ShareablePlan: React.FC<ShareablePlanProps> = ({
  setRef,
  selectedActions,
}): JSX.Element => {
  const totalImpact = useSelector(userPlanSelectors.totalImpact);
  const { t } = useTranslation(["common", "recommendations"]);
  const top3Actions = selectedActions.slice(0, 3); // TODO: Maybe needs new logic.  This is just to make it work
  const { finalFootprint } = useFinalFootprint();
  return (
    <div
      ref={(ref) => setRef(ref)}
      aria-hidden="true"
      className="invisible-shareable p-3 flex flex-col justify-between w-[800px]"
    >
      <p className="pb-2 text-heading-xl text-green-100 font-black">
        {t("shareablePlan.title", { ns: "recommendations" })}
      </p>

      <div className="gap-5">
        <p className="title-md">
          {t("shareablePlan.top3ImpactfulActions", { ns: "recommendations" })}
        </p>
        {top3Actions.map((action, index) => (
          <ShareablePickedAction
            key={action.id}
            id={action.id}
            index={index}
            category={action.category}
          />
        ))}
      </div>

      <div className="flex gap-5">
        <div>
          <p className="title-md">
            {t("shareablePlan.iProduce", { ns: "recommendations" })}
          </p>
          <p className="pt-1 pb-3">
            <span className="leading-none text-heading-xl text-orange-100 font-black pr-1">
              {finalFootprint.toFixed(0)}
            </span>
            {t("kgCO2inYear", { ns: "common" })}
          </p>
        </div>
        <div>
          <p className="title-md">
            {t("shareablePlan.completingMyPlan", { ns: "recommendations" })}
          </p>
          <p className="pt-1 pb-3">
            <span className="leading-none text-heading-xl text-green-100 font-black pr-1">
              - {totalImpact.toFixed(0)}
            </span>
            {t("kgCO2inYear", { ns: "common" })}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-heading-lg text-green-100 font-black">
            {t("shareablePlan.linkTagline", { ns: "recommendations" })}
          </p>
          <p className="text-heading-sm font-black"></p>
        </div>
        <img className="h-12" src={LogoSvg} alt="PS Lifestyle" />
      </div>
    </div>
  );
};

export default ShareablePlan;
