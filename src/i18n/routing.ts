import {defineRouting} from 'next-intl/routing';
import {locales} from './locales';

export const routing = defineRouting({
  locales,
  defaultLocale: 'th',
  localePrefix: 'always',
  localeDetection: false
});
