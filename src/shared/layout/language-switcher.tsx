'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  return <nav aria-label={t('language')} className="flex items-center gap-3 text-xs tracking-wide">
    {(['th', 'en'] as const).map(value => <Link key={value} href={pathname} locale={value} aria-current={locale === value ? 'page' : undefined} className={locale === value ? 'underline underline-offset-4' : 'text-muted-foreground'}>{value.toUpperCase()}</Link>)}
  </nav>;
}
