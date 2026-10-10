import createMiddleware from 'next-intl/middleware';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from './i18n/routing';
import {applyRefreshedSession, refreshSupabaseSession} from './shared/lib/supabase/refresh-session';

const handleLocale = createMiddleware(routing);

// Refresh first: next-intl forwards request headers, so cookies must be fresh before it runs.
// /admin has no locale prefix and must bypass next-intl (it would rewrite to /th/admin).
// This only refreshes the session; authorization lives in requireStaff().
export default async function proxy(request: NextRequest) {
  const refreshed = await refreshSupabaseSession(request);
  const isAdmin =
    request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/');
  const response = isAdmin ? NextResponse.next({request}) : handleLocale(request);
  return applyRefreshedSession(response, refreshed);
}
export const config = {matcher: ['/', '/(th|en)/:path*', '/admin/:path*']};
