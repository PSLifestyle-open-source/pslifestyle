import { ModalContentContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import AlertDialog from "../../common/components/ui/dialogs/AlertDialog";
import DialogDescription from "../../common/components/ui/dialogs/DialogDescription";
import { constants } from "../auth/constants";
import * as Dialog from "@radix-ui/react-dialog";
import { FormEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Props = {
  open: boolean;
  onCancelLogin: () => unknown;
  onConfirm: (email: string) => unknown;
};

const AscendUserFormModal = ({ open, onCancelLogin, onConfirm }: Props) => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation(["recommendations", "authentication"]);

  const handleSubmit = (
    evt: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>,
  ) => {
    evt.preventDefault();
    onConfirm(email);
  };

  return (
    <Dialog.Root open={open}>
      <AlertDialog
        confirmButtonText={t("authentication:sendLink")}
        onConfirmButtonClick={handleSubmit}
        disableConfirmButton={!constants.test(email.toLowerCase())}
        cancelButtonText={t("authentication:continueWithoutSigningIn")}
        onCancelButtonClick={onCancelLogin}
      >
        <ModalContentContainer>
          <Heading level={2} type="headline-xs-eb">
            {t("recommendations:yourPlanIsLookingGreatYouShouldSaveIt")}
          </Heading>
        </ModalContentContainer>
        <ModalContentContainer grow scrollable className="pt-0 flex gap-4">
          <div className="font-normal">
            <DialogDescription cyData="ascendUserFormModal.description">
              {t("recommendations:planWillNotBeSaved")}
            </DialogDescription>
          </div>
          <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              className="p-2 my-6 border border-neutral-10 rounded shadow focus:outline-none w-full"
              name="email"
              type="text"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              placeholder="email@address.com"
            />
          </form>
          <div className="text-neutral-40 mb-3">
            <Trans
              i18nKey="authentication:signInAcceptance"
              components={{
                Link: <Link className="underline" to="/privacynotice" />,
              }}
            />
          </div>
        </ModalContentContainer>
      </AlertDialog>
    </Dialog.Root>
  );
};

export default AscendUserFormModal;
