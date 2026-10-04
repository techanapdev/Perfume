import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {StoreMenu} from './store-menu';
import {LanguageSwitcher} from './language-switcher';

export async function StoreShell({children}: {children: React.ReactNode}) {
  const t = await getTranslations('common');
  return <>
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4">{t('skip')}</a>
    <header className="grid min-h-24 grid-cols-[1fr_auto_1fr] items-center border-b px-4 md:px-10">
      <StoreMenu labels={{menu: t('menu'), close: t('close'), description: t('menuDescription'), home: t('home'), uiKit: t('uiKit'), catalog: t('catalog'), custom: t('custom'), notReady: t('notReady')}} />
      <Link href="/" className="text-2xl font-medium tracking-[0.14em] uppercase sm:text-3xl">Perfume</Link>
      <div className="justify-self-end"><LanguageSwitcher /></div>
    </header>
    <main id="main-content">{children}</main>
    <footer className="mt-16 flex flex-col items-center gap-6 border-t px-6 py-14 text-center">
      <p className="text-xl tracking-[0.14em] uppercase">Perfume</p>
      <p className="text-sm text-muted-foreground">{t('footer')}</p>
      <Link href="/ui-kit" className="text-xs underline underline-offset-4">{t('uiKit')}</Link>
      <p className="text-xs text-muted-foreground">{t('baseline')}</p>
    </footer>
  </>;
}
