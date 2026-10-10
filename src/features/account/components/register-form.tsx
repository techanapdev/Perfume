'use client';

import {useTranslations} from 'next-intl';
import {useActionState} from 'react';
import {Button} from '@/shared/ui/button';
import {signUp, type AuthState} from '../actions';
import {AuthField} from './auth-field';
import {AuthMessage} from './auth-message';
import {ResendConfirmationForm} from './resend-confirmation-form';

const initialState: AuthState = {code: null};

export function RegisterForm() {
  const t = useTranslations('common.auth');
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  if (state.code === 'checkEmail') {
    return (
      <div className="space-y-5">
        <AuthMessage tone="info" text={t('checkEmail')} />
        <ResendConfirmationForm defaultEmail={state.email} />
      </div>
    );
  }
  return (
    <form action={formAction} className="space-y-5">
      <AuthField id="email" label={t('email')} type="email" autoComplete="email" />
      <AuthField
        id="password"
        label={t('password')}
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
      />
      <AuthField
        id="confirmPassword"
        label={t('confirmPassword')}
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
      />
      <AuthMessage tone="error" text={state.code ? t(`errors.${state.code}`) : null} />
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t('registering') : t('register')}
      </Button>
    </form>
  );
}
