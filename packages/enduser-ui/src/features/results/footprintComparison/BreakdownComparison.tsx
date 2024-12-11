import { createLabelObjects } from "../../../common/utils/helpers";
import ResultsAccordionContent from "../common/ResultsAccordionContent";
import ResultsAccordionTrigger from "../common/ResultsAccordionTrigger";
import ResultsPieChart from "../common/ResultsPieChart";
import FootprintBreakdown from "./breakdownComparison/FootprintBreakdown";
import {
  CalculatedAnswer,
  CategorizedFootprint,
} from "@pslifestyle/common/src/types/questionnaireTypes";
import * as Accordion from "@radix-ui/react-accordion";
import { useTranslation } from "react-i18next";

interface IBreakdownComparisonProps {
  ordinaryAnswers: CalculatedAnswer[];
  totalFootprint: number;
  categorizedFootprint: CategorizedFootprint;
}

const BreakdownComparison = ({
  ordinaryAnswers,
  totalFootprint,
  categorizedFootprint,
}: IBreakdownComparisonProps) => {
  const { t, i18n } = useTranslation("results");

  const questionAndRecommendationTranslations = i18n.getResourceBundle(
    i18n.language,
    "questionAndRecommendationTranslations",
  );

  const footprintByLabels =
    ordinaryAnswers &&
    createLabelObjects(ordinaryAnswers, questionAndRecommendationTranslations);

  return (
    <Accordion.Item value="category-comparison">
      <ResultsAccordionTrigger backgroundImagePath="/images/icons/piechart.svg">
        {t("breakdownTitle", { ns: "results" })}
      </ResultsAccordionTrigger>
      <ResultsAccordionContent>
        <div className="mb-4">
          <ResultsPieChart
            totalFootprint={totalFootprint}
            categorizedFootprint={categorizedFootprint}
          />
        </div>

        <FootprintBreakdown footprintByLabelArray={footprintByLabels || []} />
      </ResultsAccordionContent>
    </Accordion.Item>
  );
};

export default BreakdownComparison;
