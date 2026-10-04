export function parseSupabaseConfig(url: string | undefined, key: string | undefined) {
  if (!url?.trim() || !key?.trim()) {
    throw new Error('SUPABASE_NOT_CONFIGURED: Set the public URL and publishable key before calling a client factory.');
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('SUPABASE_INVALID_CONFIG: The public URL must be a valid URL.');
  }
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
  if ((parsed.protocol !== 'https:' && !(isLocal && parsed.protocol === 'http:')) ||
      parsed.username || parsed.password || parsed.search || parsed.hash ||
      !key.startsWith('sb_publishable_') || key.trim() !== key || key.length <= 15) {
    throw new Error('SUPABASE_INVALID_CONFIG: Use a public publishable key and HTTPS URL (HTTP is allowed only for localhost).');
  }
  return {url: parsed.origin, publishableKey: key};
}

export function getSupabaseConfig() {
  return parseSupabaseConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
