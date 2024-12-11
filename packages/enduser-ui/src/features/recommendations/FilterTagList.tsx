import { FilterTag } from "./FilterTag";

interface Props {
  activeFilters: string[];
  availableFilters: string[];
  filterType: "categoriesFilter" | "tagsFilter";
  toggleFilter: (filter: string) => void;
}

export const FilterTagList = ({
  activeFilters,
  availableFilters,
  filterType,
  toggleFilter,
}: Props) => (
  <div className="flex flex-wrap gap-1">
    {availableFilters &&
      availableFilters.map((filter) => (
        <FilterTag
          key={filter}
          filter={filter}
          filterType={filterType}
          isSelected={activeFilters.includes(filter)}
          onClick={() => toggleFilter(filter)}
        />
      ))}
  </div>
);
