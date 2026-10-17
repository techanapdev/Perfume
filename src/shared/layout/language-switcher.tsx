'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');

  return (
    <nav aria-label={t('language')} className="flex min-h-11 items-center gap-1 text-xs">
      {(['th', 'en'] as const).map((value) => (
        <Link
          key={value}
          href={pathname}
          locale={value}
          aria-current={locale === value ? 'page' : undefined}
          className={
            locale === value
              ? 'flex min-h-11 min-w-9 items-center justify-center font-medium text-primary underline underline-offset-8'
              : 'flex min-h-11 min-w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
          }
        >
          {value.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
