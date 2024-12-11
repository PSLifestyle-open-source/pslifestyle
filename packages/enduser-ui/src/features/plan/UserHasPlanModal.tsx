import { ModalContentContainer } from "../../common/components/layout/Container";
import { Icon } from "../../common/components/ui/Icon";
import AlertDialog from "../../common/components/ui/dialogs/AlertDialog";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onCancel: () => void;
};

const UserHasPlan = ({ open, onCancel }: Props) => {
  const { t } = useTranslation(["common", "authentication"]);
  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  };

  return (
    <Dialog.Root open={open}>
      <AlertDialog
        onConfirmButtonClick={login}
        confirmButtonText={t("signIn")}
        onCancelButtonClick={onCancel}
        cancelButtonText={t("cancel", { ns: "common" })}
      >
        <ModalContentContainer grow scrollable centerContent centerVertically>
          <DialogTitle cyData="userHasPlanModal.title">
            {t("userHasDataAlready", { ns: "authentication" })}
          </DialogTitle>
          <div className="my-6 text-center">
            <Icon
              size="extraextralarge"
              type="AlertCircle"
              className="text-neutral-20"
            />
          </div>
        </ModalContentContainer>
      </AlertDialog>
    </Dialog.Root>
  );
};

export default UserHasPlan;
