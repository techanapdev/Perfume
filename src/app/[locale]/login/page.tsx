import {notFound} from 'next/navigation';
import {LoginScreen} from '@/features/account/components/login-screen';
import {isAppLocale} from '@/i18n/locales';

type LoginPageProps = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{next?: string; error?: string}>;
};

export default async function LoginPage({params, searchParams}: LoginPageProps) {
  const {locale} = await params;
  if (!isAppLocale(locale)) notFound();
  const {next, error} = await searchParams;
  return <LoginScreen locale={locale} next={next} error={error} />;
}
