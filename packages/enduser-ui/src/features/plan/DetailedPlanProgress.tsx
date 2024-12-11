import {
  NarrowWidthContainer,
  WideWidthContainer,
} from "../../common/components/layout/Container";
import { usePercentageOfAccomplishedPlan } from "../../common/hooks/usePercentageOfAccomplishedPlan";
import { userPlanSelectors } from "./userPlanSlice";
import * as Progress from "@radix-ui/react-progress";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const DetailedPlanProgress = () => {
  const { t } = useTranslation("recommendations");
  const totalCompletedActionsImpact = useSelector(
    userPlanSelectors.totalCompletedActionsImpact,
  );
  const totalImpact = useSelector(userPlanSelectors.totalImpact);
  const completedAgainstSelectedActionsImpactPercentage =
    usePercentageOfAccomplishedPlan();
  const legendSuffix = "kg CO2e";
  const labelSuffix = "kg";

  const roundedSelectedActionsImpact = Math.round(totalImpact);
  const roundedCompletedActionsImpact = Math.round(totalCompletedActionsImpact);

  return (
    <WideWidthContainer className="bg-basic-white rounded-2xl my-8">
      <NarrowWidthContainer className="pt-7 pb-6 px-4">
        <div className="flex flex-row label-md mb-3">
          <span className="grow text-green-100">
            {roundedCompletedActionsImpact} {labelSuffix}
          </span>
          <span className="text-green-60">
            {roundedSelectedActionsImpact} {labelSuffix}
          </span>
        </div>
        <Progress.Root
          className="h-6 bg-green-30 rounded-xl mb-2.5"
          value={completedAgainstSelectedActionsImpactPercentage}
        >
          <Progress.Indicator
            className="h-6 bg-green-100 rounded-xl"
            style={{
              transition: "width 200ms ease-in-out",
              width: `${completedAgainstSelectedActionsImpactPercentage}%`,
            }}
          />
        </Progress.Root>
        <div className="flex flex-col gap-2.5 my-3">
          <div className="flex flex-row items-center mt-2.5">
            <div className="w-2.5 h-2.5 mr-2 bg-green-100" />
            <div className="grow meta-sm">{t("planGraph.legend1")}</div>
            <div className="label-sm">
              {roundedCompletedActionsImpact} {legendSuffix}
            </div>
          </div>
          <div className="flex flex-row items-center mt-2.5">
            <div className=" w-2.5 h-2.5 mr-2 bg-green-40" />
            <div className="grow meta-sm">{t("planGraph.legend2")}</div>
            <div className="label-sm">
              {roundedSelectedActionsImpact} {legendSuffix}
            </div>
          </div>
        </div>
      </NarrowWidthContainer>
    </WideWidthContainer>
  );
};

export default DetailedPlanProgress;
