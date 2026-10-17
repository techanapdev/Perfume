import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {AuthPageShell} from './auth-page-shell';
import {RegisterForm} from './register-form';

export async function RegisterScreen() {
  const t = await getTranslations('common.auth');

  return (
    <AuthPageShell mode="register">
      <RegisterForm />
      <p className="text-center text-sm leading-7 text-muted-foreground">
        {t('hasAccount')}{' '}
        <Link href="/login" className="text-primary underline underline-offset-4">
          {t('signIn')}
        </Link>
      </p>
    </AuthPageShell>
  );
}
