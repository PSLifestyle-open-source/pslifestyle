import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import { ButtonLarge } from "../../common/components/ui/buttons";
import DialogTitle from "../../common/components/ui/dialogs/DialogTitle";
import NotificationDialog from "../../common/components/ui/dialogs/NotificationDialog";
import { usePersistCampaign } from "../../common/hooks/firebaseHooks";
import { fetchCampaigns } from "../../firebase/api/fetchCampaigns";
import { ExistingCampaignLinksList } from "./ExistingCampaignLinksList";
import { NewCampaignLinkForm } from "./NewCampaignLinkForm";
import { User } from "@pslifestyle/common/src/models/user";
import {
  UpdateCampaign,
  NewCampaign,
} from "@pslifestyle/common/src/types/api/payloadTypes";
import { Campaign } from "@pslifestyle/common/src/types/campaign";
import * as Collapsible from "@radix-ui/react-collapsible";
import React from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

interface IProps {
  user: User;
}

const CampaignLinkManager = ({ user }: IProps): JSX.Element => {
  const [openCreateCampaign, setOpenCreateCampaign] = React.useState(false);
  const { t } = useTranslation(["common", "management"]);
  const {
    error,
    mutate,
    isLoading,
    data: campaigns,
  } = useSWR(["campaigns"], async (): Promise<Campaign[]> => {
    const response = await fetchCampaigns();

    return response.data || [];
  });

  const { sendCampaignToBackend, state, reset } = usePersistCampaign();

  const onCreate = async (campaign: NewCampaign) => {
    await sendCampaignToBackend(campaign);
    await mutate();
  };

  const onUpdate = async (campaign: UpdateCampaign) => {
    await sendCampaignToBackend(campaign);
    await mutate();
  };

  return (
    <ContainerLoader loading={isLoading || state.loading}>
      <Collapsible.Root
        className="flex flex-col justify-center"
        open={openCreateCampaign}
        onOpenChange={setOpenCreateCampaign}
      >
        <Collapsible.Trigger asChild className="my-2">
          <ButtonLarge>
            {t("campaignManager.openCampaignCreator", { ns: "management" })}
          </ButtonLarge>
        </Collapsible.Trigger>
        <Collapsible.Content className="bg-neutral-5 p-2">
          <NewCampaignLinkForm onCreate={onCreate} user={user} />
        </Collapsible.Content>
      </Collapsible.Root>
      <ExistingCampaignLinksList
        campaigns={campaigns || []}
        onUpdate={onUpdate}
        failedToLoad={!!error}
      />
      <NotificationDialog
        open={state.error}
        onClose={reset}
        closeButtonText={t("hide", { ns: "common" })}
      >
        <DialogTitle cyData="saveCampaign.error.title">
          {t("error.general")}
        </DialogTitle>
      </NotificationDialog>
    </ContainerLoader>
  );
};

export default CampaignLinkManager;
