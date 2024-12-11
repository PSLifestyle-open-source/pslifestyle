import DialogDescription from "../../common/components/ui/dialogs/DialogDescription";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import NotificationDialog from "../../common/components/ui/dialogs/NotificationDialog";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const LoginFromOtherDeviceErrorModal = ({ open, onClose }: IProps) => {
  const { t } = useTranslation(["authentication"]);

  return (
    <NotificationDialog
      closeButtonText={t("invalidEmailTitle")}
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        cyData="loginFromOtherDevice.errorModal.title"
        className="pb-3"
      >
        {t("error.magicLinVerificationFailed", { ns: "common" })}
      </DialogTitle>
      <DialogDescription cyData="loginFromOtherDevice.errorModal.description">
        {t("invalidEmail")}
      </DialogDescription>
    </NotificationDialog>
  );
};

export default LoginFromOtherDeviceErrorModal;
