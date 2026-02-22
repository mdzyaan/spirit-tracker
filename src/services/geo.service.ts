/**
 * Reverse geocode coordinates to country code (ISO 3166-1 alpha-2) via Nominatim.
 * Use a descriptive User-Agent per https://operations.osmfoundation.org/policies/nominatim/
 */
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "RamadanTracker/1.0 (location setup)";

export async function getCountryCodeFromCoords(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
  });
  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { address?: { country_code?: string } };
  const code = data.address?.country_code;
  return typeof code === "string" ? code.toUpperCase() : null;
}
