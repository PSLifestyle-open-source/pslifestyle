import { NarrowWidthContainer } from "../../common/components/layout/Container";
import {
  ButtonLarge,
  ButtonMedium,
  CloseButton,
} from "../../common/components/ui/buttons";
import { FiltersState } from "../../common/hooks/useRecommendationsFilters";
import FilterTags from "./FilterTags";
import * as Popover from "@radix-ui/react-popover";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  filters: FiltersState;
  toggleTagsFilters: (filter: string) => void;
  toggleCategoryFilters: (filter: string) => void;
  resetFilters: () => void;
}

const FiltersPopOver = ({
  filters,
  toggleTagsFilters,
  toggleCategoryFilters,
  resetFilters,
}: IProps) => {
  const tagsContainerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation(["recommendations"]);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <ButtonLarge
          icon={{ position: "left", type: "List" }}
          id="gtm-motivation-filters"
        >
          {t("filters", { ns: "recommendations" })}
        </ButtonLarge>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          className="bg-neutral-white border-2 border-transparent-black"
          sideOffset={5}
          asChild
          avoidCollisions={false}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            if (tagsContainerRef.current) {
              (
                tagsContainerRef.current?.getElementsByTagName(
                  "button",
                )[0] as HTMLButtonElement
              )?.focus();
            }
          }}
        >
          <NarrowWidthContainer>
            <div className="flex flex-row justify-end pt-1 pr-1">
              <Popover.Close asChild>
                <CloseButton />
              </Popover.Close>
            </div>
            <div className="flex flex-col justify-center">
              <div
                className="px-5 mb-3 flex flex-wrap gap-2 justify-center"
                ref={tagsContainerRef}
              >
                <FilterTags
                  toggleTagsFilters={toggleTagsFilters}
                  toggleCategoryFilters={toggleCategoryFilters}
                  filters={filters}
                />
              </div>

              <div className="flex flex-col gap-1 pb-2">
                <Popover.Close
                  className="PopoverClose"
                  aria-label="Close"
                  asChild
                >
                  <ButtonMedium
                    onClick={resetFilters}
                    className="bg-neutral-20"
                  >
                    {t("clearFilters", { ns: "recommendations" })}
                  </ButtonMedium>
                </Popover.Close>
              </div>
            </div>

            <Popover.Arrow className="PopoverArrow" />
          </NarrowWidthContainer>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default FiltersPopOver;
