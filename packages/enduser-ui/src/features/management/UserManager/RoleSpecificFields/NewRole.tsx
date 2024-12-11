import { ButtonLarge } from "../../../../common/components/ui/buttons";
import { roleDefaultSettings } from "@pslifestyle/common/src/models/user";
import React from "react";
import { useTranslation } from "react-i18next";

export const NewRole = ({
  availableRoles,
  onAddNewRole,
}: {
  availableRoles: Array<keyof typeof roleDefaultSettings>;
  onAddNewRole: (roleName: keyof typeof roleDefaultSettings) => void;
}) => {
  const { t } = useTranslation(["management"]);

  if (!availableRoles.length) {
    return null;
  }

  return (
    <div className="mt-4 border-t-2 pt-4">
      <ul>
        {availableRoles.map((availableRole) => (
          <li className="my-4" key={availableRole}>
            <ButtonLarge
              type="button"
              onClick={() => onAddNewRole(availableRole)}
            >
              {t("userManager.addNewRole")} {availableRole}
            </ButtonLarge>
          </li>
        ))}
      </ul>
    </div>
  );
};
