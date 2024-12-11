import { Timestamp } from "firebase-admin/firestore";

export interface SavedFeedback {
  selectedOptions: string[];
  metadata: FeedbackMetadata;
}

export interface FeedbackMetadata {
  createdAt: Timestamp;
  campaignIds: string[];
}
