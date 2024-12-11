/**
 * Component for showing the category of the current question.
 */
import Heading from "../../common/components/ui/Heading";
import { colors } from "../../common/utils/helpers";
import getCategoryFromSortKey from "@pslifestyle/common/src/helpers/getCategoryFromSortKey";
import { useTranslation } from "react-i18next";

export interface Props {
  sortKey: string;
}

const QuestionnaireCategoryHeader: React.FC<Props> = ({ sortKey }) => {
  const { t } = useTranslation([
    "common",
    "questionAndRecommendationTranslations",
  ]);

  const category = getCategoryFromSortKey(sortKey);

  if (!category) {
    return null;
  }
  const categoryColor = colors[category];

  return (
    <Heading
      level={2}
      type="headline-lg-eb"
      className={`mt-4 mb-2 text-center text-${categoryColor}-100`}
    >
      {t(`categories.${category}`, { ns: "common" })}
    </Heading>
  );
};

export default QuestionnaireCategoryHeader;
