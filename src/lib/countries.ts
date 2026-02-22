import countries from "world-countries";

/** All countries from world-countries: { code: cca2, name: common name }, sorted by name. */
export const COUNTRY_OPTIONS = countries
  .map((c) => ({ code: c.cca2, name: c.name.common }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Lookup country name by ISO 3166-1 alpha-2 code. */
export function getCountryName(code: string): string | undefined {
  return countries.find((c) => c.cca2 === code)?.name.common;
}
