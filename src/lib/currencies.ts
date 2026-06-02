/**
 * Curated currency list backing the CurrencyInput picker. ~20 entries
 * covering the regions most B2B / fintech apps actually transact in.
 * Consumers needing different coverage pass a custom `currencies`
 * prop to CurrencyInput.
 *
 * Each entry carries:
 *   - `code`     ISO 4217 alpha-3 code (the canonical key, e.g. "USD")
 *   - `name`     English currency name (display in the picker)
 *   - `symbol`   Display glyph (`$`, `€`, `¥`, `kr`, …)
 *   - `decimals` Standard decimal places (USD/EUR → 2, JPY/KRW → 0,
 *                BHD/KWD → 3). Drives Intl.NumberFormat output and
 *                the input's mask precision.
 *
 * Symbol vs. code rendering convention: the picker shows the symbol
 * inline with the code (e.g. `$ USD`); this lets users disambiguate
 * `$` (which spans USD, CAD, AUD, MXN, etc.) at a glance without
 * needing a flag.
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const CURATED_CURRENCIES: Currency[] = [
  // ── Tier-1 majors ──
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
  // ── Other G10 / common B2B ──
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimals: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimals: 2 },
  // ── Asia-Pacific ──
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2 },
  // ── Other regions ──
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimals: 2 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', decimals: 2 },
];

const BY_CODE = new Map(CURATED_CURRENCIES.map((c) => [c.code, c]));

/** Lookup helper for components that need a currency by its ISO code. */
export function findCurrency(
  code: string,
  list: Currency[] = CURATED_CURRENCIES,
): Currency | undefined {
  if (list === CURATED_CURRENCIES) return BY_CODE.get(code);
  return list.find((c) => c.code === code);
}
