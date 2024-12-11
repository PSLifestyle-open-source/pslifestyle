import { useAppDispatch } from "../../../app/store";
import {
  userPlanActions,
  userPlanSelectors,
} from "../../../features/plan/userPlanSlice";
import useTimerBasedState from "../../hooks/useTimerBasedState";
import { ButtonMedium } from "../ui/buttons";
import ActionCard from "./ActionCard";
import MainActionCardButton from "./ActionCardButtons/MainActionCardButton";
import SkipActionModalButton from "./ActionCardButtons/SkipActionModalButton";
import ActionCardExtraActivityContainer from "./ActionCardExtraActivityContainer";
import { ReactionAnimation } from "./ReactionAnimation";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface Props {
  action: CalculatedAction;
}

const DefaultRecommendationActionCard = ({
  action,
  onChooseActionClick,
  onAlreadyDoThisClick,
}: Props & {
  onChooseActionClick: () => void;
  onAlreadyDoThisClick: () => void;
}): JSX.Element => {
  const { t } = useTranslation("recommendations");
  const dispatch = useAppDispatch();

  return (
    <div className="rounded-2xl">
      <ActionCard
        action={action}
        cyData={`recommendationActionCard.default.card.${action.id}`}
      >
        <ActionCardExtraActivityContainer displaySingleActivity={false}>
          <SkipActionModalButton action={action} />
          <ButtonMedium
            theme="secondary"
            className="w-full justify-center !leading-4"
            buttonClassName="w-full"
            onClick={() => {
              dispatch(userPlanActions.addAlreadyDoThisAction(action.id));
              onAlreadyDoThisClick();
            }}
            cyData="recommendationActionCard.alreadyDoThis.button"
          >
            {t("iAlreadyDoThis")}
          </ButtonMedium>
        </ActionCardExtraActivityContainer>
        <MainActionCardButton
          theme="primary"
          onClick={() => {
            dispatch(userPlanActions.addAction(action.id));
            onChooseActionClick();
          }}
          cyData="recommendationActionCard.choose.button"
        >
          {t("chooseAction")}
        </MainActionCardButton>
      </ActionCard>
    </div>
  );
};
const SelectedRecommendationActionCard = ({
  action,
  onUnchooseActionClick,
  showAnimation,
}: Props & {
  onUnchooseActionClick: () => void;
  showAnimation: boolean;
}): JSX.Element => {
  const { t } = useTranslation("recommendations");
  const dispatch = useAppDispatch();

  return (
    <div className="rounded-2xl border-4 border-green-100">
      <ActionCard
        action={action}
        cyData={`recommendationActionCard.selected.card.${action.id}`}
      >
        <ReactionAnimation show={showAnimation} reactionType="heartColor" />
        <MainActionCardButton
          theme="goalCTA"
          onClick={() => {
            dispatch(userPlanActions.removeAction(action.id));
            onUnchooseActionClick();
          }}
        >
          {t("removeAction")}
        </MainActionCardButton>
      </ActionCard>
    </div>
  );
};

const AlreadyDoThisRecommendationActionCard = ({
  action,
  onUnchooseActionClick,
  showAnimation,
}: Props & {
  onUnchooseActionClick: () => void;
  showAnimation: boolean;
}): JSX.Element => {
  const { t } = useTranslation("recommendations");
  const dispatch = useAppDispatch();

  return (
    <div className="rounded-2xl border-4 border-green-140">
      <ActionCard
        action={action}
        cyData={`recommendationActionCard.alreadyDoThis.card.${action.id}`}
      >
        <ActionCardExtraActivityContainer displaySingleActivity>
          <ReactionAnimation show={showAnimation} reactionType="thumbUpColor" />
          <ButtonMedium
            theme="goalCTAActive"
            icon={{ size: "medium", type: "Check", position: "left" }}
            className="w-full justify-center !leading-4"
            buttonClassName="w-full"
            onClick={() => {
              dispatch(userPlanActions.removeAlreadyDoThisAction(action.id));
              onUnchooseActionClick();
            }}
          >
            {t("iAlreadyDoThis")}
          </ButtonMedium>
        </ActionCardExtraActivityContainer>
      </ActionCard>
    </div>
  );
};

const RecommendationActionCard = ({ action }: Props): JSX.Element => {
  useState<boolean>(false);
  const {
    state: actionChosenAnimationState,
    activateState: activateActionChosenAnimation,
    deactivateState: deactivateActionChosenAnimation,
  } = useTimerBasedState(5900);
  const {
    state: actionAlreadyDoThisAnimationState,
    activateState: activateActionAlreadyDoThisAnimation,
    deactivateState: deactivateActionAlreadyDoThisAnimation,
  } = useTimerBasedState(5900);

  const selectedActions = useSelector(userPlanSelectors.selectedActions);
  const alreadyDoThisActions = useSelector(
    userPlanSelectors.alreadyDoThisActions,
  );

  const isActionSelected = !!selectedActions.find(
    (selectedAction) => selectedAction.id === action.id,
  );

  const isActionAlreadyDoThis = !!alreadyDoThisActions.find(
    (alreadyDoThisAction) => alreadyDoThisAction.id === action.id,
  );

  if (isActionAlreadyDoThis) {
    return (
      <AlreadyDoThisRecommendationActionCard
        action={action}
        onUnchooseActionClick={() => deactivateActionAlreadyDoThisAnimation}
        showAnimation={actionAlreadyDoThisAnimationState}
      />
    );
  }

  if (isActionSelected) {
    return (
      <SelectedRecommendationActionCard
        action={action}
        onUnchooseActionClick={() => deactivateActionChosenAnimation}
        showAnimation={actionChosenAnimationState}
      />
    );
  }

  return (
    <DefaultRecommendationActionCard
      action={action}
      onChooseActionClick={() => activateActionChosenAnimation()}
      onAlreadyDoThisClick={() => activateActionAlreadyDoThisAnimation()}
    />
  );
};

export default RecommendationActionCard;
