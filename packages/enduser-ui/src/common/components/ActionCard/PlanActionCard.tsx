import { useAppDispatch } from "../../../app/store";
import { userPlanActions } from "../../../features/plan/userPlanSlice";
import useTimerBasedState from "../../hooks/useTimerBasedState";
import FeedbackModalFlow from "../Feedback/FeedbackModalFlow";
import { ButtonMedium } from "../ui/buttons";
import ActionCard from "./ActionCard";
import MainActionCardButton from "./ActionCardButtons/MainActionCardButton";
import SkipActionModalButton from "./ActionCardButtons/SkipActionModalButton";
import ActionCardExtraActivityContainer from "./ActionCardExtraActivityContainer";
import { ReactionAnimation } from "./ReactionAnimation";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";
import { useTranslation } from "react-i18next";

interface Props {
  action: CalculatedAction;
}

const DefaultPlanActionCard = ({
  action,
  onActionCompleteClick,
}: Props & {
  onActionCompleteClick: () => void;
}): JSX.Element => {
  const { t } = useTranslation("recommendations");
  const dispatch = useAppDispatch();

  return (
    <div className="rounded-2xl  border-4 border-green-100">
      <ActionCard
        action={action}
        cyData={`planActionCard.default.card.${action.id}`}
      >
        <ActionCardExtraActivityContainer displaySingleActivity={false}>
          <SkipActionModalButton action={action} />
          <div className="w-full">
            <FeedbackModalFlow>
              <ButtonMedium
                theme="secondary"
                buttonClassName="w-full"
                className="w-full justify-center !leading-4"
                onClick={() => {
                  console.log("Need help clicked");
                }}
              >
                {t("needHelp")}
              </ButtonMedium>
            </FeedbackModalFlow>
          </div>
        </ActionCardExtraActivityContainer>
        <MainActionCardButton
          theme="goalCTA"
          onClick={() => {
            dispatch(
              userPlanActions.changeActionState({
                actionId: action.id,
                newState: "completed",
              }),
            );
            onActionCompleteClick();
          }}
        >
          {t("markActionAsDone")}
        </MainActionCardButton>
      </ActionCard>
    </div>
  );
};

const CompletedPlanActionCard = ({
  action,
  onActionUncompleteClick,
  showAnimation,
}: Props & {
  onActionUncompleteClick: () => void;
  showAnimation: boolean;
}): JSX.Element => {
  const { t } = useTranslation("recommendations");
  const dispatch = useAppDispatch();

  return (
    <div className="rounded-2xl  border-4 border-green-140">
      <ActionCard
        action={action}
        cyData={`planActionCard.completed.card.${action.id}`}
      >
        <ReactionAnimation show={showAnimation} reactionType="heartColor" />
        <MainActionCardButton
          theme="goalCTAActive"
          onClick={() => {
            dispatch(
              userPlanActions.changeActionState({
                actionId: action.id,
                newState: "new",
              }),
            );
            onActionUncompleteClick();
          }}
          icon={{ position: "right", type: "Check" }}
        >
          <span className="mr-2.5">{t("actionCompleted")}</span>
        </MainActionCardButton>
      </ActionCard>
    </div>
  );
};

const PlanActionCard = ({ action }: Props): JSX.Element => {
  const isActionCompleted = action.state === "completed";
  const {
    state: actionCompletedAnimationState,
    activateState: activateActionCompletedAnimation,
    deactivateState: deactivateActionCompletedAnimation,
  } = useTimerBasedState(5900);

  if (isActionCompleted) {
    return (
      <CompletedPlanActionCard
        action={action}
        onActionUncompleteClick={() => deactivateActionCompletedAnimation()}
        showAnimation={actionCompletedAnimationState}
      />
    );
  }

  return (
    <DefaultPlanActionCard
      action={action}
      onActionCompleteClick={() => activateActionCompletedAnimation()}
    />
  );
};

export default PlanActionCard;
