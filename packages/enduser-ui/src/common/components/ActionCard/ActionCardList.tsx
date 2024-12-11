import PlanActionCard from "./PlanActionCard";
import RecommendationActionCard from "./RecommendationActionCard";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";

interface Props {
  actions: CalculatedAction[];
  cardRenderer: "recommendation" | "plan";
}

const cardRendererMap = {
  recommendation: RecommendationActionCard,
  plan: PlanActionCard,
};

export const ActionCardList = ({ actions, cardRenderer }: Props) => {
  const ActionCardRenderer = cardRendererMap[cardRenderer];

  return (
    <>
      {actions.map((action) => (
        <ActionCardRenderer action={action} key={action.id} />
      ))}
    </>
  );
};
