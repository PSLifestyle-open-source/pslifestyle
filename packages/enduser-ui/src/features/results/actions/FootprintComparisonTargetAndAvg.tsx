import { ResponsiveBar } from "@nivo/bar";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";
import { useTranslation, Trans } from "react-i18next";

type FootprintComparisonTargetAndAvgProps = {
  categorizedFootprint: CategorizedFootprint;
  targetOrAverage: number;
  percentage: number;
  maxVal: number;
  comparisonStringTranslKey: string;
  summaryTranslationKey: string;
  variant: "red" | "green";
  prefix?: string;
};

const FootprintComparisonTargetAndAvg = ({
  categorizedFootprint,
  maxVal,
  targetOrAverage,
  comparisonStringTranslKey,
  percentage,
  summaryTranslationKey,
  variant,
  prefix,
}: FootprintComparisonTargetAndAvgProps): JSX.Element => {
  const { housing, transport, food, purchases } = categorizedFootprint;

  const barChartData = [
    // order of keys shouldn't matter, but order of bars might
    {
      name: "Target",
      housing: 0,
      transport: 0,
      food: 0,
      purchases: 0,
      other: targetOrAverage,
    },
    {
      name: "User results",
      housing,
      transport,
      food,
      purchases,
      other: 0,
    },
  ];

  const { t } = useTranslation(["common", "results"]);

  const style = getComputedStyle(document.body);
  const brandOrange = style.getPropertyValue("--colors-orange-80");
  const brandPurple = style.getPropertyValue("--colors-purple-80");
  const brandPink = style.getPropertyValue("--colors-pink-80");
  const brandBlue = style.getPropertyValue("--colors-cyan-80");
  const brandGray = style.getPropertyValue("--colors-neutral-20");

  const colors: { [key: string]: string } = {
    housing: brandOrange,
    transport: brandPurple,
    food: brandPink,
    purchases: brandBlue,
    other: brandGray,
  };

  return (
    <div className="flex flex-col max-w-sm">
      <div className="flex items-center justify-between">
        <p data-cy="comparisonString.results" className="text-body-lg">
          <Trans
            i18nKey={`comparisonString.${comparisonStringTranslKey}`}
            ns="results"
            components={{ bolder: <span className="font-bold" /> }}
          />
        </p>
        <p
          data-cy="percentage"
          className={`text-heading-sm text-${variant}-100 font-black`}
        >
          {prefix}
          {percentage}%
        </p>
      </div>
      <div className="h-8">
        <ResponsiveBar
          data={barChartData}
          indexBy="name"
          keys={[
            // order matters
            "housing",
            "transport",
            "food",
            "purchases",
            "other",
          ]}
          maxValue={maxVal}
          /* margin={{ // of the rectangles of data - the legend is on that margin
          top: 20, right: 20, bottom: 20, left: 20,
        }} */
          padding={0.2}
          layout="horizontal"
          //   borderRadius={8}
          animate={false}
          colors={(d) => colors[d.id]}
          axisBottom={null}
          axisLeft={null}
          enableGridX={false}
          enableGridY={false}
          enableLabel={false}
          isInteractive={false}
        />
      </div>
      <div className="flex items-center">
        <div className="rounded-full w-3 h-3 mr-2 bg-neutral-20" />
        <p data-cy="resultsExtra" className="text-body-sm">
          {
            // Keep the extra space after the translated string
            `${t(summaryTranslationKey, { ns: "results" })} `
          }
          <span className="text-neutral-60">
            <span data-cy="targetOrAverage" className="font-bold">
              {targetOrAverage}
            </span>{" "}
            {t("kgCO2", { ns: "common" })}
          </span>
        </p>
      </div>
    </div>
  );
};

export default FootprintComparisonTargetAndAvg;
