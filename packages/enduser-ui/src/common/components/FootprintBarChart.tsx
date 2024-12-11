import { getCategoryColorCode } from "../utils/charts";
import CategoryChartLegend from "./CategoryChartLegend";
import { ResponsiveBar } from "@nivo/bar";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";
import { FunctionComponent } from "react";

interface IProps {
  categorizedFootprint: CategorizedFootprint;
}

const FootprintBarChart: FunctionComponent<IProps> = ({
  categorizedFootprint,
}) => {
  const barChartData = {
    housing: categorizedFootprint.housing,
    transport: categorizedFootprint.transport,
    food: categorizedFootprint.food,
    purchases: categorizedFootprint.purchases,
  };

  const documentStyle = getComputedStyle(document.body);

  return (
    <>
      <div
        data-testid="rounded-bar-div"
        data-cy="footprintBarChart"
        className="h-12 rounded-lg overflow-hidden mb-2"
      >
        <ResponsiveBar
          data={[barChartData]}
          indexBy="name"
          keys={[
            // order matters
            "housing",
            "transport",
            "food",
            "purchases",
          ]}
          theme={{
            labels: {
              text: {
                fontSize: "0.875rem",
                fontWeight: "600",
                fontFamily: "Poppins",
                lineHeight: "22px",
                fontStyle: "normal",
              },
            },
          }}
          padding={0}
          colors={(d) => getCategoryColorCode(d.id.toString(), documentStyle)}
          layout="horizontal"
          motionConfig="stiff"
          enableGridX={false}
          enableGridY={false}
          label={(d) => (d.value ? d.value.toFixed().toString() : "")}
          labelTextColor="black"
          isInteractive={false}
          labelSkipWidth={30}
        />
      </div>
      <CategoryChartLegend
        categoriesArray={[...Object.keys(barChartData), "overall"]}
      />
    </>
  );
};

export default FootprintBarChart;
