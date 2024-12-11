import Heart from "../../../assets/icons/heart.svg?react";
import Heading from "../ui/Heading";
import Paragraph from "../ui/Paragraph";
import NotificationDialog from "../ui/dialogs/NotificationDialog";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
};

const FeedbackEnd = ({ open, onClose }: Props) => {
  const { t } = useTranslation(["common", "feedback"]);
  return (
    <NotificationDialog
      open={open}
      closeButtonText={t("feedback:go-to-your-plan")}
      onClose={onClose}
      centerVertically
      containerClassName="gap-5"
    >
      <Heading level={2} type="headline-xl-eb" className="text-green-100">
        {t("common:thank-you")}
      </Heading>
      <Heading level={3} type="title-md">
        {t("feedback:all-set-come-back-for-more")}
      </Heading>
      <span className="inline-flex justify-center items-center bg-green-100 h-40 w-40 rounded-full flex-shrink-0">
        <Heart style={{ height: "112px", width: "112px" }} />
      </span>
      <Paragraph type="body-md">{t("feedback:track-your-plan-here")}</Paragraph>
      <Heading level={3} type="title-md">
        {t("feedback:see-you-soon")}
      </Heading>
    </NotificationDialog>
  );
};

export default FeedbackEnd;
