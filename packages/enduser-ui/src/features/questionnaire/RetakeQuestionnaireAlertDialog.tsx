import { useAppDispatch } from "../../app/store";
import { ModalContentContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import Paragraph from "../../common/components/ui/Paragraph";
import AlertDialog from "../../common/components/ui/dialogs/AlertDialog";
import { resetEntityStores } from "../../common/store/actions";
import { userAnswersSelectors } from "./userAnswersSlice";
import * as Dialog from "@radix-ui/react-dialog";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface IProps {
  children: JSX.Element;
  onPreTrigger?: () => void;
}

const RetakeQuestionnaireAlertDialog: FC<IProps> = ({
  onPreTrigger,
  children,
}) => {
  const { t } = useTranslation(["questionnaire", "common"]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const hasAnswers = useSelector(userAnswersSelectors.hasAnswers);

  const onTrigger = useCallback(() => {
    if (onPreTrigger) {
      onPreTrigger();
    }
    if (hasAnswers) {
      setOpen(true);
    } else {
      navigate("/test");
    }
  }, [onPreTrigger, hasAnswers, navigate]);
  const onConfirm = useCallback(() => {
    setOpen(false);
    dispatch(resetEntityStores());
    navigate("/test");
  }, [dispatch, navigate]);

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger onClick={onTrigger} asChild>
        {children}
      </Dialog.Trigger>
      <AlertDialog
        confirmButtonText={t("retakeAlert.retakeTestConfirmation", {
          ns: "questionnaire",
        })}
        onConfirmButtonClick={onConfirm}
        cancelButtonText={t("cancel", { ns: "common" })}
        onCancelButtonClick={onCancel}
      >
        <ModalContentContainer grow scrollable centerVertically>
          <Heading
            data-cy="retakeAlert.title"
            level={2}
            type="headline-xs-eb"
            className="mb-6"
          >
            {t("retakeAlert.title", { ns: "questionnaire" })}
          </Heading>
          <Paragraph type="body-lg">
            {t("retakeAlert.description", { ns: "questionnaire" })}
          </Paragraph>
        </ModalContentContainer>
      </AlertDialog>
    </Dialog.Root>
  );
};

export default RetakeQuestionnaireAlertDialog;
