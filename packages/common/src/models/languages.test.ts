import { Country } from "./countries";
import { getLanguageNativeName, languageOptionsForCountry } from "./languages";

describe("LanguageUtils", () => {
  describe("languageOptionsForCountry", () => {
    it("should return proper language selection for given country", () => {
      const country: Country = {
        code: "EU",
        languages: ["en-GB"],
        name: "Europe",
      };
      const expected = [{ label: "English", value: "en-GB" }];

      expect(languageOptionsForCountry(country)).toEqual(expected);
    });
  });

  describe("get", () => {
    it("should return true when language is available", () => {
      expect(getLanguageNativeName("en-GB")).toEqual("English");
    });

    it("should return empty string if nativeName is not available", () => {
      expect(getLanguageNativeName("unsupported-language")).toEqual("");
    });
  });
});
