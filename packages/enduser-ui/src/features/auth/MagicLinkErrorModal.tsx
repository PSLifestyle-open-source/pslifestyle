import DialogDescription from "../../common/components/ui/dialogs/DialogDescription";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import NotificationDialog from "../../common/components/ui/dialogs/NotificationDialog";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const MagicLinkErrorModal = ({ open, onClose }: IProps) => {
  const { t } = useTranslation();

  return (
    <NotificationDialog
      closeButtonText={t("tryAgain", { ns: "common" })}
      open={open}
      onClose={onClose}
    >
      <DialogTitle cyData="magicLinkError.title" className="pb-6">
        {t("error.general", { ns: "common" })}
      </DialogTitle>
      <DialogDescription cyData="questionnaire.retakeAlertDescription">
        {t("invalidEmail", { ns: "authentication" })}
      </DialogDescription>
    </NotificationDialog>
  );
};

export default MagicLinkErrorModal;
