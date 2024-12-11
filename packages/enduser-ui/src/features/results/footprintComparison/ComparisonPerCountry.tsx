import Paragraph from "../../../common/components/ui/Paragraph";
import ResultsAccordionContent from "../common/ResultsAccordionContent";
import ResultsAccordionTrigger from "../common/ResultsAccordionTrigger";
import CountryTickRenderer from "./comparisonBarDiagram/CountryTickRenderer";
import TargetTickRenderer from "./comparisonBarDiagram/TargetTickRenderer";
import YouTickRenderer from "./comparisonBarDiagram/YouTickRenderer";
import { ResponsiveBar } from "@nivo/bar";
import * as Accordion from "@radix-ui/react-accordion";
import { useTranslation } from "react-i18next";

interface IComparisonPerCountryProps {
  averageFootprintPerCountry: Record<string, number>;
  totalFootprint: number;
  targetFootprint: number;
}

const ComparisonPerCountry = ({
  averageFootprintPerCountry,
  totalFootprint,
  targetFootprint,
}: IComparisonPerCountryProps) => {
  const { t } = useTranslation("results");
  const arrayOfCountryNameFootprintObjects: {
    name: string;
    footprint: number;
  }[] = [
    ...Object.entries(averageFootprintPerCountry).map(
      ([countryCode, footprint]) => ({
        name: countryCode,
        footprint,
      }),
    ),
    {
      name: "YOU",
      footprint: Number(totalFootprint.toFixed()),
    },
    {
      name: "TARGET",
      footprint: targetFootprint,
    },
  ];
  arrayOfCountryNameFootprintObjects.sort((a, b) => b.footprint - a.footprint);

  const style = getComputedStyle(document.body);
  const brandOrange = style.getPropertyValue("--colors-orange-80");
  const brandGreen = style.getPropertyValue("--colors-green-80");
  const brandLightGray = style.getPropertyValue("--colors-neutral-10");

  return (
    <Accordion.Item value="all-countries-comparison">
      <ResultsAccordionTrigger backgroundImagePath="/images/icons/countries-balls.svg">
        {t("comparedToAllCountriesAverages", { ns: "results" })}
      </ResultsAccordionTrigger>
      <ResultsAccordionContent>
        <div className="h-[400px] pr-2 w-full flex force-svg-full-width">
          <ResponsiveBar
            data={arrayOfCountryNameFootprintObjects}
            indexBy="name"
            keys={["footprint"]}
            enableLabel={false}
            margin={{
              // of the rectangles of data - the legend is on that margin
              top: -10,
              right: 0,
              bottom: 0,
              left: 41.5,
            }}
            padding={0.375}
            layout="horizontal"
            borderRadius={12}
            animate={false}
            colors={(d) => {
              switch (d.data.name) {
                case "YOU":
                  return brandOrange;
                case "TARGET":
                  return brandGreen;
                default:
                  return brandLightGray;
              }
            }}
            axisBottom={null}
            axisRight={null}
            axisTop={null}
            axisLeft={{
              tickSize: 1,
              renderTick: (tick) => {
                switch (tick.value) {
                  case "YOU":
                    return (
                      <YouTickRenderer
                        tick={tick}
                        arrayOfCountryNameFootprintObjects={
                          arrayOfCountryNameFootprintObjects
                        }
                      />
                    );
                  case "TARGET":
                    return (
                      <TargetTickRenderer
                        tick={tick}
                        arrayOfCountryNameFootprintObjects={
                          arrayOfCountryNameFootprintObjects
                        }
                      />
                    );
                  default:
                    return (
                      <CountryTickRenderer
                        tick={tick}
                        arrayOfCountryNameFootprintObjects={
                          arrayOfCountryNameFootprintObjects
                        }
                      />
                    );
                }
              },
            }}
            enableGridX={false}
            enableGridY={false}
            isInteractive={false}
            layers={["bars", "axes"]}
          />
        </div>
        <div className="flex flex-row gap-2 ml-1.5 mb-2">
          <div className="flex flex-row items-center gap-[5px]">
            <div className="rounded-sm w-2.5 h-2.5 bg-orange-80 mt-0.5" />
            <Paragraph
              data-cy="yourFootprint.results"
              type="body-md"
              className="meta-sm"
            >
              {t("yourFootprint", { ns: "results" })}
            </Paragraph>
          </div>
          <div className="flex flex-row items-center">
            <div className="rounded-sm w-2.5 h-2.5 mr-1 bg-green-80 mt-0.5" />
            <Paragraph
              data-cy="target.results"
              type="body-md"
              className="meta-sm"
            >
              {t("targetComparisonLabel", { ns: "results" })}
            </Paragraph>
          </div>
        </div>
      </ResultsAccordionContent>
    </Accordion.Item>
  );
};

export default ComparisonPerCountry;
