import {
  UpdateCampaign,
  NewCampaign,
} from "../../../../common/src/types/api/payloadTypes";
import { CampaignRedirectDestination } from "../../../../common/src/types/api/responseTypes";
import { Campaign } from "../../../../common/src/types/campaign";
import { collections } from "../../constants";
import { StoredCampaign } from "../Types/campaign";
import * as admin from "firebase-admin";
import {
  DocumentSnapshot,
  QuerySnapshot,
  Timestamp,
} from "firebase-admin/firestore";

export const createCampaign = async (campaign: NewCampaign) => {
  return await admin
    .firestore()
    .collection(collections.campaigns)
    .add({
      ...campaign,
      isHidden: false,
      createdAt: Timestamp.fromDate(new Date()),
    });
};

export const updateCampaign = async (campaign: UpdateCampaign) => {
  return await admin
    .firestore()
    .collection(collections.campaigns)
    .doc(campaign.id)
    .set({ isHidden: campaign.isHidden }, { merge: true });
};

export const findCampaign = async (
  campaignId: string,
): Promise<Campaign | null> => {
  const campaign = (await admin
    .firestore()
    .collection(collections.campaigns)
    .doc(campaignId)
    .get()) as DocumentSnapshot<StoredCampaign>;

  const campaignData = campaign.data();

  return campaignData
    ? ({
        ...campaignData,
        id: campaign.id,
        createdAt: campaignData.createdAt.toDate().toISOString(),
      } as Campaign)
    : null;
};

export const findCampaignsList = async (
  allowedCountries: string[],
): Promise<Campaign[]> => {
  const campaigns = (await admin
    .firestore()
    .collection(collections.campaigns)
    .where("allowedCountries", "array-contains-any", allowedCountries)
    .where("isHidden", "==", false)
    .orderBy("createdAt", "desc")
    .limit(100)
    .get()) as QuerySnapshot<StoredCampaign>;

  return campaigns.docs.map((campaign) => ({
    ...campaign.data(),
    id: campaign.id,
    createdAt: campaign.data().createdAt.toDate().toISOString(),
  }));
};

export const campaignExists = async (campaignId: string): Promise<boolean> => {
  const campaign = await admin
    .firestore()
    .collection(collections.campaigns)
    .doc(campaignId)
    .get();

  return campaign.exists;
};

export const getCampaignsDetails = async (
  campaignIds?: string[],
): Promise<{
  allowedCountries: string[];
  redirectDestination: CampaignRedirectDestination;
}> => {
  if (!campaignIds || !campaignIds.length) {
    return { allowedCountries: [], redirectDestination: "homepage" };
  }
  const campaigns = (await admin
    .firestore()
    .collection(collections.campaigns)
    .where("__name__", "in", campaignIds)
    .get()) as QuerySnapshot<Campaign>;

  if (campaigns.empty) {
    return { allowedCountries: [], redirectDestination: "homepage" };
  }

  const allowedCountries: Set<string> = new Set();
  let redirectDestination: CampaignRedirectDestination = "homepage";

  campaigns.docs.forEach((value) => {
    if (value.data().redirectDestination === "test") {
      redirectDestination = "test";
    }

    value
      .data()
      .allowedCountries.forEach((allowedCountry) =>
        allowedCountries.add(allowedCountry),
      );
  });

  return {
    allowedCountries: Array.from(allowedCountries),
    redirectDestination,
  };
};
