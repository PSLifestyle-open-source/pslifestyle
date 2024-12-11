import { locationSelectors } from "../../features/location/locationSlice";
import { buildDocReference, getDoc } from "../FirestoreClient";
import { defaultSWRConfig } from "../swrConfig";
import { queryLatestEntityVersion } from "./common";
import { Country } from "@pslifestyle/common/src/models/countries";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";
import { useSelector } from "react-redux";
import useSWR from "swr";

export const fetchCombinedConstants = async (
  country: Country,
  knownConstantSet?: string,
): Promise<{
  constantSetVersion: string;
  constants: Record<string, number> | undefined;
}> => {
  const collectionName = "constantsContent";
  const constantSetVersion =
    knownConstantSet || (await queryLatestEntityVersion(collectionName));

  const [countryConstantsDocSnap, defaultConstantsDocSnap] = await Promise.all([
    getDoc(
      await buildDocReference(
        "constantsContent",
        constantSetVersion,
        country.code,
        "constants",
      ),
    ),
    getDoc(
      await buildDocReference(
        "constantsContent",
        constantSetVersion,
        "DEFAULT",
        "constants",
      ),
    ),
  ]);

  return {
    constantSetVersion,
    constants: {
      ...defaultConstantsDocSnap.data(),
      ...countryConstantsDocSnap.data(),
    },
  };
};
export const fetchConstantsForCountry = async (
  country: Country,
  knownConstantSet?: string,
): Promise<[string, MathScopes] | null> => {
  // First query to find the ID of the latest constant set version
  const { constantSetVersion, constants } = await fetchCombinedConstants(
    country,
    knownConstantSet,
  );

  const existingMathScopeString = localStorage.getItem("mathScope");
  const existingMathScope = existingMathScopeString
    ? JSON.parse(existingMathScopeString)
    : undefined;
  const mergedConstants = { ...constants, ...existingMathScope };
  if (constantSetVersion === "" || Object.keys(mergedConstants).length === 0) {
    throw new Error("Problem with fetching constants");
  }
  return [constantSetVersion, mergedConstants];
};

export const useCombinedConstantsForCurrentCountry = () => {
  const country = useSelector(locationSelectors.country);

  return useSWR(
    country ? ["fetchConstants", country] : null,
    ([_, selectedCountry]) => fetchConstantsForCountry(selectedCountry),
    defaultSWRConfig,
  );
};
