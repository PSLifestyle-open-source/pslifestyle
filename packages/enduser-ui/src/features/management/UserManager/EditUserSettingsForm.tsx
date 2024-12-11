import Heading from "../../../common/components/ui/Heading";
import { ButtonLarge } from "../../../common/components/ui/buttons";
import { saveUserSettings } from "../../../firebase/api/saveUserSettings";
import { CampaignManagerRuleFields } from "./RoleSpecificFields/CampaignManagerRuleFields";
import { NewRole } from "./RoleSpecificFields/NewRole";
import { UserManagerRuleFields } from "./RoleSpecificFields/UserManagerRuleFields";
import {
  campaignManagerRoleName,
  roleDefaultSettings,
  userManagerRoleName,
  UserRoles,
  UserSettings,
} from "@pslifestyle/common/src/models/user";
import * as Form from "@radix-ui/react-form";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const roleFieldsRenderers: {
  [roleName: string]: ({
    roleName,
    options,
    onRoleUpdated,
    onRoleDeleted,
  }: {
    roleName: string;
    options: Record<string, unknown>;
    onRoleUpdated: (roleName: string, options: Record<string, unknown>) => void;
    onRoleDeleted: (roleName: string) => void;
  }) => JSX.Element;
} = {
  [userManagerRoleName]: UserManagerRuleFields,
  [campaignManagerRoleName]: CampaignManagerRuleFields,
};

export const EditUserSettingsForm = ({
  targetUserEmail,
  userSettings,
  setUserSettings,
}: {
  targetUserEmail: string;
  userSettings: UserSettings;
  setUserSettings: (userSettings: UserSettings) => void;
}) => {
  const [saveErrorOccurred, setSaveErrorOccurred] = useState(false);
  const [isSaveSuccessful, setIsSaveSuccessful] = useState(false);
  const { t } = useTranslation("management");

  const availableNewRoles: Array<keyof typeof roleDefaultSettings> =
    Object.keys(roleDefaultSettings).filter(
      (availableRoleName) =>
        !userSettings.roles.some((role) => role.name === availableRoleName),
    ) as unknown as Array<keyof typeof roleDefaultSettings>;

  useEffect(() => {
    setSaveErrorOccurred(false);
    setIsSaveSuccessful(false);
  }, [targetUserEmail]);

  const onAddNewRole = (newRole: keyof typeof roleDefaultSettings) => {
    setUserSettings({
      ...userSettings,
      roles: [...userSettings.roles, roleDefaultSettings[newRole]],
    });
  };

  const onRoleDeleted = (deletedRoleName: string) => {
    setUserSettings({
      ...userSettings,
      roles: userSettings.roles.filter((role) => role.name !== deletedRoleName),
    });
  };

  const onRoleUpdated = (updatedRoleName: string, updatedOptions: unknown) => {
    const userRoles: UserRoles = JSON.parse(JSON.stringify(userSettings.roles));
    const updatedRoles = userRoles.reduce((aggregator: UserRoles, userRole) => {
      if (userRole.name === updatedRoleName) {
        aggregator.push({
          name: updatedRoleName,
          // Here we need to assume that right options are provided
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options: updatedOptions as any,
        });
      } else {
        aggregator.push(userRole);
      }

      return aggregator;
    }, []);

    setUserSettings({
      ...userSettings,
      roles: updatedRoles,
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveErrorOccurred(false);
    setIsSaveSuccessful(false);
    try {
      await saveUserSettings(targetUserEmail, userSettings);
      setIsSaveSuccessful(true);
    } catch (error: unknown) {
      console.log(error);
      setSaveErrorOccurred(true);
    }
  };

  const rolesToRender = userSettings.roles.map((role) => {
    const RoleFieldsRenderer = roleFieldsRenderers[role.name];

    return (
      <div
        key={role.name}
        className="my-4 p-4 bg-basic-white shadow-lg rounded-xl"
      >
        <RoleFieldsRenderer
          roleName={role.name}
          options={"options" in role ? role.options : {}}
          onRoleUpdated={onRoleUpdated}
          onRoleDeleted={onRoleDeleted}
        />
      </div>
    );
  });

  return (
    <div>
      <div className="text-center">
        {isSaveSuccessful && (
          <Heading level={2} type="headline-md-b" className="text-green-100">
            User settings saved successfully
          </Heading>
        )}
        {saveErrorOccurred && (
          <Heading level={2} type="headline-md-b" className="text-red-100">
            Error occurred when saving user settings
          </Heading>
        )}
      </div>
      <Form.Root onSubmit={onSubmit}>
        {rolesToRender}
        <Form.Submit asChild>
          <ButtonLarge type="submit">
            {t("userManager.submitUserRoles")}
          </ButtonLarge>
        </Form.Submit>
      </Form.Root>
      <NewRole availableRoles={availableNewRoles} onAddNewRole={onAddNewRole} />
    </div>
  );
};
