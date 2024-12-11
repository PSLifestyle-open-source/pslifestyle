import { AppDispatch } from "../../app/store";
import { ModalContentContainer } from "../../common/components/layout/Container";
import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import ButtonLarge from "../../common/components/ui/buttons/ButtonLarge";
import AlertDialog from "../../common/components/ui/dialogs/AlertDialog";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import NotificationDialog from "../../common/components/ui/dialogs/NotificationDialog";
import { commonActions } from "../../common/store/actions";
import { deleteUser } from "../../firebase/api/deleteUser";
import { authedSessionSelectors } from "./authedSessionSlice";
import { actionResultUrls } from "./constants";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeleteUserModal = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const user = useSelector(authedSessionSelectors.user);

  const handleUserDeletion = () => {
    if (!user) return;
    setLoading(true);
    deleteUser(user.email, user.sessionToken)
      .then(() => {
        setLoading(false);
        dispatch(commonActions.fullyLogoutUser());
        navigate(actionResultUrls.userDeleted);
      })
      .catch((err) => {
        setShowError(true);
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <ContainerLoader loading={loading}>
      <div className="min-h-16 h-full mt-7">
        <div className="mt-5">
          <Heading level={2} type="headline-md-b" className="mb-2">
            {t("removeMe", { ns: "authentication" })}
          </Heading>
          <Paragraph type="body-lg" className="mb-2">
            {t("removingUser", { ns: "authentication" })}
          </Paragraph>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <ButtonLarge>
                {t("removeMe", { ns: "authentication" })}
              </ButtonLarge>
            </Dialog.Trigger>
            <AlertDialog onConfirmButtonClick={handleUserDeletion}>
              <ModalContentContainer grow centerContent>
                <DialogTitle cyData="deleteUserModal.title">
                  {t("removeMeConfirmation", { ns: "authentication" })}
                </DialogTitle>
              </ModalContentContainer>
            </AlertDialog>
          </Dialog.Root>
        </div>
        <NotificationDialog
          open={showError}
          onClose={() => setShowError(false)}
          closeButtonText={t("goBack", { ns: "common" })}
        >
          <DialogTitle cyData="deleteUserModal.errorMessage">
            {t("removingUserError", { ns: "authentication" })}
          </DialogTitle>
        </NotificationDialog>
      </div>
    </ContainerLoader>
  );
};

export default DeleteUserModal;
