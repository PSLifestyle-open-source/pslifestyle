import DialogDescription from "../common/components/ui/dialogs/DialogDescription";
import NotificationDialog from "../common/components/ui/dialogs/NotificationDialog";
import {
  notificationActions,
  notificationSelectors,
} from "../common/store/notificationSlice";
import { useAppDispatch } from "./store";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const Notifications = () => {
  const { t } = useTranslation(["common"]);
  const dispatch = useAppDispatch();
  const notifications = useSelector(notificationSelectors.notifications);
  const displayedNotification = notifications.at(-1);
  if (!displayedNotification) {
    return null;
  }

  const onClose = () => {
    dispatch(notificationActions.deleteNotification(displayedNotification.id));
  };

  return (
    <NotificationDialog
      closeButtonText={t("close")}
      open={notifications.length > 0}
      onClose={onClose}
    >
      <DialogDescription
        cyData="notification.description"
        className="mt-[60px]"
      >
        {t(`notifications.${displayedNotification.id}`)}
      </DialogDescription>
    </NotificationDialog>
  );
};
