import { ActionCardList } from "../../common/components/ActionCard/ActionCardList";
import { FeedbackBlock } from "../../common/components/Feedback/FeedbackBlock";
import { WideWidthContainer } from "../../common/components/layout/Container";
import ShareDialog from "../../common/components/sharing/ShareDialog";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import {
  categorizeActions,
  sortActionsByImpact,
} from "../../common/utils/actions";
import DetailedPlanProgress from "./DetailedPlanProgress";
import ShareablePlan from "./ShareablePlan";
import { userPlanSelectors } from "./userPlanSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const PlanList = (): JSX.Element => {
  const [planElementRef, setPlanElementRef] = useState<HTMLDivElement | null>(
    null,
  );
  const selectedActions = useSelector(userPlanSelectors.selectedActions);
  const selectedActionsByCategory = categorizeActions(
    sortActionsByImpact(selectedActions.slice()),
  );

  const { t } = useTranslation(["common", "recommendations"]);

  return (
    <WideWidthContainer className="pb-7">
      <ShareablePlan
        setRef={setPlanElementRef}
        selectedActions={selectedActions}
      />
      <div className="flex flex-col gap-4 text-center px-4">
        <Heading level={1} type="headline-lg-eb" className="mt-11">
          {t("planTitle", { ns: "recommendations" })}
        </Heading>
        <Paragraph type="body-md">
          {t("planDescription", { ns: "recommendations" })}
        </Paragraph>
      </div>
      <DetailedPlanProgress />
      <div className="mb-8 text-center">
        <ShareDialog
          shareTriggerButtonText={t("shareablePlan.sharePlan", {
            ns: "recommendations",
          })}
          title={t("shareablePlan.sharePlanTitle", { ns: "recommendations" })}
          description={t("shareablePlan.sharePlanText", {
            ns: "recommendations",
          })}
          cypressPrefix="sharePlan"
          elementRef={planElementRef}
          successfulShareMessage={t("shareResultsDownloadComplete", {
            ns: "results",
          })}
          sharedFilePrefix={t("shareablePlan.plan", {
            ns: "recommendations",
          })}
        />
      </div>
      <div className="flex flex-col gap-5 mb-16">
        <ActionCardList
          actions={selectedActionsByCategory.housing}
          cardRenderer="plan"
        />
        <ActionCardList
          actions={selectedActionsByCategory.transport}
          cardRenderer="plan"
        />
        <ActionCardList
          actions={selectedActionsByCategory.food}
          cardRenderer="plan"
        />
        <ActionCardList
          actions={selectedActionsByCategory.purchases}
          cardRenderer="plan"
        />
        <FeedbackBlock />
      </div>
    </WideWidthContainer>
  );
};

export default PlanList;
