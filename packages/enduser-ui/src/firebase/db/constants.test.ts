import {
  buildDocReference,
  buildQuery,
  getDoc,
  getDocs,
} from "../FirestoreClient";
import { fetchCombinedConstants, fetchConstantsForCountry } from "./constants";
import { Country } from "@pslifestyle/common/src/models/countries";
import { vi, Mock } from "vitest";

vi.mock("../FirestoreClient");

describe("fetchConstants", () => {
  const country: Country = {
    code: "FI",
    name: "Finland",
    languages: ["suomi", "English"],
  };
  const localStorageGetItemSpy = vi.spyOn(Storage.prototype, "getItem");
  const buildQuerySpy = buildQuery as Mock;
  const getDocSpy = getDoc as Mock;
  const getDocsSpy = getDocs as Mock;
  const buildDocReferenceSpy = buildDocReference as Mock;

  const mockCountryConstantsData = {
    ABSOLUTE_FOOD_SHARE_OF_AVG_FOOTPRINT: 1800,
    ABSOLUTE_HOUSING_SHARE_OF_AVG_FOOTPRINT: 1400,
    ABSOLUTE_PURCHASES_SHARE_OF_AVG_FOOTPRINT: 2100,
  };
  const mockDefaultConstantsData = {
    ABSOLUTE_FOOD_SHARE_OF_AVG_FOOTPRINT: 2000,
    ABSOLUTE_HOUSING_SHARE_OF_AVG_FOOTPRINT: 1900,
    ABSOLUTE_PURCHASES_SHARE_OF_AVG_FOOTPRINT: 2000,
    ABSOLUTE_TRANSPORT_SHARE_OF_AVG_FOOTPRINT: 3900,
  };

  it("When there are existing constants in local storage, expect them to be combined to list of constants", async () => {
    const knownVersion = "2023-02-27T13:39:31.316Z";
    const constantsInLocalStorage = {
      ABSOLUTE_FOOD_SHARE_OF_AVG_FOOTPRINT: 2500,
      ABSOLUTE_HOUSING_SHARE_OF_AVG_FOOTPRINT: 2900,
    };

    localStorageGetItemSpy.mockReturnValueOnce(
      JSON.stringify(constantsInLocalStorage),
    );
    const expectedResult = [
      knownVersion,
      {
        ABSOLUTE_FOOD_SHARE_OF_AVG_FOOTPRINT: 2500,
        ABSOLUTE_HOUSING_SHARE_OF_AVG_FOOTPRINT: 2900,
        ABSOLUTE_PURCHASES_SHARE_OF_AVG_FOOTPRINT: 2100,
        ABSOLUTE_TRANSPORT_SHARE_OF_AVG_FOOTPRINT: 3900,
      },
    ];

    getDocSpy
      .mockReturnValueOnce({ data: () => mockCountryConstantsData })
      .mockReturnValueOnce({ data: () => mockDefaultConstantsData });

    expect(await fetchConstantsForCountry(country, knownVersion)).toEqual(
      expectedResult,
    );
    expect(localStorageGetItemSpy).toHaveBeenCalledWith("mathScope");
  });
  it("When there is no constants in local storage, expect constants from database only", async () => {
    const knownVersion = "2023-02-27T13:39:31.316Z";
    const constantsInLocalStorage = null;

    localStorageGetItemSpy.mockReturnValueOnce(
      JSON.stringify(constantsInLocalStorage),
    );
    const expectedResult = [
      knownVersion,
      {
        ABSOLUTE_FOOD_SHARE_OF_AVG_FOOTPRINT: 1800,
        ABSOLUTE_HOUSING_SHARE_OF_AVG_FOOTPRINT: 1400,
        ABSOLUTE_PURCHASES_SHARE_OF_AVG_FOOTPRINT: 2100,
        ABSOLUTE_TRANSPORT_SHARE_OF_AVG_FOOTPRINT: 3900,
      },
    ];

    getDocSpy
      .mockReturnValueOnce({ data: () => mockCountryConstantsData })
      .mockReturnValueOnce({ data: () => mockDefaultConstantsData });

    expect(await fetchConstantsForCountry(country, knownVersion)).toEqual(
      expectedResult,
    );
    expect(localStorageGetItemSpy).toHaveBeenCalledWith("mathScope");
  });
  describe("fetchConstantsRawData", () => {
    it("When constant set version is provided, expect it to be used and provide constants version and global/country specific values", async () => {
      const countryCode = "FI";
      const knownVersion = "2023-02-27T13:39:31.316Z";

      const expectedResult = {
        constantSetVersion: knownVersion,
        constants: {
          ABSOLUTE_FOOD_SHARE_OF_AVG_FOOTPRINT: 1800,
          ABSOLUTE_HOUSING_SHARE_OF_AVG_FOOTPRINT: 1400,
          ABSOLUTE_PURCHASES_SHARE_OF_AVG_FOOTPRINT: 2100,
          ABSOLUTE_TRANSPORT_SHARE_OF_AVG_FOOTPRINT: 3900,
        },
      };

      getDocSpy
        .mockReturnValueOnce({ data: () => mockCountryConstantsData })
        .mockReturnValueOnce({ data: () => mockDefaultConstantsData });

      expect(await fetchCombinedConstants(country, knownVersion)).toEqual(
        expectedResult,
      );
      expect(buildQuerySpy).not.toHaveBeenCalled();
      expect(getDocsSpy).not.toHaveBeenCalled();
      expect(buildDocReferenceSpy).toHaveBeenCalledTimes(2);
      expect(buildDocReferenceSpy).toHaveBeenCalledWith(
        "constantsContent",
        knownVersion,
        countryCode,
        "constants",
      );
      expect(buildDocReferenceSpy).toHaveBeenCalledWith(
        "constantsContent",
        knownVersion,
        "DEFAULT",
        "constants",
      );
      expect(getDocSpy).toHaveBeenCalledTimes(2);
    });
    it("When constant set version is not provided, expect it to be pulled from the database and provide constants version and global/country specific values", async () => {
      const countryCode = "FI";
      const versionFromDatabase = "2023-03-27T13:39:31.316Z";

      const expectedResult = {
        constantSetVersion: versionFromDatabase,
        constants: {
          ABSOLUTE_FOOD_SHARE_OF_AVG_FOOTPRINT: 1800,
          ABSOLUTE_HOUSING_SHARE_OF_AVG_FOOTPRINT: 1400,
          ABSOLUTE_PURCHASES_SHARE_OF_AVG_FOOTPRINT: 2100,
          ABSOLUTE_TRANSPORT_SHARE_OF_AVG_FOOTPRINT: 3900,
        },
      };

      getDocSpy
        .mockReturnValueOnce({ data: () => mockCountryConstantsData })
        .mockReturnValueOnce({ data: () => mockDefaultConstantsData });
      getDocsSpy.mockReturnValueOnce({ docs: [{ id: versionFromDatabase }] });

      expect(await fetchCombinedConstants(country)).toEqual(expectedResult);
      expect(buildQuerySpy).toHaveBeenCalledTimes(1);
      expect(getDocsSpy).toHaveBeenCalledTimes(1);
      expect(buildDocReferenceSpy).toHaveBeenCalledTimes(2);
      expect(buildDocReferenceSpy).toHaveBeenCalledWith(
        "constantsContent",
        versionFromDatabase,
        countryCode,
        "constants",
      );
      expect(buildDocReferenceSpy).toHaveBeenCalledWith(
        "constantsContent",
        versionFromDatabase,
        "DEFAULT",
        "constants",
      );
      expect(getDocSpy).toHaveBeenCalledTimes(2);
    });
  });
});
