import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {parseSupabaseConfig} from '../src/shared/lib/supabase/config.ts';
import {isAppLocale, locales} from '../src/i18n/locales.ts';

assert.equal(isAppLocale('th'), true);
assert.equal(isAppLocale('en'), true);
for (const invalid of ['fr', 'admin', '', undefined]) assert.equal(isAppLocale(invalid), false);

function messageKeys(value: unknown, prefix = ''): string[] {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value));
  return Object.entries(value).flatMap(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === 'string') { assert.ok(entry.trim(), path); return [path]; }
    return messageKeys(entry, path);
  }).sort();
}
const namespaces = readdirSync('messages/th').sort();
assert.deepEqual(readdirSync('messages/en').sort(), namespaces);
for (const namespace of namespaces) {
  const keys = locales.map(locale => messageKeys(JSON.parse(readFileSync(`messages/${locale}/${namespace}`, 'utf8'))));
  assert.deepEqual(keys[0], keys[1], `Locale mismatch: ${namespace}`);
}

for (const [url, key] of [[undefined, undefined], ['https://example.supabase.co', ''], ['', 'sb_publishable_fixture']]) {
  assert.throws(() => parseSupabaseConfig(url, key), /SUPABASE_NOT_CONFIGURED/);
}
for (const [url, key] of [
  ['invalid', 'sb_publishable_fixture'],
  ['http://remote.example', 'sb_publishable_fixture'],
  ['https://example.supabase.co', 'sb_secret_fixture'],
  ['https://example.supabase.co', 'eyJhbGci.fixture.service-role'],
  ['https://example.supabase.co', 'sb_publishable_'],
  ['https://user:password@example.supabase.co', 'sb_publishable_fixture']
]) assert.throws(() => parseSupabaseConfig(url, key), /SUPABASE_INVALID_CONFIG/);
assert.deepEqual(parseSupabaseConfig('https://example.supabase.co', 'sb_publishable_fixture'), {
  url: 'https://example.supabase.co', publishableKey: 'sb_publishable_fixture'
});
assert.equal(parseSupabaseConfig('http://localhost:54321', 'sb_publishable_fixture').url, 'http://localhost:54321');
const config = readFileSync('src/shared/lib/supabase/config.ts', 'utf8');
assert.ok(config.includes('process.env.NEXT_PUBLIC_SUPABASE_URL'));
assert.ok(config.includes('process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'));
assert.equal(existsSync('src/app/layout.tsx'), false, 'Keep store and admin root layouts separate');
assert.ok(readFileSync('src/proxy.ts', 'utf8').includes("matcher: ['/', '/(th|en)/:path*']"));
assert.ok(readFileSync('.gitignore', 'utf8').includes('!.env.example'));

function checkShared(directory: string) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) checkShared(path);
    else if (/\.tsx?$/.test(entry.name)) {
      const code = readFileSync(path, 'utf8');
      assert.ok(!code.includes('@/features/'), `Feature import in shared: ${path}`);
      if (path.includes('/ui/')) {
        for (const forbidden of ['supabase', 'resend', '@/features/payments']) assert.ok(!code.includes(forbidden), `Provider import in shared UI: ${path}`);
      }
    }
  }
}
checkShared('src/shared');
console.log('Foundation assertions passed: locales, namespaces, public env guards, roots, matcher and shared boundaries.');
