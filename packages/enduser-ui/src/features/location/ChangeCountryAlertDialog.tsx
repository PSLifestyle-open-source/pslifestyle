import { ModalContentContainer } from "../../common/components/layout/Container";
import AlertDialog from "../../common/components/ui/dialogs/AlertDialog";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onConfirmButtonClick: () => void;
  onCancelButtonClick: () => void;
}

const ChangeCountryAlertDialog = ({
  open,
  onConfirmButtonClick,
  onCancelButtonClick,
}: IProps) => {
  const { t } = useTranslation(["frontpage"]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Overlay className="fixed z-10 top-0 left-0 bottom-0 right-0 bg-neutral-60/80" />
      <AlertDialog
        onConfirmButtonClick={onConfirmButtonClick}
        onCancelButtonClick={onCancelButtonClick}
      >
        <ModalContentContainer centerContent grow>
          <DialogTitle cyData="countryAndLanguageChange.title">
            {t("changeCountryConfirmation", { ns: "common" })}
          </DialogTitle>
        </ModalContentContainer>
      </AlertDialog>
    </Dialog.Root>
  );
};

export default ChangeCountryAlertDialog;
