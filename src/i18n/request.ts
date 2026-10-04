import {locale as getRootLocale} from 'next/root-params';
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {isAppLocale} from './locales';

export default getRequestConfig(async ({locale: overrideLocale}) => {
  const candidate = overrideLocale ?? await getRootLocale() ?? 'th';
  if (!isAppLocale(candidate)) notFound();
  const [common, content] = await Promise.all([
    import(`../../messages/${candidate}/common.json`),
    import(`../../messages/${candidate}/content.json`)
  ]);
  return {locale: candidate, messages: {common: common.default, content: content.default}};
});
