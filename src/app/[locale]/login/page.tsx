import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {AuthMessage} from '@/features/account/components/auth-message';
import {LoginForm} from '@/features/account/components/login-form';
import {ResendConfirmationForm} from '@/features/account/components/resend-confirmation-form';
import {safeNextPath} from '@/features/account/redirect-target';
import {isAppLocale} from '@/i18n/locales';
import {Link} from '@/i18n/navigation';

type LoginPageProps = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{next?: string; error?: string}>;
};

export default async function LoginPage({params, searchParams}: LoginPageProps) {
  const {locale} = await params;
  if (!isAppLocale(locale)) notFound();
  const {next, error} = await searchParams;
  const t = await getTranslations('common.auth');
  return (
    <section className="mx-auto w-full max-w-md space-y-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl">{t('loginTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('loginDescription')}</p>
      </header>
      <AuthMessage tone="error" text={error === 'confirm' ? t('confirmFailed') : null} />
      <LoginForm locale={locale} next={safeNextPath(next) ?? ''} />
      <ResendConfirmationForm />
      <p className="text-sm">
        {t('noAccount')}{' '}
        <Link href="/register" className="underline underline-offset-4">
          {t('register')}
        </Link>
      </p>
    </section>
  );
}
