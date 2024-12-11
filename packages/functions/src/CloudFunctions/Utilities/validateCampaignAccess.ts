import { CampaignManagerRole } from "../../../../common/src/models/user";
import * as functions from "firebase-functions";

export const validateCampaignAccess = (
  campaignManagerOptions: CampaignManagerRole["options"],
  campaign: { allowedCountries: string[] },
): void => {
  if (
    campaign.allowedCountries.some(
      (allowedCountry) =>
        !campaignManagerOptions.countries.includes(allowedCountry),
    )
  ) {
    throw new functions.https.HttpsError(
      "permission-denied",
      `User Is not allowed to create campaign for one of these countries: ${campaign.allowedCountries.join(
        ", ",
      )}`,
    );
  }
};
