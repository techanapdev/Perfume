import {MoveUpRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {StoreHeader} from './store-header';

export async function StoreShell({children}: {children: React.ReactNode}) {
  const t = await getTranslations('common');

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-primary focus:p-4 focus:text-primary-foreground"
      >
        {t('skip')}
      </a>
      <StoreHeader />
      <main id="main-content">{children}</main>
      <StoreFooter />
    </>
  );
}

async function StoreFooter() {
  const t = await getTranslations('common');

  return (
    <footer className="border-t pt-14 pb-8">
      <div className="site-container text-center">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="space-y-3">
            <p className="text-eyebrow text-primary">A SCENT. A STORY. A SIGNATURE.</p>
            <p className="text-body text-muted-foreground">{t('footer')}</p>
          </div>
          <Link
            href="/ui-kit"
            className="flex w-fit items-center gap-3 border-b border-primary/50 pb-2 text-label text-primary transition-colors hover:text-foreground"
          >
            {t('uiKit')}
            <MoveUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <p
          aria-hidden="true"
          className="my-10 border-b pb-8 text-center font-display text-heading tracking-widest text-primary/65 sm:text-8xl lg:text-9xl"
        >
          PERFUME.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs leading-6 text-muted-foreground">
          <p>PERFUME · THE FRAGRANCE ATELIER</p>
          <p>{t('baseline')}</p>
        </div>
      </div>
    </footer>
  );
}
