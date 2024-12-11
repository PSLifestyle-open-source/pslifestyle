import CategoryChartLegend from "../../../common/components/CategoryChartLegend";
import { getCategoryColorCode } from "../../../common/utils/charts";
import { ResponsivePie } from "@nivo/pie";
import { CategorizedFootprint } from "@pslifestyle/common/src/types/questionnaireTypes";

const createPiechartData = ({
  categorizedFootprint,
  totalFootprint,
}: {
  categorizedFootprint?: CategorizedFootprint;
  totalFootprint?: number;
}) => {
  if (!categorizedFootprint) return [];
  if (!totalFootprint) return [];

  const ids = Object.keys(categorizedFootprint);

  return ids.map((id) => ({
    id: id.toLowerCase(),
    value: (
      (categorizedFootprint[id as keyof CategorizedFootprint] /
        totalFootprint) *
      100
    ).toFixed(1),
  }));
};

interface IProps {
  categorizedFootprint: CategorizedFootprint;
  totalFootprint: number;
}

const ResultsPieChart = ({
  categorizedFootprint,
  totalFootprint,
}: IProps): JSX.Element => {
  const piechartData = createPiechartData({
    categorizedFootprint,
    totalFootprint,
  });

  const documentStyle = getComputedStyle(document.body);

  return (
    <>
      <div className="h-[350px] lg:my-2 force-svg-full-width ">
        <ResponsivePie
          data={piechartData}
          //   sortByValue
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
          colors={(d) => getCategoryColorCode(d.id.toString(), documentStyle)}
          enableArcLinkLabels={false}
          arcLabel={(d) => `${d.value}%`}
          arcLabelsTextColor="black"
          arcLabelsRadiusOffset={0.6}
          arcLabelsSkipAngle={10}
          isInteractive={false}
          animate={false}
        />
      </div>
      <CategoryChartLegend
        categoriesArray={piechartData.map((data) => data.id)}
      />
    </>
  );
};
export default ResultsPieChart;
