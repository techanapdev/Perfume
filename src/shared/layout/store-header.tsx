import {Sparkles} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {LanguageSwitcher} from './language-switcher';
import {StoreMenu} from './store-menu';
import {StoreNavigationLinks} from './store-navigation-links';
import {storeMainLinks, storeAccountLinks} from './store-navigation';

export async function StoreHeader() {
  const t = await getTranslations('common');
  const mainItems = storeMainLinks.map(({href, labelKey, prominent}) => ({
    href,
    label: t(labelKey),
    prominent
  }));
  const accountItems = storeAccountLinks.map(({href, labelKey, prominent}) => ({
    href,
    label: t(labelKey),
    prominent
  }));
  const mainLabel = t('navigation.primaryLabel');
  const accountLabel = t('navigation.accountLabel');

  return (
    <>
      <div className="border-b border-primary/20 bg-primary/5 py-2.5">
        <div className="site-container flex items-center justify-center gap-4 text-center text-primary sm:justify-between">
          <p className="flex min-w-0 items-center justify-center gap-2 text-eyebrow">
            <Sparkles className="size-3 shrink-0" aria-hidden="true" />
            THE ART OF PERSONAL FRAGRANCE
          </p>
          <span className="hidden text-label text-muted-foreground sm:block">{t('preview')}</span>
        </div>
      </div>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-lg">
        <div className="site-container grid min-h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 lg:gap-4">
          <div className="col-start-1 row-start-1 justify-self-start lg:hidden">
            <StoreMenu
              mainItems={mainItems}
              accountItems={accountItems}
              labels={{
                menu: t('menu'),
                close: t('close'),
                description: t('navigation.description'),
                main: mainLabel,
                account: accountLabel
              }}
            />
          </div>
          <Link
            href="/"
            aria-label={t('navigation.brandLabel')}
            className="col-start-2 row-start-1 w-fit justify-self-center font-display text-2xl tracking-wide text-foreground sm:text-3xl sm:tracking-widest lg:col-start-1 lg:justify-self-start"
          >
            PERFUME<span className="text-primary">.</span>
          </Link>
          <div className="col-start-2 row-start-1 hidden lg:block">
            <StoreNavigationLinks items={mainItems} label={mainLabel} />
          </div>
          <div className="col-start-3 row-start-1 flex items-center justify-self-end lg:gap-3">
            <LanguageSwitcher />
            <div className="hidden border-l pl-3 lg:block">
              <StoreNavigationLinks items={accountItems} label={accountLabel} variant="account" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
