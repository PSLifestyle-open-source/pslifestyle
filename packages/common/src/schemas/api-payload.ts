import { countries } from "../models/countries";
import { campaignManagerRoleName, userManagerRoleName } from "../models/user";
import { z } from "zod";

const loggedInUser = z.object({ email: z.string(), sessionToken: z.string() });
const anonUser = z.object({ anonId: z.string() });

const newAnswerSchema = z.object({
  questionId: z.string(),
  choiceText: z.string(),
  sortKey: z.string(),
});

const newAnswerSetSchema = z.object({
  answers: z.array(newAnswerSchema),
  metadata: z.object({
    constantsVersion: z.string(),
    questionnaireVersion: z.string(),
    countryCode: z.string(),
  }),
});

const userSettingsSchema = z.object({
  roles: z.array(
    z.union([
      z.object({
        name: z.literal(campaignManagerRoleName),
        options: z.object({
          countries: z.array(
            z.enum(
              countries.map((country) => country.code) as [string, ...string[]],
            ),
          ),
        }),
      }),
      z.object({ name: z.literal(userManagerRoleName) }),
    ]),
  ),
});

const selectedActionSchema = z.object({
  id: z.string(),
  state: z.enum(["completed", "new"]),
});
const alreadyDoThisActionSchema = z.object({
  id: z.string(),
  state: z.enum(["new"]),
});
const skippedActionSchema = z.object({
  id: z.string(),
  reasons: z.array(z.string()),
});

const newPlanSchema = z.object({
  selectedActions: z.array(selectedActionSchema),
  alreadyDoThisActions: z.array(alreadyDoThisActionSchema),
  skippedActions: z.array(skippedActionSchema),
});

export const initializeUserPayloadSchema = z.object({
  campaignId: z.string().optional().nullable(),
  version: z.number(),
  user: z.union([anonUser, loggedInUser]).optional(),
});

export const updateCampaignSchema = z.object({
  id: z.string(),
  isHidden: z.boolean(),
});

export const newCampaignSchema = z.object({
  name: z.string(),
  allowedCountries: z.array(z.string()),
  redirectDestination: z.enum(["test", "homepage"]),
});

export const requestLinkPayloadSchema = z.object({
  email: z.string(),
  anonId: z.string(),
  languageCode: z.string(),
  ascend: z
    .object({
      answerSet: newAnswerSetSchema,
      plan: newPlanSchema,
    })
    .optional(),
  version: z.number(),
});

export const deleteUserPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
});

export const checkLinkPayloadSchema = z.object({
  version: z.number(),
  email: z.string(),
  magicLinkTokenFromLink: z.string(),
});

export const fetchUserAnswersPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
});

export const fetchUserPlanPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
});
export const fetchUserSettingsPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
  targetUserEmail: z.string(),
});
export const fetchCampaignsPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
});
export const fetchCampaignStatisticsPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
  campaignId: z.string(),
});

export const saveUserAnswersPayloadSchema = z.object({
  version: z.number(),
  user: z.union([anonUser, loggedInUser]),
  answerSet: newAnswerSetSchema,
});

export const saveUserPlanPayloadSchema = z.object({
  version: z.number(),
  answerSetId: z.string(),
  user: z.union([anonUser, loggedInUser]),
  plan: newPlanSchema,
});

export const saveUserSettingsPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
  targetUserEmail: z.string(),
  userSettings: userSettingsSchema,
});

export const saveUserFeedbackPayloadSchema = z.object({
  version: z.number(),
  answerSetId: z.string(),
  user: z.union([anonUser, loggedInUser]),
  feedback: z.object({
    selectedOptions: z.array(z.string()),
  }),
});

export const saveCampaignPayloadSchema = z.object({
  version: z.number(),
  user: loggedInUser,
  campaign: z.union([updateCampaignSchema, newCampaignSchema]),
});
