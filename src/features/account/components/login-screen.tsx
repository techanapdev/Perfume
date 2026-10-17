import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {safeNextPath} from '../redirect-target';
import {AuthPageShell} from './auth-page-shell';
import {AuthMessage} from './auth-message';
import {LoginForm} from './login-form';
import {ResendConfirmationForm} from './resend-confirmation-form';

export async function LoginScreen({
  locale,
  next,
  error
}: {
  locale: string;
  next?: string;
  error?: string;
}) {
  const t = await getTranslations('common.auth');

  return (
    <AuthPageShell mode="login">
      <AuthMessage tone="error" text={error === 'confirm' ? t('confirmFailed') : null} />
      <LoginForm locale={locale} next={safeNextPath(next) ?? ''} />
      <p className="text-center text-sm leading-7 text-muted-foreground">
        {t('noAccount')}{' '}
        <Link href="/register" className="text-primary underline underline-offset-4">
          {t('register')}
        </Link>
      </p>
      <details open={error === 'confirm'} className="border-t pt-4">
        <summary className="cursor-pointer py-3 text-sm text-muted-foreground marker:text-primary">
          {t('confirmationHelp')}
        </summary>
        <ResendConfirmationForm />
      </details>
    </AuthPageShell>
  );
}
