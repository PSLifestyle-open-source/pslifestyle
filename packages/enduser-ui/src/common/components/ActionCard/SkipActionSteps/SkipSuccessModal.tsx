import CheckCircle from "../../../../assets/icons/check-circle.svg?react";
import Heading from "../../ui/Heading";
import NotificationDialog from "../../ui/dialogs/NotificationDialog";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SkipReasonsModal = ({ open, onClose }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <NotificationDialog
      onClose={onClose}
      open={open}
      closeButtonText={t("confirm", { ns: "common" })}
      centerVertically
    >
      <Heading level={2} type="headline-xs-eb">
        {t("actionSkippedSuccessfull", { ns: "recommendations" })}
      </Heading>
      <div className="text-green-80 mt-5">
        <CheckCircle style={{ height: "144px", width: "144px" }} />
      </div>
    </NotificationDialog>
  );
};
export default SkipReasonsModal;
