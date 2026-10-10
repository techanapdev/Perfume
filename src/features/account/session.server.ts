import 'server-only';

import type {SupabaseClient} from '@supabase/supabase-js';
import {notFound, redirect} from 'next/navigation';
import {connection} from 'next/server';
import {createServerSupabaseClient} from '@/shared/lib/supabase/server';

export async function isActiveStaff(supabase: SupabaseClient) {
  const {data, error} = await supabase.rpc('is_active_staff');
  return !error && data === true;
}

// Call from every admin page, Server Action and route handler. Layouts must not gate access.
export async function requireStaff(returnTo: `/admin${string}`) {
  await connection(); // per-request: never prerender an admin page
  const supabase = await createServerSupabaseClient();
  const {data} = await supabase.auth.getUser();
  if (!data.user) redirect(`/th/login?next=${encodeURIComponent(returnTo)}`);
  if (!(await isActiveStaff(supabase))) notFound();
  return data.user;
}
