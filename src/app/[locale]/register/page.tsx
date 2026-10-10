import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {RegisterForm} from '@/features/account/components/register-form';
import {isAppLocale} from '@/i18n/locales';
import {Link} from '@/i18n/navigation';

export default async function RegisterPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isAppLocale(locale)) notFound();
  const t = await getTranslations('common.auth');
  return (
    <section className="mx-auto w-full max-w-md space-y-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl">{t('registerTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('registerDescription')}</p>
      </header>
      <RegisterForm />
      <p className="text-sm">
        {t('hasAccount')}{' '}
        <Link href="/login" className="underline underline-offset-4">
          {t('signIn')}
        </Link>
      </p>
    </section>
  );
}
