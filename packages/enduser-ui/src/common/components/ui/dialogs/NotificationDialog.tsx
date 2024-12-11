import { ModalContentContainer } from "../../layout/Container";
import { VerticalButtonsModalContainer } from "../buttons/VerticalButtonsContainer";
import WindowDialogButton from "./WindowDialogButton";
import WindowDialogPortal from "./WindowDialogPortal";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  children: ReactNode;
  onClose?: () => void;
  closeButtonText?: string;
  centerVertically?: boolean;
  containerClassName?: string;
}

const NotificationDialog = ({
  open,
  children,
  onClose,
  centerVertically,
  closeButtonText,
  containerClassName,
}: IProps): JSX.Element => {
  const { t } = useTranslation();
  const closeButtonFinalText =
    closeButtonText || t("continue", { ns: "common" }) || "";
  return (
    <Dialog.Root open={open}>
      <WindowDialogPortal role="dialog">
        <div className="overflow-y-auto overflow-x-hidden flex flex-col flex-1 h-full">
          <ModalContentContainer
            scrollable
            centerContent
            grow
            centerVertically={centerVertically}
            className={containerClassName}
          >
            {children}
          </ModalContentContainer>
          <VerticalButtonsModalContainer className="mt-[60px] w-full">
            <Dialog.Close asChild onClick={onClose} className="rounded-b-2xl">
              <WindowDialogButton>{closeButtonFinalText}</WindowDialogButton>
            </Dialog.Close>
          </VerticalButtonsModalContainer>
        </div>
      </WindowDialogPortal>
    </Dialog.Root>
  );
};

export default NotificationDialog;
