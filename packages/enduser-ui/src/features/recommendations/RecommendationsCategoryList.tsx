import { ActionCardList } from "../../common/components/ActionCard/ActionCardList";
import Heading from "../../common/components/ui/Heading";
import { ButtonMedium } from "../../common/components/ui/buttons";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  categoryName: string;
  actionsOfCategory: CalculatedAction[];
}

const RecommendationsCategoryList = ({
  categoryName,
  actionsOfCategory,
}: Props) => {
  const { t } = useTranslation("common");
  const [showMore, setShowMore] = useState<boolean>(false);

  const top3Recommendations = actionsOfCategory.slice(0, 3);
  const rest = actionsOfCategory.slice(3, Infinity);

  if (actionsOfCategory.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 max-w-full mb-5">
      <Heading level={2} type="headline-sm-b" className="mt-1 text-center">
        {categoryName}
      </Heading>
      <ActionCardList
        actions={top3Recommendations}
        cardRenderer="recommendation"
      />
      {showMore && (
        <ActionCardList actions={rest} cardRenderer="recommendation" />
      )}
      {rest.length > 0 && (
        <ButtonMedium
          icon={{
            position: "right",
            type: showMore ? "ChevronUp" : "ChevronDown",
          }}
          theme="tertiary"
          onClick={() => setShowMore(!showMore)}
          className="text-orange-dark uppercase !label-lg"
          buttonClassName="mb-5"
        >
          {t(showMore ? "showLess" : "showMore", { ns: "common" })}{" "}
          {!showMore ? `(${rest.length})` : ""}
        </ButtonMedium>
      )}
    </div>
  );
};

export default RecommendationsCategoryList;
