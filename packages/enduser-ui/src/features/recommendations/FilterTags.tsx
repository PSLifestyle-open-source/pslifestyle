import { FiltersState } from "../../common/hooks/useRecommendationsFilters";
import { userPlanSelectors } from "../plan/userPlanSlice";
import { FilterTagList } from "./FilterTagList";
import { actionCategoryMap } from "@pslifestyle/common/src/models/categoryMap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface IProps {
  filters: FiltersState;
  toggleTagsFilters: (filter: string) => void;
  toggleCategoryFilters: (filter: string) => void;
}

const FilterTags = ({
  filters,
  toggleTagsFilters,
  toggleCategoryFilters,
}: IProps): JSX.Element => {
  const applicableActions = useSelector(userPlanSelectors.applicableActions);
  const { t } = useTranslation(["common", "recommendations"]);

  const availableActionCategories = Array.from(
    new Set(
      applicableActions.map((applicableAction) => applicableAction.category),
    ),
  );

  const availableActionTags = Array.from(
    new Set(
      applicableActions.reduce(
        (aggregator: string[], applicableAction) => [
          ...aggregator,
          ...applicableAction.tags,
        ],
        [],
      ),
    ),
  );

  const showCategoryFilters = availableActionCategories.length > 0;
  const showTagFilters = availableActionTags.length > 0;

  return (
    <div className="flex flex-col w-full gap-2">
      {showCategoryFilters && (
        <>
          <h3 className="text-body-md font-normal">
            {t("actionCategories", { ns: "recommendations" })}
          </h3>
          <FilterTagList
            filterType="categoriesFilter"
            activeFilters={filters.activeCategoryFilters}
            availableFilters={actionCategoryMap.filter((orderedCategoryName) =>
              availableActionCategories.includes(orderedCategoryName),
            )}
            toggleFilter={toggleCategoryFilters}
          />
        </>
      )}
      {showTagFilters && (
        <>
          <h3 className="text-body-md font-normal">
            {t("actionTags", { ns: "recommendations" })}
          </h3>
          <FilterTagList
            filterType="tagsFilter"
            activeFilters={filters.activeTagsFilters}
            availableFilters={availableActionTags}
            toggleFilter={toggleTagsFilters}
          />
        </>
      )}
    </div>
  );
};

export default FilterTags;
