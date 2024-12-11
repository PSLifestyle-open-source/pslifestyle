import { useReducer } from "react";

export type FiltersAction =
  | { type: "addCategoryFilter"; filterName: string }
  | { type: "removeCategoryFilter"; filterName: string }
  | {
      type: "addTagsFilter";
      filterName: string;
    }
  | { type: "removeTagsFilter"; filterName: string }
  | {
      type: "reset";
    };

export interface FiltersState {
  activeCategoryFilters: string[];
  activeTagsFilters: string[];
}

const filtersReducer = (
  state: FiltersState,
  action: FiltersAction,
): FiltersState => {
  switch (action.type) {
    case "addCategoryFilter":
      return {
        ...state,
        activeCategoryFilters: [
          ...state.activeCategoryFilters,
          action.filterName,
        ],
      };
    case "removeCategoryFilter":
      return {
        ...state,
        activeCategoryFilters: state.activeCategoryFilters.filter(
          (activeTag) => activeTag !== action.filterName,
        ),
      };
    case "addTagsFilter":
      return {
        ...state,
        activeTagsFilters: [...state.activeTagsFilters, action.filterName],
      };
    case "removeTagsFilter":
      return {
        ...state,
        activeTagsFilters: state.activeTagsFilters.filter(
          (activeTag) => activeTag !== action.filterName,
        ),
      };
    case "reset":
    default:
      return { activeCategoryFilters: [], activeTagsFilters: [] };
  }
};

const useRecommendationsFilters = () => {
  const [filters, dispatchFiltersAction] = useReducer(filtersReducer, {
    activeCategoryFilters: [],
    activeTagsFilters: [],
  });

  const toggleCategoryFilters = (filter: string) => {
    if (filters.activeCategoryFilters.includes(filter)) {
      dispatchFiltersAction({
        type: "removeCategoryFilter",
        filterName: filter,
      });
    } else {
      dispatchFiltersAction({
        type: "addCategoryFilter",
        filterName: filter,
      });
    }
  };

  const toggleTagsFilters = (filter: string) => {
    if (filters.activeTagsFilters.includes(filter)) {
      dispatchFiltersAction({
        type: "removeTagsFilter",
        filterName: filter,
      });
    } else {
      dispatchFiltersAction({
        type: "addTagsFilter",
        filterName: filter,
      });
    }
  };

  const resetFilters = () => {
    dispatchFiltersAction({ type: "reset" });
  };

  return { filters, resetFilters, toggleTagsFilters, toggleCategoryFilters };
};

export default useRecommendationsFilters;
