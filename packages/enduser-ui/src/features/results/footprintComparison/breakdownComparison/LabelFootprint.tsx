import { ProgressBar } from "../../../../common/components/ui/ProgressBar";
import { LabelFootprintType } from "./types";
import { useTranslation } from "react-i18next";

type LabelFootprintBarType = {
  ordinalNumber: number;
} & LabelFootprintType;

const LabelFootprint = ({
  ordinalNumber,
  label,
  percent,
  labelFootprint,
  themeColor,
}: LabelFootprintBarType): JSX.Element => {
  const { t } = useTranslation(["common", "results"]);

  return (
    <div className="mx-2 my-1">
      <div className="flex items-center justify-between">
        <p data-cy="numberingLabels" className="title-sm text-grey-80">
          {ordinalNumber}. {t(`labels.${label}`, { ns: "results" })}
        </p>
        <p
          data-cy="affectPercentage"
          className={`headline-sm-b text-${themeColor}-100 font-black`}
        >
          {percent}%
        </p>
      </div>
      <div className="w-full h-6 my-1">
        <ProgressBar
          progressColorClassName={`bg-${themeColor}-80`}
          value={percent}
        />
      </div>
      <p data-cy="labelFootprint" className="meta-md !text-grey-60">
        {labelFootprint} {t("kgCO2", { ns: "common" })}
      </p>
    </div>
  );
};

export default LabelFootprint;
