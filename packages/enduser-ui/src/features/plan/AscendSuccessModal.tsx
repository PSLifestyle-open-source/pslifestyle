import { ModalContentContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import AlertDialog from "../../common/components/ui/dialogs/AlertDialog";
import { authedSessionSelectors } from "../auth/authedSessionSlice";
import * as Dialog from "@radix-ui/react-dialog";
import { useCallback } from "react";
import { CheckCircle } from "react-feather";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

type Props = {
  open: boolean;
  onResendEmail: (email: string) => void;
  onConfirm: () => void;
};

const AscendSuccessModal = ({ open, onResendEmail, onConfirm }: Props) => {
  const magicLinkEmail = useSelector(authedSessionSelectors.magicLinkEmail);
  const { t } = useTranslation(["common", "authentication"]);
  const cancel = useCallback(
    () => onResendEmail(magicLinkEmail!),
    [onResendEmail, magicLinkEmail],
  );

  return (
    <Dialog.Root open={open}>
      <AlertDialog
        onConfirmButtonClick={onConfirm}
        confirmButtonText={t("close", { ns: "common" })}
        onCancelButtonClick={cancel}
        cancelButtonText={t("authentication:didNotReceiveLink")}
      >
        <ModalContentContainer grow scrollable centerContent>
          <div className="flex w-full justify-center text-green-100">
            <CheckCircle style={{ height: "144px", width: "144px" }} />
          </div>
          <Heading level={2} type="headline-md-b" className="mt-4">
            {t("emailSent", { ns: "authentication" })}
          </Heading>
          <Paragraph type="body-lg-b" className="my-4 break-all">
            {magicLinkEmail}
          </Paragraph>
          <Paragraph type="body-lg">
            {t("clickLink", { ns: "authentication" })}
          </Paragraph>
        </ModalContentContainer>
      </AlertDialog>
    </Dialog.Root>
  );
};

export default AscendSuccessModal;
