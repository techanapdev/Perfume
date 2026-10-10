'use client';

import {useTranslations} from 'next-intl';
import {useActionState} from 'react';
import {Button} from '@/shared/ui/button';
import {resendConfirmation, type AuthState} from '../actions';
import {AuthField} from './auth-field';
import {AuthMessage} from './auth-message';

const initialState: AuthState = {code: null};

export function ResendConfirmationForm({defaultEmail}: {defaultEmail?: string}) {
  const t = useTranslations('common.auth');
  const [state, formAction, isPending] = useActionState(resendConfirmation, initialState);
  return (
    <form action={formAction} className="space-y-4 border-t pt-6">
      <p className="text-sm font-medium">{t('resendTitle')}</p>
      <AuthField
        id="resendEmail"
        name="email"
        label={t('email')}
        type="email"
        autoComplete="email"
        defaultValue={defaultEmail}
      />
      <AuthMessage
        tone={state.code === 'resent' ? 'info' : 'error'}
        text={
          state.code ? t(state.code === 'resent' ? 'resendDone' : `errors.${state.code}`) : null
        }
      />
      <Button type="submit" variant="outline" disabled={isPending} className="w-full">
        {t('resend')}
      </Button>
    </form>
  );
}
