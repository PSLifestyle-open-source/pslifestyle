import { VerticalButtonsModalContainer } from "../buttons/VerticalButtonsContainer";
import WindowDialogButton from "./WindowDialogButton";
import WindowDialogPortal from "./WindowDialogPortal";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  children: ReactNode;
  onConfirmButtonClick?: (event: React.MouseEvent<HTMLElement>) => void;
  confirmButtonText?: string;
  disableConfirmButton?: boolean;
  onCancelButtonClick?: (event: React.MouseEvent<HTMLElement>) => void;
  cancelButtonText?: string;
}

const AlertDialog = ({
  children,
  onConfirmButtonClick,
  onCancelButtonClick,
  confirmButtonText,
  cancelButtonText,
  disableConfirmButton,
}: IProps): JSX.Element => {
  const { t } = useTranslation();
  const cancelButtonFinalText =
    cancelButtonText || t("no", { ns: "common" }) || "";
  const confirmButtonFinalText =
    confirmButtonText || t("yes", { ns: "common" }) || "";
  return (
    <WindowDialogPortal role="alertdialog">
      {children}
      <VerticalButtonsModalContainer className="veryshort:mt-[0px] w-full border-t border-transparent-black">
        <Dialog.Close
          asChild
          onClick={onCancelButtonClick}
          aria-label={cancelButtonFinalText}
        >
          <WindowDialogButton theme="tertiary">
            {cancelButtonFinalText}
          </WindowDialogButton>
        </Dialog.Close>
        <Dialog.Close
          asChild
          disabled={disableConfirmButton}
          className="rounded-b-2xl"
          onClick={onConfirmButtonClick}
          aria-label={confirmButtonFinalText}
        >
          <WindowDialogButton>{confirmButtonFinalText}</WindowDialogButton>
        </Dialog.Close>
      </VerticalButtonsModalContainer>
    </WindowDialogPortal>
  );
};

export default AlertDialog;
