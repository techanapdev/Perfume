import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {
  isStoreLinkActive,
  storeAccountLinks,
  storeMainLinks
} from '../src/shared/layout/store-navigation.ts';

for (const [pathname, href, expected] of [
  ['/', '/', true],
  ['/login', '/', false],
  ['/customize', '/customize', true],
  ['/customize/', '/customize', true],
  ['/customize/review', '/customize', true],
  ['/customize-extra', '/customize', false],
  ['/login', '/login', true],
  ['/register', '/login', false],
  ['/', '/#collection', false],
  ['/customize', '/#collection', false]
] as const) {
  assert.equal(isStoreLinkActive(pathname, href), expected, `${pathname} → ${href}`);
}

const links = [...storeMainLinks, ...storeAccountLinks];
assert.equal(new Set(links.map(({href}) => href)).size, links.length);

for (const {href, labelKey} of links) {
  assert.ok(href.startsWith('/') && !href.startsWith('//'), `Internal link required: ${href}`);
  const [pathname, anchor] = href.split('#');
  const route = pathname === '/' ? '' : pathname;
  assert.ok(existsSync(`src/app/[locale]${route}/page.tsx`), `Missing route: ${href}`);
  if (anchor) {
    const landing = readFileSync('src/features/content/components/landing-preview.tsx', 'utf8');
    assert.ok(landing.includes(`id="${anchor}"`), `Missing landing anchor: ${href}`);
  }
  for (const locale of ['th', 'en']) {
    let value: unknown = JSON.parse(readFileSync(`messages/${locale}/common.json`, 'utf8'));
    for (const key of labelKey.split('.')) {
      assert.ok(value && typeof value === 'object' && !Array.isArray(value));
      value = (value as Record<string, unknown>)[key];
    }
    assert.ok(typeof value === 'string' && value.trim(), `Missing ${locale} label: ${labelKey}`);
  }
}

console.log(
  'Store navigation assertions passed: active pages, route boundaries, destinations, anchors and bilingual labels.'
);
