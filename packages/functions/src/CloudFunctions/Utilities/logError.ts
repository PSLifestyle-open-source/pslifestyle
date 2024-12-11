import { error } from "firebase-functions/logger";

export const logError = (
  componentName: string,
  err: unknown,
  userId: string,
  details?: Record<string, unknown>,
) => {
  error(
    `Internal error in component ${componentName} for user ${userId}`,
    err,
    details,
  );
};
