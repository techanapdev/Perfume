import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {isAppLocale} from '@/i18n/locales';
import {StoreShell} from '@/shared/layout/store-shell';
import {Toaster} from '@/shared/ui/sonner';
import '../globals.css';

export const metadata: Metadata = {
  title: {default: 'Perfume — The Fragrance Atelier', template: '%s | Perfume'},
  description:
    'A world of fragrance, memory and individuality. Explore the Gold & Noir store design preview.'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!isAppLocale(locale)) notFound();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <StoreShell>{children}</StoreShell>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
