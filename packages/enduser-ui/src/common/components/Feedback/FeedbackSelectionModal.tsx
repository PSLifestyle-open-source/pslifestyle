import { ModalContentContainer } from "../layout/Container";
import Checkbox from "../ui/Checkbox";
import Heading from "../ui/Heading";
import Paragraph from "../ui/Paragraph";
import AlertDialog from "../ui/dialogs/AlertDialog";
import { Country } from "@pslifestyle/common/src/models/countries";
import { FeedbackCard } from "@pslifestyle/common/src/types/feedback";
import { useTranslation } from "react-i18next";

type Props = {
  onConfirm: () => void;
  feedbackCards: FeedbackCard[];
  selectedOptions: string[];
  onOptionSelected: (option: string) => void;
  country: Country | null;
};

const FeedbackSelectionModal = ({
  onConfirm,
  feedbackCards,
  selectedOptions,
  onOptionSelected,
  country,
}: Props) => {
  const { t } = useTranslation([
    "common",
    "feedback",
    "feedbackCardsTranslations",
  ]);
  return (
    <AlertDialog
      cancelButtonText={t("cancel", { ns: "common" })}
      confirmButtonText={t("submit", { ns: "common" })}
      onConfirmButtonClick={onConfirm}
    >
      <ModalContentContainer>
        <Heading level={2} type="headline-sm-b">
          {t("feedback:plan-looking-great-need-help")}
        </Heading>
        <Paragraph type="body-lg" className="mt-1">
          {t("feedback:request-changes-to-tool")}
        </Paragraph>
      </ModalContentContainer>
      <ul className="mt-4 overflow-y-auto flex-grow">
        {feedbackCards
          .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
          .map(({ id }) => (
            <li key={id} className="border-t border-transparent-black">
              <Checkbox
                checked={selectedOptions.includes(id)}
                onChange={() => onOptionSelected(id)}
              >
                {t(`${id}_${country?.code}`, {
                  ns: "feedbackCardsTranslations",
                })}
              </Checkbox>
            </li>
          ))}
      </ul>
    </AlertDialog>
  );
};

export default FeedbackSelectionModal;
