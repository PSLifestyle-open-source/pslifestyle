import CheckCircle from "../../assets/icons/check-circle.svg?react";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import NotificationDialog from "../../common/components/ui/dialogs/NotificationDialog";
import { useTranslation } from "react-i18next";

interface IProps {
  email: string;
  open: boolean;
  onClose: () => void;
}

const MagicLinkRequestedModal = ({ email, open, onClose }: IProps) => {
  const { t } = useTranslation();

  return (
    <NotificationDialog
      closeButtonText={t("tryAgain", { ns: "common" })}
      open={open}
      onClose={onClose}
    >
      <div className="flex w-full justify-center text-green-100">
        <CheckCircle style={{ height: "144px", width: "144px" }} />
      </div>
      <Heading level={2} type="headline-md-b" className="mt-4">
        {t("emailSent", { ns: "authentication" })}
      </Heading>
      <Paragraph
        type="body-lg-b"
        className="my-4 break-all"
        data-cy="magicLinkRequested.email"
      >
        {email}
      </Paragraph>
      <Paragraph type="body-lg">
        {t("clickLink", { ns: "authentication" })}
      </Paragraph>
    </NotificationDialog>
  );
};

export default MagicLinkRequestedModal;
