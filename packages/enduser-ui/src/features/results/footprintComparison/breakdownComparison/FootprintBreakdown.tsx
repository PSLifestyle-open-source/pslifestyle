import LabelFootprint from "./LabelFootprint";
import { LabelFootprintType } from "./types";

interface IFootprintBreakdownProps {
  footprintByLabelArray: LabelFootprintType[];
  limit?: number;
}

const FootprintBreakdown = ({
  footprintByLabelArray,
  limit = 200,
}: IFootprintBreakdownProps): JSX.Element => (
  <div className="w-full flex flex-col gap-2">
    {footprintByLabelArray.map(
      (label: LabelFootprintType, i: number) =>
        label.labelFootprint > 0 &&
        i + 1 <= limit && (
          <LabelFootprint
            key={label.label}
            ordinalNumber={i + 1}
            label={label.label}
            percent={Number(label.percent.toFixed(1))}
            labelFootprint={Number(label.labelFootprint.toFixed())}
            themeColor={label.themeColor}
          />
        ),
    )}
  </div>
);
export default FootprintBreakdown;
