import FootprintBarChart from "../../common/components/FootprintBarChart";
import {
  FullWidthContainer,
  NarrowWidthContainer,
} from "../../common/components/layout/Container";
import Message from "../../common/components/ui/Message";
import Paragraph from "../../common/components/ui/Paragraph";
import useFinalFootprint from "../../common/hooks/useFinalFootprint";
import { GoToQuestionnaireButton } from "../questionnaire/GoToQuestionnaireButton";
import { userAnswersSelectors } from "../questionnaire/userAnswersSlice";
import IntroToPlan from "./IntroToPlan";
import PlanFooter from "./PlanFooter";
import PlanList from "./PlanList";
import { userPlanSelectors } from "./userPlanSlice";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const PlanPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { finalFootprint, finalCategorizedFootprint } = useFinalFootprint();
  const applicableActions = useSelector(userPlanSelectors.applicableActions);
  const totalImpact = useSelector(userPlanSelectors.totalImpact);

  const hasAnswers = useSelector(userAnswersSelectors.hasAnswers);

  useEffect(() => {
    // length 0 of applicableActions tells us that user plan store isn't initialized yet. In such case, we should wait until it is initialized
    if (applicableActions.length > 0 && totalImpact === 0 && hasAnswers) {
      navigate("/recommendations");
    }
  }, [applicableActions, totalImpact, hasAnswers, navigate]);

  const [isShowIntroduction, setIsShowIntroduction] = useState(true);
  const { t } = useTranslation(["recommendations", "results"]);

  if (!hasAnswers) {
    return (
      <Message text={t("noResultsYet", { ns: "results" })}>
        <GoToQuestionnaireButton />
      </Message>
    );
  }

  const hideIntroduction = () => setIsShowIntroduction(false);

  if (isShowIntroduction) {
    return <IntroToPlan onDismiss={hideIntroduction} />;
  }

  return (
    <>
      <FullWidthContainer className="mb-16">
        <NarrowWidthContainer className="mt-4 pt-3">
          <Paragraph
            type="label-md"
            data-cy="currentFootprint.totalFootprint"
            className="text-center mb-6"
          >
            {t("currentFootprintPlanPage", {
              footprintInNumber: (Number(finalFootprint) || 0).toFixed(),
            })}
          </Paragraph>
          <FootprintBarChart categorizedFootprint={finalCategorizedFootprint} />
        </NarrowWidthContainer>
        <PlanList />
      </FullWidthContainer>
      <PlanFooter />
    </>
  );
};
