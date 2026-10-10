const allowedPrefixes = ['/admin', '/th', '/en'];
const base = 'http://internal.invalid';

// Returns an internal path safe to redirect to after login, or null.
export function safeNextPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  if (
    !decoded.startsWith('/') ||
    decoded.startsWith('//') ||
    /[\u0000-\u001f\u007f\\]/.test(decoded)
  )
    return null;
  const url = new URL(decoded, base);
  if (url.origin !== base) return null;
  const isAllowed = allowedPrefixes.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)
  );
  return isAllowed ? `${url.pathname}${url.search}` : null;
}
