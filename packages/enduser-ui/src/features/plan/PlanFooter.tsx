/**
 * Component for controlling Plan. Back&save buttons.
 */
import { WideWidthContainer } from "../../common/components/layout/Container";
import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import { ProgressBar } from "../../common/components/ui/ProgressBar";
import { ButtonLarge } from "../../common/components/ui/buttons";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import NotificationDialog from "../../common/components/ui/dialogs/NotificationDialog";
import {
  useAscendUser,
  usePersistUserPlan,
  useRequestMagicLink,
} from "../../common/hooks/firebaseHooks";
import { usePercentageOfAccomplishedPlan } from "../../common/hooks/usePercentageOfAccomplishedPlan";
import { authedSessionSelectors } from "../auth/authedSessionSlice";
import ImpactDetails from "../recommendations/ImpactDetails";
import AscendSuccessModal from "./AscendSuccessModal";
import AscendUserFormModal from "./AscendUserFormModal";
import UserHasPlanModal from "./UserHasPlanModal";
import { userPlanSelectors } from "./userPlanSlice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PlanFooter: React.FC = () => {
  const user = useSelector(authedSessionSelectors.user);
  const selectedActions = useSelector(userPlanSelectors.selectedActions);
  const totalCompletedActionsImpact = useSelector(
    userPlanSelectors.totalCompletedActionsImpact,
  );
  const totalImpact = useSelector(userPlanSelectors.totalImpact);

  const [showAscendFormModal, setShowAscendFormModal] = useState(false);
  const isPlanSaveable = Object.keys(selectedActions).length > 0;

  const {
    state: savePlanState,
    reset: resetSavePlanState,
    sendPlanToBackend,
  } = usePersistUserPlan();

  const {
    state: ascendUserState,
    reset: resetAscendUserState,
    ascendUserToBackend,
  } = useAscendUser();

  const {
    state: {
      success: isMagicLinkRequested,
      loading: isRequestingMagicLink,
      error: magicLinkError,
    },
    reset: resetRequestingMagicLinkState,
    requestMagicLink,
  } = useRequestMagicLink();

  const navigate = useNavigate();
  const completedAgainstSelectedActionsImpactPercentage =
    usePercentageOfAccomplishedPlan();

  const resetAllStates = () => {
    if (savePlanState.error || savePlanState.success) {
      resetSavePlanState();
    }
    if (ascendUserState.error || ascendUserState.success) {
      resetAscendUserState();
    }
    if (magicLinkError || isMagicLinkRequested) {
      resetRequestingMagicLinkState();
    }
  };

  const goBack = () => navigate(-1);
  const { t } = useTranslation(["common"]);

  return (
    <ContainerLoader
      loading={
        savePlanState.loading ||
        ascendUserState.loading ||
        isRequestingMagicLink
      }
    >
      <div className="fixed bottom-0 bg-green-100 w-full rounded-t-xl">
        <div className="lg:hidden h-3">
          <ProgressBar
            value={completedAgainstSelectedActionsImpactPercentage}
            baseColorClassName="bg-green-120"
            progressColorClassName="bg-green-40"
          />
        </div>
        <WideWidthContainer className="bottom-0 py-3.5 px-4 md:px-0 !flex-row gap-5 items-center">
          <ButtonLarge
            theme="secondaryInverted"
            icon={{ position: "left", type: "ChevronLeft" }}
            onClick={goBack}
          />
          <ImpactDetails
            currentValue={totalCompletedActionsImpact}
            totalValue={totalImpact}
            textColorClassName="text-basic-white"
          />
          <div className="flex-grow hidden lg:block h-3">
            <ProgressBar
              value={completedAgainstSelectedActionsImpactPercentage}
              baseColorClassName="bg-green-120"
              progressColorClassName="bg-green-40"
            />
          </div>
          {isPlanSaveable && (
            <div className="flex justify-center">
              <ButtonLarge
                theme="planCTA"
                onClick={() =>
                  user ? sendPlanToBackend() : setShowAscendFormModal(true)
                }
              >
                {t("saveButton", { ns: "common" })}
              </ButtonLarge>
            </div>
          )}
        </WideWidthContainer>
        <AscendUserFormModal
          open={isPlanSaveable && showAscendFormModal}
          onConfirm={async (email: string) => {
            setShowAscendFormModal(false);
            await ascendUserToBackend(email);
          }}
          onCancelLogin={() => setShowAscendFormModal(false)}
        />
        <NotificationDialog
          open={
            savePlanState.error ||
            !!magicLinkError ||
            (ascendUserState.error && !ascendUserState.userHasPlan)
          }
          onClose={resetAllStates}
          closeButtonText={t("hide", { ns: "common" })}
        >
          <DialogTitle cyData="savePlanModal.error.title">
            {t("error.general")}
          </DialogTitle>
        </NotificationDialog>
        <NotificationDialog
          open={savePlanState.success}
          onClose={resetSavePlanState}
          closeButtonText={t("hide", { ns: "common" })}
        >
          <DialogTitle cyData="savePlanModal.success.title">
            {t("saved")}
          </DialogTitle>
        </NotificationDialog>
        <UserHasPlanModal
          open={ascendUserState.userHasPlan}
          onCancel={resetAscendUserState}
        />
        <AscendSuccessModal
          open={ascendUserState.success || isMagicLinkRequested}
          onResendEmail={async (email: string) => {
            resetAllStates();
            await requestMagicLink(email);
          }}
          onConfirm={resetAllStates}
        />
      </div>
    </ContainerLoader>
  );
};

export default PlanFooter;
