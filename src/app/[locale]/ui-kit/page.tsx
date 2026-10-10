import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {UiKitPreview} from '@/shared/ui/ui-kit-preview';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('common');
  return {title: t('uiKit')};
}

export default function UiKitPage() {
  return <UiKitPreview />;
}
