import { FullWidthContainer } from "../../common/components/layout/Container";
import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import Message from "../../common/components/ui/Message";
import { useFullMathScope } from "../../common/hooks/firebaseHooks";
import { useDetermineHighestLowestCategory } from "../../common/hooks/useDetermineHighestLowestCategory";
import { locationSelectors } from "../location/locationSlice";
import { GoToQuestionnaireButton } from "../questionnaire/GoToQuestionnaireButton";
import { userAnswersSelectors } from "../questionnaire/userAnswersSlice";
import Actions from "./Actions";
import CategoryBasedCallToAction from "./CategoryBasedCallToAction";
import FootprintComparison from "./FootprintComparison";
import GoToRecommendationBar from "./GoToRecommendationBar";
import ProfileCard from "./ProfileCard";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ResultsPage = (): JSX.Element | null => {
  const navigate = useNavigate();
  const country = useSelector(locationSelectors.country);
  const hasAnswers = useSelector(userAnswersSelectors.hasAnswers);
  const categorizedFootprint = useSelector(
    userAnswersSelectors.categorizedFootprint,
  );
  const ordinaryAnswers = useSelector(userAnswersSelectors.ordinaryAnswers);
  const totalFootprint = useSelector(userAnswersSelectors.totalFootprint);

  const { error, loading, fullMathScope } = useFullMathScope();
  const { t } = useTranslation("results");
  const { lowestCategory, highestCategory } =
    useDetermineHighestLowestCategory();

  useEffect(() => {
    if (!country) navigate("/selections");
    if (!hasAnswers || !fullMathScope) navigate("/test");
  }, [country, hasAnswers, navigate, fullMathScope]);

  return (
    <ContainerLoader loading={loading}>
      {(!hasAnswers || !country || error || !fullMathScope) && (
        <FullWidthContainer>
          <Message text={t("noResultsYet", { ns: "results" })}>
            <GoToQuestionnaireButton />
          </Message>
        </FullWidthContainer>
      )}
      {hasAnswers && country && fullMathScope && (
        <>
          <ProfileCard
            totalFootprint={Math.round(totalFootprint)}
            targetFootprint={Math.round(
              fullMathScope!.ONE_POINT_FIVE_DEGREE_TARGET,
            )}
            categorizedFootprint={categorizedFootprint}
            countryCode={country.code}
            lowestCategoryLabel={lowestCategory.label}
            highestCategoryLabel={highestCategory.label}
          />
          <FootprintComparison
            ordinaryAnswers={ordinaryAnswers}
            categorizedFootprint={categorizedFootprint}
            countryCode={country.code}
            totalFootprint={totalFootprint}
            targetFootprint={Math.round(
              fullMathScope!.ONE_POINT_FIVE_DEGREE_TARGET,
            )}
            averageFootprintPerCountry={Object.entries(fullMathScope).reduce(
              (aggregator: Record<string, number>, [key, value]) => {
                if (key.includes("AVG_FOOTPRINT_")) {
                  return { ...aggregator, [key.slice(-2)]: value };
                }

                return aggregator;
              },
              {},
            )}
          />
          <CategoryBasedCallToAction
            highestCategoryLabel={highestCategory.label}
          />
          <Actions
            totalFootprint={totalFootprint}
            categorizedFootprint={categorizedFootprint}
            fullMathScope={fullMathScope}
          />
          <GoToRecommendationBar />
        </>
      )}
    </ContainerLoader>
  );
};

export default ResultsPage;
