export const locales = ['th', 'en'] as const;
export type AppLocale = (typeof locales)[number];
export function isAppLocale(value: unknown): value is AppLocale {
  return value === 'th' || value === 'en';
}
