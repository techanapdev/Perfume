'use client';

import {useTranslations} from 'next-intl';
import {useActionState} from 'react';
import {Button} from '@/shared/ui/button';
import {signIn, type AuthState} from '../actions';
import {AuthField} from './auth-field';
import {AuthMessage} from './auth-message';

const initialState: AuthState = {code: null};

export function LoginForm({locale, next}: {locale: string; next: string}) {
  const t = useTranslations('common.auth');
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="next" value={next} />
      <AuthField id="email" label={t('email')} type="email" autoComplete="email" />
      <AuthField
        id="password"
        label={t('password')}
        type="password"
        autoComplete="current-password"
      />
      <AuthMessage tone="error" text={state.code ? t(`errors.${state.code}`) : null} />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('signingIn') : t('signIn')}
      </Button>
    </form>
  );
}
