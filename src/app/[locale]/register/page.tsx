import {notFound} from 'next/navigation';
import {RegisterScreen} from '@/features/account/components/register-screen';
import {isAppLocale} from '@/i18n/locales';

export default async function RegisterPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isAppLocale(locale)) notFound();
  return <RegisterScreen />;
}
