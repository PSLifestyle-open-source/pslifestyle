import FootprintBarChart from "../../common/components/FootprintBarChart";
import {
  FullWidthContainer,
  NarrowWidthContainer,
} from "../../common/components/layout/Container";
import Message from "../../common/components/ui/Message";
import Paragraph from "../../common/components/ui/Paragraph";
import { usePersistUserPlan } from "../../common/hooks/firebaseHooks";
import { GoToQuestionnaireButton } from "../questionnaire/GoToQuestionnaireButton";
import { userAnswersSelectors } from "../questionnaire/userAnswersSlice";
import IntroToRecommendations from "./IntroToRecommendations";
import RecommendationsFooter from "./RecommendationsFooter";
import { RecommendationsList } from "./RecommendationsList";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RecommendationsPage = (): JSX.Element => {
  const totalFootprint = useSelector(userAnswersSelectors.totalFootprint);
  const categorizedFootprint = useSelector(
    userAnswersSelectors.categorizedFootprint,
  );
  const hasAnswers = useSelector(userAnswersSelectors.hasAnswers);

  const {
    state: savePlanState,
    reset: resetSavePlanState,
    sendPlanToBackend,
  } = usePersistUserPlan();
  const navigate = useNavigate();

  const handleSavePlan = async () => {
    try {
      await sendPlanToBackend();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (savePlanState.success) {
      resetSavePlanState();
      navigate("/plan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePlanState.success]);

  const [showIntroduction, setShowIntroduction] = useState(true);
  const { t } = useTranslation(["recommendations", "results"]);
  const hideIntroduction = () => setShowIntroduction(false);

  if (!hasAnswers) {
    return (
      <Message text={t("noResultsYet", { ns: "results" })}>
        <GoToQuestionnaireButton />
      </Message>
    );
  }

  if (showIntroduction) {
    return <IntroToRecommendations onDismiss={hideIntroduction} />;
  }

  return (
    <>
      <FullWidthContainer className="mb-16">
        <NarrowWidthContainer className="mt-4 pt-3">
          <Paragraph
            type="body-md"
            data-cy="currentFootprint.totalFootprint"
            className="text-center mb-6"
          >
            {t("currentFootprintRecommendationPage", {
              footprintInNumber: (Number(totalFootprint) || 0).toFixed(),
            })}
          </Paragraph>
          <FootprintBarChart categorizedFootprint={categorizedFootprint} />
        </NarrowWidthContainer>
        <RecommendationsList
          resetSaveState={resetSavePlanState}
          isLoading={savePlanState.loading}
          isError={savePlanState.error}
        />
      </FullWidthContainer>
      <RecommendationsFooter onNextClick={handleSavePlan} />
    </>
  );
};

export default RecommendationsPage;
