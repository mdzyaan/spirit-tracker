/** Aladhan calculation method codes */
export const CALCULATION_METHODS = [
  { value: 1, label: "Karachi" },
  { value: 2, label: "ISNA" },
  { value: 3, label: "MWL" },
  { value: 4, label: "Umm Al-Qura" },
] as const;

export type CalculationMethodValue = (typeof CALCULATION_METHODS)[number]["value"];

/** Suggest calculation method by country code (ISO 3166-1 alpha-2). */
export function suggestMethodForCountry(countryCode: string): CalculationMethodValue {
  const upper = countryCode.toUpperCase();
  if (["PK", "IN", "BD"].includes(upper)) return 1;
  if (["SA", "AE", "KW", "QA", "BH", "OM", "YE"].includes(upper)) return 4;
  if (["US", "CA", "GB", "FR", "DE", "AU"].includes(upper)) return 2;
  return 2; // default ISNA
}
