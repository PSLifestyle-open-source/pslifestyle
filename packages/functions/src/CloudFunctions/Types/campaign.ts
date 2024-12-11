import { Timestamp } from "firebase-admin/firestore";

export interface StoredCampaign {
  name: string;
  isHidden: boolean;
  allowedCountries: string[];
  redirectDestination: "test" | "homepage";
  createdAt: Timestamp;
}
