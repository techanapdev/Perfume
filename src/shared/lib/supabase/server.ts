import 'server-only';

import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {getSupabaseConfig} from './config';

export async function createServerSupabaseClient(cookieMode: 'read-only' | 'writable' = 'read-only') {
  const {url, publishableKey} = getSupabaseConfig();
  const cookieStore = await cookies();
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      ...(cookieMode === 'writable' ? {
        setAll: (values: {name: string; value: string; options: import('@supabase/ssr').CookieOptions}[]) => {
          for (const {name, value, options} of values) cookieStore.set(name, value, options);
        }
      } : {})
    }
  });
}
