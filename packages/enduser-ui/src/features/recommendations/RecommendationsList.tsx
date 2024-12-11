import { WideWidthContainer } from "../../common/components/layout/Container";
import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import NotificationDialog from "../../common/components/ui/dialogs/NotificationDialog";
import useRecommendationsFilters from "../../common/hooks/useRecommendationsFilters";
import {
  categorizeActions,
  sortActionsByImpact,
} from "../../common/utils/actions";
import { userPlanSelectors } from "../plan/userPlanSlice";
import FiltersPopOver from "./FiltersPopOver";
import RecommendationsCategoryList from "./RecommendationsCategoryList";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const RecommendationsList = ({
  isError,
  resetSaveState,
  isLoading,
}: {
  isLoading: boolean;
  isError: boolean;
  resetSaveState: () => void;
}): JSX.Element => {
  const { filters, toggleTagsFilters, toggleCategoryFilters, resetFilters } =
    useRecommendationsFilters();

  const applicableActions = useSelector(userPlanSelectors.applicableActions);
  const selectedActions = useSelector(userPlanSelectors.selectedActions);

  const { t } = useTranslation(["common", "recommendations"]);

  const applicableActionsList = applicableActions
    .filter(
      (applicableAction) =>
        filters.activeCategoryFilters.length === 0 ||
        filters.activeCategoryFilters.includes(applicableAction.category),
    )
    .filter(
      (applicableAction) =>
        filters.activeTagsFilters.length === 0 ||
        filters.activeTagsFilters.every((filter) =>
          applicableAction.tags.includes(filter),
        ),
    )
    .filter((applicableAction) =>
      selectedActions.every(
        (selectedAction) =>
          !selectedAction.skipIdsIfSelected.includes(applicableAction.id),
      ),
    );
  const recommendedActionsByCategory = categorizeActions(
    sortActionsByImpact(applicableActionsList),
  );

  return (
    <ContainerLoader loading={isLoading}>
      <WideWidthContainer className="mt-10 pb-4">
        {/* Header & Cards */}
        <div className="text-center mb-5">
          <Heading
            data-cy="recommendations.title"
            type="headline-lg-eb"
            level={1}
            className="mb-3"
          >
            {t("recommendationsTitle", { ns: "recommendations" })}
          </Heading>
          <Paragraph type="body-md" className="mb-8">
            {t("executePickedActionsToLowerYourFootprintBy", {
              ns: "recommendations",
            })}
          </Paragraph>
          <div className="flex ml-auto justify-center pt-2 mb-2.5">
            <FiltersPopOver
              resetFilters={resetFilters}
              toggleCategoryFilters={toggleCategoryFilters}
              toggleTagsFilters={toggleTagsFilters}
              filters={filters}
            />
          </div>
        </div>
        <div>
          <RecommendationsCategoryList
            categoryName={t(`categories.housing`)}
            actionsOfCategory={recommendedActionsByCategory.housing}
          />
          <RecommendationsCategoryList
            categoryName={t(`categories.transport`)}
            actionsOfCategory={recommendedActionsByCategory.transport}
          />
          <RecommendationsCategoryList
            categoryName={t(`categories.food`)}
            actionsOfCategory={recommendedActionsByCategory.food}
          />
          <RecommendationsCategoryList
            categoryName={t(`categories.purchases`)}
            actionsOfCategory={recommendedActionsByCategory.purchases}
          />
        </div>
      </WideWidthContainer>
      <NotificationDialog
        open={isError}
        onClose={resetSaveState}
        closeButtonText={t("hide", { ns: "common" })}
      >
        <DialogTitle cyData="savePlanModal.error.title">
          {t("error.general")}
        </DialogTitle>
      </NotificationDialog>
    </ContainerLoader>
  );
};
