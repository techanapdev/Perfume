import type {Metadata} from 'next';
import {UiKitPreview} from '@/shared/ui/ui-kit-preview';

export const metadata: Metadata = {title: 'UI reference'};
export default function UiKitPage() { return <UiKitPreview />; }
