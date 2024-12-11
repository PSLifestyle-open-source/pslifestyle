import { locationSelectors } from "../../../features/location/locationSlice";
import { fetchFeedbackCards } from "../../../firebase/db/feedbackCards";
import { usePersistFeedback } from "../../hooks/firebaseHooks";
import { ContainerLoader } from "../loaders/ContainerLoader";
import FeedbackEnd from "./FeedbackEnd";
import FeedbackError from "./FeedbackError";
import FeedbackSelectionModal from "./FeedbackSelectionModal";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";

const FeedbackModalFlow = ({ children }: { children: ReactNode }) => {
  const country = useSelector(locationSelectors.country);
  const { isLoading: areFeedbackCardsLoading, data: rawFeedbackCardResponse } =
    useSWR(
      country ? ["fetchFeedbackCards", country] : null,
      ([_, selectedCountry]) => fetchFeedbackCards(selectedCountry),
    );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const {
    sendFeedbackToBackend,
    state: feedbackSaveState,
    reset: resetFeedbackSaveState,
  } = usePersistFeedback();

  return (
    <>
      <ContainerLoader
        loading={areFeedbackCardsLoading || feedbackSaveState.loading}
        className="flex flex-col"
      >
        <Dialog.Root>
          <Dialog.Trigger asChild className="w-full">
            {children}
          </Dialog.Trigger>
          <FeedbackSelectionModal
            onOptionSelected={(selectedOption) => {
              setSelectedOptions((prevState) => {
                if (prevState.includes(selectedOption)) {
                  return prevState.filter(
                    (oldReason) => oldReason !== selectedOption,
                  );
                }
                return prevState.concat(selectedOption);
              });
            }}
            feedbackCards={rawFeedbackCardResponse?.[1] ?? []}
            onConfirm={() => sendFeedbackToBackend(selectedOptions)}
            selectedOptions={selectedOptions}
            country={country}
          />
        </Dialog.Root>
      </ContainerLoader>

      <FeedbackEnd
        open={feedbackSaveState.success}
        onClose={resetFeedbackSaveState}
      />
      <FeedbackError
        open={feedbackSaveState.error}
        onClose={resetFeedbackSaveState}
      />
    </>
  );
};

export default FeedbackModalFlow;
