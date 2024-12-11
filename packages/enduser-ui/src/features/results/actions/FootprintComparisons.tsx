import Heading from "../../../common/components/ui/Heading";
import {
  getPercentageDifference,
  valueForComparison,
} from "../../../common/utils/helpers";
import FootprintComparisonTargetAndAvg from "./FootprintComparisonTargetAndAvg";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";
import { useTranslation } from "react-i18next";

interface IProps {
  categorizedFootprint: CategorizedFootprint;
  totalFootprint: number;
  constants: MathScopes;
}

const FootprintComparisons = ({
  totalFootprint,
  categorizedFootprint,
  constants,
}: IProps): JSX.Element => {
  const onePointFiveTarget = constants?.ONE_POINT_FIVE_DEGREE_TARGET || 0;
  const percentageToTarget = getPercentageDifference(
    onePointFiveTarget,
    totalFootprint,
  );
  const countryAverage = constants?.COUNTRY_AVG_FOOTPRINT || 0;
  const percentageToCountryAvg = getPercentageDifference(
    countryAverage,
    totalFootprint,
  );

  const highestFootprint = Math.max(
    totalFootprint,
    onePointFiveTarget,
    countryAverage,
  );

  const isFootprintHigherThanTarget = totalFootprint > onePointFiveTarget;
  const isFootprintHigherThanAverage = totalFootprint > countryAverage;
  const { t } = useTranslation(["results"]);

  const valueForTarget = valueForComparison(
    "lowerThanTarget",
    "sameAsTarget",
    "higherThanTarget",
  );
  const valueForAverage = valueForComparison(
    "lowerThanAverage",
    "sameAsAverage",
    "higherThanAverage",
  );

  return (
    <div className="flex flex-col gap-4">
      <Heading level={2} type="headline-md-b" data-cy="comparedTo">
        {t("comparedTo", { ns: "results" })}
      </Heading>
      <FootprintComparisonTargetAndAvg // target
        variant={isFootprintHigherThanTarget ? "red" : "green"}
        prefix={isFootprintHigherThanTarget ? "+" : "-"}
        categorizedFootprint={categorizedFootprint}
        targetOrAverage={onePointFiveTarget}
        percentage={percentageToTarget}
        maxVal={highestFootprint}
        comparisonStringTranslKey={valueForTarget(
          totalFootprint,
          onePointFiveTarget,
        )}
        summaryTranslationKey="target"
      />
      <FootprintComparisonTargetAndAvg // country avg
        variant={isFootprintHigherThanAverage ? "red" : "green"}
        prefix={isFootprintHigherThanAverage ? "+" : "-"}
        categorizedFootprint={categorizedFootprint}
        targetOrAverage={countryAverage}
        percentage={percentageToCountryAvg}
        maxVal={highestFootprint}
        comparisonStringTranslKey={valueForAverage(
          totalFootprint,
          countryAverage,
        )}
        summaryTranslationKey="peopleInCountry"
      />
    </div>
  );
};

export default FootprintComparisons;
