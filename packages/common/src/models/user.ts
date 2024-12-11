export const campaignManagerRoleName = "CAMPAIGN_MANAGER";

export const userManagerRoleName = "USER_MANAGER";

export type CampaignManagerRole = {
  name: typeof campaignManagerRoleName;
  options: {
    countries: string[];
  };
};

export type UserManagerRole = {
  name: typeof userManagerRoleName;
};

export type UserRoles = Array<CampaignManagerRole | UserManagerRole>;

export type UserSettings = {
  roles: UserRoles;
};

export type User = {
  email: string;
  sessionToken: string;
} & UserSettings;

export const campaignManagerRoleDefaultSettings: CampaignManagerRole = {
  name: "CAMPAIGN_MANAGER",
  options: { countries: [] },
};

export const userManagerRoleDefaultSettings: UserManagerRole = {
  name: "USER_MANAGER",
};

export const roleDefaultSettings = {
  [campaignManagerRoleName]: campaignManagerRoleDefaultSettings,
  [userManagerRoleName]: userManagerRoleDefaultSettings,
};
