'use server';

import {redirect} from 'next/navigation';
import {isAppLocale} from '@/i18n/locales';
import {createServerSupabaseClient} from '@/shared/lib/supabase/server';
import {safeNextPath} from './redirect-target';
import {loginSchema, registerSchema, resendSchema} from './schemas';
import {isActiveStaff} from './session.server';

export type AuthState = {
  code:
    | 'credentials'
    | 'invalidEmail'
    | 'passwordTooShort'
    | 'passwordMismatch'
    | 'generic'
    | 'checkEmail'
    | 'resent'
    | null;
  email?: string;
};

const field = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
};

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: field(formData, 'email'),
    password: field(formData, 'password')
  });
  if (!parsed.success) return {code: 'credentials'};
  const supabase = await createServerSupabaseClient('writable');
  const {error} = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return {code: 'credentials'};
  const locale = field(formData, 'locale');
  const next = safeNextPath(field(formData, 'next'));
  redirect(
    next ?? ((await isActiveStaff(supabase)) ? '/admin' : `/${isAppLocale(locale) ? locale : 'th'}`)
  );
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    email: field(formData, 'email'),
    password: field(formData, 'password'),
    confirmPassword: field(formData, 'confirmPassword')
  });
  if (!parsed.success) {
    const path = parsed.error.issues[0]?.path[0];
    if (path === 'email') return {code: 'invalidEmail'};
    return {code: path === 'confirmPassword' ? 'passwordMismatch' : 'passwordTooShort'};
  }
  const supabase = await createServerSupabaseClient('writable');
  const {error} = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password
  });
  // An existing address returns an obfuscated user, so success looks identical either way.
  if (error && error.code !== 'user_already_exists') {
    return {code: error.code === 'weak_password' ? 'passwordTooShort' : 'generic'};
  }
  return {code: 'checkEmail', email: parsed.data.email};
}

// Same answer whether or not the account exists.
export async function resendConfirmation(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = resendSchema.safeParse({email: field(formData, 'email')});
  if (!parsed.success) return {code: 'invalidEmail'};
  const supabase = await createServerSupabaseClient('writable');
  await supabase.auth.resend({type: 'signup', email: parsed.data.email});
  return {code: 'resent', email: parsed.data.email};
}

export async function signOut() {
  const supabase = await createServerSupabaseClient('writable');
  await supabase.auth.signOut();
  redirect('/th/login');
}
