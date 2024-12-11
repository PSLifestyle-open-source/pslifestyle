import { colors } from "../utils/helpers";
import { useTranslation } from "react-i18next";

interface CategoryChartLegendProps {
  categoriesArray: string[];
}

const CategoryChartLegend: React.FC<CategoryChartLegendProps> = ({
  categoriesArray,
}) => {
  const { t } = useTranslation(["common"]);

  const categoriesArrayNoOverall = categoriesArray.filter(
    (item) => item !== "overall",
  );

  return (
    <div className="mx-auto flex flex-wrap gap-x-4 justify-center">
      {categoriesArrayNoOverall.map((category) => (
        <div key={category} className="flex items-center">
          <div
            className={`rounded-sm w-2.5 h-2.5 mr-1 bg-${colors[category]}-80 mt-0.5`}
          />
          <p data-cy="categories.category" className="meta-sm">
            {t(`categories.${category}`, { ns: "common" })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CategoryChartLegend;
