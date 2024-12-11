import { FullWidthContainer } from "../../layout/Container";
import { Header } from "../../layout/header/Header";
import { ButtonMedium } from "../buttons";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  onClose?: () => void;
  displayHeaderCloseButton?: boolean;
  children: ReactNode;
  onOpenAutoFocus?: (event: Event) => void;
}

const FullPageDialogPortal = ({
  onClose,
  displayHeaderCloseButton,
  children,
  onOpenAutoFocus,
}: IProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content
        onOpenAutoFocus={onOpenAutoFocus}
        className="fixed z-[100] left-0 top-0 w-screen h-screen flex flex-col items-center bg-neutral-2"
      >
        <Header>
          {displayHeaderCloseButton && (
            <Dialog.Close
              onClick={onClose}
              className="mr-2 flex items-center"
              asChild
            >
              <ButtonMedium
                cyData="fullPageDialog.close.button"
                theme="primary"
              >
                {t("close")}
              </ButtonMedium>
            </Dialog.Close>
          )}
        </Header>
        <FullWidthContainer className="mx-auto py-2 flex flex-col gap-6 overflow-y-auto h-full">
          {children}
        </FullWidthContainer>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default FullPageDialogPortal;
