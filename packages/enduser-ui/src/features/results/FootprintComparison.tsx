import { WideWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import BreakdownComparison from "./footprintComparison/BreakdownComparison";
import ComparisonPerCountry from "./footprintComparison/ComparisonPerCountry";
import GenericCallToAction from "./footprintComparison/GenericCallToAction";
import OwnCountryComparison from "./footprintComparison/OwnCountryComparison";
import {
  CalculatedAnswer,
  CategorizedFootprint,
} from "@pslifestyle/common/src/types/questionnaireTypes";
import * as Accordion from "@radix-ui/react-accordion";
import { useTranslation } from "react-i18next";

interface IFootprintComparisonProps {
  ordinaryAnswers: CalculatedAnswer[];
  averageFootprintPerCountry: Record<string, number>;
  totalFootprint: number;
  targetFootprint: number;
  countryCode: string;
  categorizedFootprint: CategorizedFootprint;
}

const FootprintComparison = ({
  ordinaryAnswers,
  categorizedFootprint,
  totalFootprint,
  targetFootprint,
  averageFootprintPerCountry,
  countryCode,
}: IFootprintComparisonProps) => {
  const { t } = useTranslation("results");

  return (
    <WideWidthContainer className="pt-6 px-4 sm:pt-0 sm:px-8 mb-6 sm:bg-basic-white sm:rounded-2xl bg-windmill before:bg-basic-white">
      <div className="sm:text-center">
        <Heading level={2} type="headline-md-b" className="my-8 sm:my-6">
          {t("comparedTo", { ns: "results" })}
        </Heading>
      </div>
      <Accordion.Root type="multiple" asChild>
        <div className="flex flex-col gap-6 sm:gap-8 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex-1">
              <OwnCountryComparison
                targetFootprint={targetFootprint}
                countryCode={countryCode}
                totalFootprint={totalFootprint}
                averageFootprintPerCountry={averageFootprintPerCountry}
              />
            </div>
            <div className="flex-1">
              <GenericCallToAction />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex-1">
              <BreakdownComparison
                ordinaryAnswers={ordinaryAnswers}
                totalFootprint={totalFootprint}
                categorizedFootprint={categorizedFootprint}
              />
            </div>
            <div className="flex-1">
              <ComparisonPerCountry
                averageFootprintPerCountry={averageFootprintPerCountry}
                totalFootprint={totalFootprint}
                targetFootprint={targetFootprint}
              />
            </div>
          </div>
        </div>
      </Accordion.Root>
    </WideWidthContainer>
  );
};

export default FootprintComparison;
