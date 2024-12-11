import Tag from "../../common/components/ui/Tag";
import { TagTheme } from "@pslifestyle/common/src/types/planTypes";
import { useTranslation } from "react-i18next";

interface Props {
  filter: string;
  filterType: "categoriesFilter" | "tagsFilter";
  isSelected: boolean;
  onClick: () => unknown;
}

export const FilterTag = ({
  filter,
  filterType,
  isSelected,
  onClick,
}: Props) => {
  const { t } = useTranslation(["common", "recommendations"]);

  return (
    <Tag
      filter={filter}
      key={filter}
      variant={filterType === "tagsFilter" ? "other" : (filter as TagTheme)}
      selected={isSelected}
      clickable
      onClick={onClick}
    >
      {t(`tags.${filter}`, { ns: "recommendations" })}
    </Tag>
  );
};
