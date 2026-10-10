import {createServerClient, type CookieOptions} from '@supabase/ssr';
import type {NextRequest, NextResponse} from 'next/server';
import {getSupabaseConfig} from './config';

type RefreshedCookies = {
  cookies: {name: string; value: string; options: CookieOptions}[];
  headers: Record<string, string>;
};

const hasAuthCookie = (request: NextRequest) =>
  request.cookies.getAll().some(({name}) => name.startsWith('sb-') && name.includes('-auth-token'));

// Proxy-only. Writes refreshed tokens onto the request so later handlers read fresh cookies,
// and returns them to copy onto the outgoing response. Anonymous requests skip the network call.
export async function refreshSupabaseSession(request: NextRequest): Promise<RefreshedCookies> {
  const refreshed: RefreshedCookies = {cookies: [], headers: {}};
  if (!hasAuthCookie(request)) return refreshed;
  const {url, publishableKey} = getSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values, headers) => {
        for (const {name, value} of values) request.cookies.set(name, value);
        refreshed.cookies.push(...values);
        Object.assign(refreshed.headers, headers);
      }
    }
  });
  await supabase.auth.getClaims();
  return refreshed;
}

export function applyRefreshedSession(response: NextResponse, refreshed: RefreshedCookies) {
  for (const {name, value, options} of refreshed.cookies)
    response.cookies.set(name, value, options);
  for (const [key, value] of Object.entries(refreshed.headers)) response.headers.set(key, value);
  return response;
}
