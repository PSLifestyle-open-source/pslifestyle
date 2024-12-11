import { useAppDispatch } from "../../../../app/store";
import { userPlanActions } from "../../../../features/plan/userPlanSlice";
import { ModalContentContainer } from "../../layout/Container";
import Checkbox from "../../ui/Checkbox";
import Heading from "../../ui/Heading";
import { ButtonMedium } from "../../ui/buttons";
import AlertDialog from "../../ui/dialogs/AlertDialog";
import SkipSuccessModal from "../SkipActionSteps/SkipSuccessModal";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  action: CalculatedAction;
}

const SkipActionModalButton = ({ action }: IProps) => {
  const { t } = useTranslation(["common", "recommendations"]);
  const possibleReasons: string[] = [
    "dont-know-how",
    "no-support",
    "too-expensive",
    "not-available",
    "not-popular",
    "too-much-time-and-effort",
    "already-doing",
  ];

  const [showSkipSuccessModal, setShowSkipSuccessModal] =
    useState<boolean>(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const toggleRecommendationSkipped = (actionId: string, reasons: string[]) => {
    dispatch(userPlanActions.skipAction({ id: actionId, reasons }));
    setShowSkipSuccessModal(false);
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <ButtonMedium
            theme="secondary"
            className="w-full justify-center !leading-4"
            buttonClassName="w-full"
          >
            {t("skipThisRecommendation", { ns: "recommendations" })}
          </ButtonMedium>
        </Dialog.Trigger>
        <AlertDialog
          onConfirmButtonClick={() => setShowSkipSuccessModal(true)}
          confirmButtonText={t("confirm")}
          cancelButtonText={t("cancel")}
          disableConfirmButton={!selectedReasons.length}
        >
          <ModalContentContainer centerContent>
            <Heading level={2} type="headline-xs-eb">
              {t("doYouWantToSkipActions", { ns: "recommendations" })}
            </Heading>
          </ModalContentContainer>

          <ul className="body-md mt-4 overflow-y-auto flex-grow">
            {possibleReasons.map((reason) => (
              <li key={reason} className="border-t border-transparent-black">
                <Checkbox
                  checked={selectedReasons?.includes(reason) || false}
                  onChange={() => {
                    setSelectedReasons((prevState) => {
                      if (prevState.includes(reason)) {
                        return prevState.filter(
                          (oldReason) => oldReason !== reason,
                        );
                      }
                      return prevState.concat(reason);
                    });
                  }}
                >
                  {t(`skipOptions.${reason}`, { ns: "recommendations" })}
                </Checkbox>
              </li>
            ))}
          </ul>
        </AlertDialog>
      </Dialog.Root>

      <SkipSuccessModal
        open={showSkipSuccessModal}
        onClose={() => toggleRecommendationSkipped(action.id, selectedReasons)}
      />
    </>
  );
};

export default SkipActionModalButton;
