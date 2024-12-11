import {
  CalculatedAction,
  SkippedAction,
} from "../../../../common/src/types/planTypes";
import { Timestamp } from "firebase-admin/firestore";

export interface SavedPlan {
  selectedActions: CalculatedAction[];
  alreadyDoThisActions: CalculatedAction[];
  skippedActions: SkippedAction[];
  metadata: PlanMetadata;
}

export interface PlanMetadata {
  createdAt: Timestamp;
  campaignIds: string[];
}
