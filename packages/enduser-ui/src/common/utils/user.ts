import { User } from "@pslifestyle/common/src/models/user";

export const assertRole = (user: User, roleName: string): boolean =>
  !!user.roles.find((role) => role.name === roleName);

export const getRoleOptions = (
  user: User,
  roleName: string,
): Record<string, unknown> | null => {
  const foundRole = user.roles.find((role) => role.name === roleName);

  return foundRole && "options" in foundRole ? foundRole.options : null;
};
