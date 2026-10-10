import {redirect} from 'next/navigation';
import type {NextRequest} from 'next/server';
import {createServerSupabaseClient} from '@/shared/lib/supabase/server';

// token_hash flow (not PKCE) so the email link works on a different device than the sign-up.
// ponytail: lands on /th after confirming — carry the sign-up locale if EN customers need it.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type');
  if (tokenHash && (type === 'email' || type === 'signup')) {
    const supabase = await createServerSupabaseClient('writable');
    const {error} = await supabase.auth.verifyOtp({type, token_hash: tokenHash});
    if (!error) redirect('/th');
  }
  redirect('/th/login?error=confirm');
}
