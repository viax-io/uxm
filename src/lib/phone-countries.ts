/**
 * Curated country list backing the PhoneInput country picker. ~30 entries
 * covering the regions most B2B apps actually ship to. Consumers needing
 * different coverage pass a custom `countries` prop to PhoneInput.
 *
 * Each entry carries:
 *   - `iso`    ISO-3166 alpha-2 code (the canonical key)
 *   - `name`   English country name (display in the picker)
 *   - `dial`   E.164 dialing prefix (e.g. "+1", "+44")
 *   - `flag`   Unicode flag emoji (derived from the ISO code at module
 *              load time, so the file stays compact)
 *   - `format` Optional digit-grouping mask, written with `X` as the
 *              digit placeholder. The mask function inserts the literal
 *              characters between digits as the user types. `undefined`
 *              means "no display formatting — show raw digits."
 *
 * Why curated, not all 240+ ISO countries: hand-writing the full set with
 * accurate per-country formats is a maintenance pit, and most B2B apps
 * have a smaller list anyway. Consumers can extend via the prop.
 */

export interface PhoneCountry {
  iso: string;
  name: string;
  dial: string;
  flag: string;
  format?: string;
}

/**
 * Convert an ISO-3166 alpha-2 code to the corresponding flag emoji by
 * mapping each letter to the matching Regional Indicator Symbol code
 * point (U+1F1E6 = 🇦, …, U+1F1FF = 🇿). Keeps the country data compact
 * — flags aren't authored into the source.
 *
 * Renders correctly on macOS, iOS, Android, modern Linux. On Windows
 * older than Win11, the OS falls back to the bare ISO letters since
 * Windows doesn't ship the flag emoji glyphs — acceptable degradation.
 */
function isoToFlag(iso: string): string {
  return iso
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

/** Raw seed: `iso|name|dial|format`. Empty format = no mask. */
const RAW_DATA = `
US|United States|1|(XXX) XXX-XXXX
CA|Canada|1|(XXX) XXX-XXXX
MX|Mexico|52|XX XXXX XXXX
GB|United Kingdom|44|XXXX XXX XXXX
IE|Ireland|353|
FR|France|33|X XX XX XX XX
DE|Germany|49|
IT|Italy|39|XXX XXX XXXX
ES|Spain|34|XXX XXX XXX
NL|Netherlands|31|
BE|Belgium|32|
CH|Switzerland|41|XX XXX XX XX
AT|Austria|43|
SE|Sweden|46|XX XXX XX XX
NO|Norway|47|XXX XX XXX
DK|Denmark|45|XX XX XX XX
FI|Finland|358|
PT|Portugal|351|XXX XXX XXX
PL|Poland|48|XXX XXX XXX
JP|Japan|81|XX-XXXX-XXXX
CN|China|86|XXX XXXX XXXX
IN|India|91|XXXXX XXXXX
SG|Singapore|65|XXXX XXXX
HK|Hong Kong|852|XXXX XXXX
KR|South Korea|82|XX-XXXX-XXXX
TW|Taiwan|886|
AU|Australia|61|XXX XXX XXX
NZ|New Zealand|64|
BR|Brazil|55|XX XXXXX XXXX
AE|United Arab Emirates|971|
IL|Israel|972|XX-XXX-XXXX
ZA|South Africa|27|XX XXX XXXX
`.trim();

export const CURATED_COUNTRIES: PhoneCountry[] = RAW_DATA.split('\n').map(
  (line) => {
    const [iso, name, dial, format] = line.split('|');
    return {
      iso,
      name,
      dial: `+${dial}`,
      flag: isoToFlag(iso),
      format: format || undefined,
    };
  },
);

const BY_ISO = new Map(CURATED_COUNTRIES.map((c) => [c.iso, c]));

/** Lookup helper for components that need a country by its ISO code. */
export function findCountry(
  iso: string,
  countries: PhoneCountry[] = CURATED_COUNTRIES,
): PhoneCountry | undefined {
  if (countries === CURATED_COUNTRIES) return BY_ISO.get(iso);
  return countries.find((c) => c.iso === iso);
}

/**
 * Apply the country's digit mask to a raw input string. Strips non-digits
 * first (so the user can paste a fully-formatted number and have it re-
 * masked cleanly), then walks the format pattern inserting literals
 * between digits. If the country has no `format`, returns the raw digits.
 */
export function maskNumber(raw: string, country: PhoneCountry | undefined): string {
  const digits = raw.replace(/\D/g, '');
  if (!country?.format) return digits;
  let out = '';
  let di = 0;
  for (const ch of country.format) {
    if (di >= digits.length) break;
    if (ch === 'X') {
      out += digits[di++];
    } else {
      out += ch;
    }
  }
  return out;
}

/** Count the digit slots in a country's format (used to cap input length). */
export function maxDigitsFor(country: PhoneCountry | undefined): number {
  if (!country?.format) return 15; // E.164 max length
  return (country.format.match(/X/g) || []).length;
}
