import { fiveMinutesInterval } from "../../common/utils/helpers";
import { locationSelectors } from "../../features/location/locationSlice";
import { buildQuery, getDocs } from "../FirestoreClient";
import { queryLatestEntityVersion } from "./common";
import { RawRecommendedAction } from "@pslifestyle/common/src/types/planTypes";
import { useSelector } from "react-redux";
import useSWR from "swr";

export const fetchActionsForCountry = async (
  countryCode: string,
): Promise<[string, RawRecommendedAction[]]> => {
  const collectionName = "actions";
  const actionSetVersion = await queryLatestEntityVersion(collectionName);

  // Second query for the actual questions
  const queryPath = `${collectionName}/${actionSetVersion}/${countryCode}/`;
  const queryActions = buildQuery(queryPath);
  const queryResults = await getDocs(await queryActions);
  return [
    actionSetVersion,
    queryResults.docs.map((action) => action.data() as RawRecommendedAction),
  ];
};

export const useActionsForCurrentCountry = (): {
  isLoading: boolean;
  error: string;
  data: [string, RawRecommendedAction[]] | undefined;
} => {
  const country = useSelector(locationSelectors.country);

  const { error, isLoading, data } = useSWR(
    country?.code ? ["fetchActions", country.code] : null,
    () => fetchActionsForCountry(country!.code),
    {
      revalidateIfStale: false,
      refreshInterval: fiveMinutesInterval,
      revalidateOnFocus: false,
    },
  );

  return {
    isLoading,
    data,
    error,
  };
};
