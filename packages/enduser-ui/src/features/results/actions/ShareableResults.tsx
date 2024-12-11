import LogoSvg from "../../../assets/images/logo.svg";
import ResultsPieChart from "../common/ResultsPieChart";
import FootprintComparisons from "./FootprintComparisons";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";
import { useTranslation } from "react-i18next";

interface IProps {
  setRef: (ref: HTMLDivElement | null) => void;
  categorizedFootprint: CategorizedFootprint;
  totalFootprint: number;
  constants: MathScopes;
}

const ShareableResults: React.FC<IProps> = ({
  setRef,
  categorizedFootprint,
  constants,
  totalFootprint,
}): JSX.Element => {
  const { t } = useTranslation(["common", "recommendations"]);

  return (
    <div
      ref={(ref) => setRef(ref)}
      aria-hidden="true"
      className="invisible-shareable p-3 flex flex-col justify-between w-[800px] h-[800px]"
    >
      <p className="pb-2 text-heading-xl text-green-100 font-black">
        {t("shareableResults.title", { ns: "results" })}
      </p>

      <div className="flex gap-5">
        <div className="w-1/2">
          <p className="title-md">
            {t("shareableResults.iProduce", { ns: "results" })}
          </p>
          <p className="pt-1 pb-3">
            <span className="leading-none text-heading-xl text-orange-100 font-black">
              {totalFootprint.toFixed()}
            </span>{" "}
            {t("kgCO2inYear", { ns: "common" })}
          </p>
          <FootprintComparisons
            categorizedFootprint={categorizedFootprint}
            totalFootprint={totalFootprint}
            constants={constants}
          />
        </div>

        <div className="w-1/2">
          <ResultsPieChart
            categorizedFootprint={categorizedFootprint}
            totalFootprint={totalFootprint}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-heading-lg text-green-100 font-black">
            {t("shareableResults.linkTagline", { ns: "results" })}
          </p>
          <p className="text-heading-sm font-black"></p>
        </div>
        <img className="h-12" src={LogoSvg} alt="PS Lifestyle" />
      </div>
    </div>
  );
};

export default ShareableResults;
