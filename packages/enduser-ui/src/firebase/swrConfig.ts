import { fiveMinutesInterval } from "../common/utils/helpers";

export const defaultSWRConfig = {
  revalidateIfStale: false,
  refreshInterval: fiveMinutesInterval,
  errorRetryCount: 0,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
