import Heading from "../ui/Heading";
import NotificationDialog from "../ui/dialogs/NotificationDialog";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
};

const FeedbackError = ({ open, onClose }: Props) => {
  const { t } = useTranslation(["common", "feedback"]);
  return (
    <NotificationDialog
      open={open}
      closeButtonText={t("feedback:go-to-your-plan")}
      onClose={onClose}
    >
      <Heading level={2} type="headline-md-b">
        {t("common:error.general")}
      </Heading>
    </NotificationDialog>
  );
};

export default FeedbackError;
