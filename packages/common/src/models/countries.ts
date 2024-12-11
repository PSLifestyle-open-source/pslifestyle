export type Country = { name: string; code: string; languages: string[] };

export const countries: Country[] = [
  {
    name: "Europe",
    code: "EU",
    languages: ["en-GB"],
  },
];

export const countryCodes = countries.map((country) => country.code);
export const countryLanguages = countries.reduce(
  (acc, country) =>
    acc.concat(country.languages.map((lang) => `${lang}:${country.code}`)),
  [] as string[],
);

export function getCountryObjectByCode(code: string) {
  return countries.find((country) => country.code === code);
}
