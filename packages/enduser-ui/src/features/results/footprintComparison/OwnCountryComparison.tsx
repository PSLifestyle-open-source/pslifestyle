import { useTranslation } from "react-i18next";

interface IOwnCountryComparisonProps {
  averageFootprintPerCountry: Record<string, number>;
  totalFootprint: number;
  targetFootprint: number;
  countryCode: string;
}

const OwnCountryComparisonBar = ({
  barWidth,
  color,
  titleTranslationKey,
  footprint,
}: {
  titleTranslationKey: string;
  color: "cyan-80" | "purple-80" | "green-80";
  footprint: number;
  barWidth: number;
}) => {
  const { t } = useTranslation("results");

  return (
    <div className="relative w-full h-[110px]">
      <div
        className={`w-full h-[110px] bg-${color} absolute rounded-br-[3rem]`}
        style={{
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom right",
          width: `${barWidth}%`,
        }}
      />

      <div className="flex flex-row items-center relative w-full h-full gap-4">
        <div className="title-sm ml-4 grow z-10">
          {t(titleTranslationKey, { ns: "results" })}
        </div>
        <div className="text-right mr-4 z-10">
          <p className="headline-lg-eb">{Math.round(footprint)}</p>
          <p className="body-md -mt-[9px]">kgCO2e</p>
        </div>
      </div>
    </div>
  );
};

const OwnCountryComparison = ({
  averageFootprintPerCountry,
  targetFootprint,
  totalFootprint,
  countryCode,
}: IOwnCountryComparisonProps) => {
  if (!averageFootprintPerCountry[countryCode]) {
    return null;
  }

  let countryFootprintBarLength: number;
  let targetFootprintBarLength: number;
  let totalFootprintBarLength: number;
  const countryFootprint = averageFootprintPerCountry[countryCode];

  if (totalFootprint >= targetFootprint && totalFootprint >= countryFootprint) {
    totalFootprintBarLength = 100;
    countryFootprintBarLength = (countryFootprint / totalFootprint) * 100;
    targetFootprintBarLength = (targetFootprint / totalFootprint) * 100;
  } else if (
    countryFootprint > totalFootprint &&
    countryFootprint > targetFootprint
  ) {
    totalFootprintBarLength = (totalFootprint / countryFootprint) * 100;
    countryFootprintBarLength = 100;
    targetFootprintBarLength = (targetFootprint / countryFootprint) * 100;
  } else {
    totalFootprintBarLength = (totalFootprint / targetFootprint) * 100;
    countryFootprintBarLength = (countryFootprint / targetFootprint) * 100;
    targetFootprintBarLength = 100;
  }

  return (
    <div className="flex flex-col gap-2">
      <OwnCountryComparisonBar
        titleTranslationKey="myFootprint"
        barWidth={totalFootprintBarLength}
        footprint={totalFootprint}
        color="cyan-80"
      />
      <OwnCountryComparisonBar
        titleTranslationKey={`countryAverage.${countryCode}`}
        barWidth={countryFootprintBarLength}
        footprint={countryFootprint}
        color="purple-80"
      />
      <OwnCountryComparisonBar
        titleTranslationKey="targetTargetVisualization"
        barWidth={targetFootprintBarLength}
        footprint={targetFootprint}
        color="green-80"
      />
    </div>
  );
};

export default OwnCountryComparison;
