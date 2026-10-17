export type StoreNavigationItem = {
  href: string;
  label: string;
  prominent?: boolean;
};

export const storeMainLinks = [
  {href: '/', labelKey: 'navigation.home', prominent: false},
  {href: '/#collection', labelKey: 'navigation.collection', prominent: false},
  {href: '/customize', labelKey: 'navigation.customize', prominent: false}
] as const;

export const storeAccountLinks = [
  {href: '/login', labelKey: 'navigation.signIn', prominent: false},
  {href: '/register', labelKey: 'navigation.register', prominent: true}
] as const;

// Pathnames come from the locale-aware navigation adapter; anchors are locations, not pages.
export function isStoreLinkActive(pathname: string, href: string): boolean {
  if (href.includes('#')) return false;
  const current = pathname.replace(/\/+$/, '') || '/';
  return href === '/' ? current === '/' : current === href || current.startsWith(`${href}/`);
}
