import type {ReactNode} from 'react';
import Image from 'next/image';
import {ArrowLeft, Sparkle} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

type AuthPageShellProps = {mode: 'login' | 'register'; children: ReactNode};

export async function AuthPageShell({mode, children}: AuthPageShellProps) {
  const t = await getTranslations('common.auth');

  return (
    <section className="site-container py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-label text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('backToStore')}
        </Link>
        <div className="grid overflow-hidden rounded-lg border bg-card lg:grid-cols-2">
          <aside className="relative isolate hidden min-h-144 flex-col justify-end overflow-hidden border-r p-10 lg:flex xl:p-14">
            <Image
              src="/images/perfume-gold-hero.webp"
              alt=""
              fill
              sizes="(min-width: 1024px) 560px, 0px"
              className="-z-20 object-cover object-right"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/15" />
            <Sparkle className="mb-7 size-8 text-primary" aria-hidden="true" />
            <p className="mb-5 text-eyebrow text-primary">THE FRAGRANCE ATELIER</p>
            <p className="text-heading whitespace-pre-line">{t('visualTitle')}</p>
            <p className="mt-5 max-w-sm text-body text-muted-foreground">
              {t('visualDescription')}
            </p>
            <p className="mt-12 border-t border-primary/30 pt-5 font-display text-2xl tracking-widest text-primary">
              PERFUME.
            </p>
          </aside>
          <div className="min-w-0 p-5 sm:p-9 lg:p-10 xl:p-12">
            <nav aria-label={t('accessLabel')} className="mb-8 grid grid-cols-2 border-b">
              {(['login', 'register'] as const).map((value) => (
                <Link
                  key={value}
                  href={value === 'login' ? '/login' : '/register'}
                  aria-current={mode === value ? 'page' : undefined}
                  className={
                    mode === value
                      ? 'border-b-2 border-primary px-2 py-4 text-center text-label text-primary'
                      : 'border-b-2 border-transparent px-2 py-4 text-center text-label text-muted-foreground transition-colors hover:text-foreground'
                  }
                >
                  {t(value === 'login' ? 'signIn' : 'register')}
                </Link>
              ))}
            </nav>
            <header className="mb-8 space-y-3">
              <p className="text-eyebrow text-primary">{t('eyebrow')}</p>
              <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
                {t(mode === 'login' ? 'loginTitle' : 'registerTitle')}
              </h1>
              <p className="text-sm leading-7 text-muted-foreground">
                {t(mode === 'login' ? 'loginDescription' : 'registerDescription')}
              </p>
            </header>
            <div className="space-y-7">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
