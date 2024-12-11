import { NarrowWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import { ButtonMedium } from "../../common/components/ui/buttons";
import { fetchCampaignStatistics } from "../../firebase/api/fetchCampaignStatistics";
import AccordionTrigger from "./AccordionTrigger";
import { getCountryObjectByCode } from "@pslifestyle/common/src/models/countries";
import { UpdateCampaign } from "@pslifestyle/common/src/types/api/payloadTypes";
import { CampaignStatisticsResponse } from "@pslifestyle/common/src/types/api/responseTypes";
import { Campaign } from "@pslifestyle/common/src/types/campaign";
import * as Accordion from "@radix-ui/react-accordion";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  campaigns: Campaign[];
  onUpdate: (campaign: UpdateCampaign) => Promise<void>;
  failedToLoad: boolean;
}

interface ICampaignLinkItemProps {
  campaign: Campaign;
  onUpdate: (campaign: UpdateCampaign) => Promise<void>;
}

const CampaignLinkItem = ({ campaign, onUpdate }: ICampaignLinkItemProps) => {
  const [cachedStatistics, setCachedStatistics] =
    useState<CampaignStatisticsResponse | null>(null);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}?campaign=${campaign.id}`,
    );
  };

  const { t } = useTranslation(["management"]);
  return (
    <Accordion.Item value={campaign.id}>
      <AccordionTrigger className="bg-cyan-80">
        {campaign.name}
      </AccordionTrigger>
      <Accordion.Content className="p-1 border-green-100">
        <ul className="bg-transparent flex flex-col pr-2 gap-3">
          <li className="flex flex-row items-center">
            <span className="grow">
              <span className="font-bold">ID:</span> {campaign.id}
            </span>
            <ButtonMedium
              onClick={copyToClipboard}
              icon={{ type: "Copy", size: "small", position: "left" }}
            >
              {t("campaignManager.copyCampaignLink")}
            </ButtonMedium>
          </li>
          <li>
            <span className="font-bold">
              {t("campaignManager.campaignNameLabel")}:{" "}
            </span>
            <span>{campaign.name}</span>
          </li>
          <li>
            <span className="font-bold">
              {t("campaignManager.allowedCountriesLabel")}:{" "}
            </span>
            <span>
              {campaign.allowedCountries
                .map(
                  (countryCode) =>
                    getCountryObjectByCode(countryCode)?.name ||
                    "Unknown country",
                )
                .join(", ")}
            </span>
          </li>
          <li>
            <span className="font-bold">
              {t("campaignManager.redirectDestinationLabel")}:{" "}
            </span>
            <span>{campaign.redirectDestination}</span>
          </li>
          <li>
            <span className="font-bold">
              {t("campaignManager.createdAtLabel")}:{" "}
            </span>
            <span>{campaign.createdAt}</span>
          </li>
          {cachedStatistics && (
            <>
              <li>
                <span className="font-bold">
                  {t("campaignManager.answersCount")}:{" "}
                </span>
                <span>{cachedStatistics.answersCount}</span>
              </li>

              <li>
                <span className="font-bold">
                  {t("campaignManager.plansCount")}:{" "}
                </span>
                <span>{cachedStatistics.plansCount}</span>
              </li>
              <li>
                <span className="font-bold">
                  {t("campaignManager.feedbacksCount")}:{" "}
                </span>
                <span>{cachedStatistics.feedbacksCount}</span>
              </li>
            </>
          )}
          <li className="text-center">
            <ButtonMedium
              theme="goalCTA"
              icon={{ type: "Download", size: "small", position: "left" }}
              onClick={async () => {
                const statistics = await fetchCampaignStatistics(campaign.id);
                setCachedStatistics(statistics.data);
              }}
            >
              {t("campaignManager.loadStatistics")}
            </ButtonMedium>
          </li>
          <li className="text-center">
            <ButtonMedium
              icon={{ type: "Trash", size: "small", position: "left" }}
              onClick={async () => {
                // eslint-disable-next-line no-alert
                if (window.confirm(t("campaignManager.areYouSureToHide"))) {
                  await onUpdate({ isHidden: true, id: campaign.id });
                }
              }}
            >
              {t("campaignManager.hideLink")}
            </ButtonMedium>
          </li>
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export const ExistingCampaignLinksList = ({
  campaigns,
  onUpdate,
  failedToLoad,
}: IProps): JSX.Element => {
  const { t } = useTranslation(["management"]);

  if (failedToLoad) {
    return (
      <Heading level={2} type="headline-md-b">
        {t("campaignManager.failedToLoad")}
      </Heading>
    );
  }
  const campaignItems = campaigns.map((campaign) => (
    <CampaignLinkItem
      key={campaign.id}
      campaign={campaign}
      onUpdate={onUpdate}
    />
  ));

  return (
    <NarrowWidthContainer>
      <Accordion.Root type="single" defaultValue="roleDisplay" collapsible>
        {campaignItems}
      </Accordion.Root>
    </NarrowWidthContainer>
  );
};
