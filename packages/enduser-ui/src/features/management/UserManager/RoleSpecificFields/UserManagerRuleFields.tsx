import { DefaultUserRuleFields } from "./DefaultUserRuleFields";
import React from "react";

export const UserManagerRuleFields = ({
  roleName,
  onRoleDeleted,
}: {
  roleName: string;
  onRoleDeleted: (roleName: string) => void;
}) => (
  <DefaultUserRuleFields roleName={roleName} onRoleDeleted={onRoleDeleted} />
);
