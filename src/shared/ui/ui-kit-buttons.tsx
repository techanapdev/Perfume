'use client';

import type {ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {toast} from 'sonner';
import {LoaderCircle, Plus} from 'lucide-react';
import {Button} from './button';
import {DemoSection} from './ui-kit-demo-section';

// Client only because the default sample calls toast; the other samples need no JS.
// Labels are the literal prop values so the sample maps 1:1 to code.
export function ButtonsSection() {
  const t = useTranslations('common.kit');

  return (
    <DemoSection id="buttons" title={t('buttons')} imports={{button: 'Button'}}>
      <PropRow name="variant">
        <Button onClick={() => toast(t('success'))}>default</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="outline">outline</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="link">link</Button>
      </PropRow>
      <PropRow name="size">
        <Button size="sm">sm</Button>
        <Button>default</Button>
        <Button size="lg">lg</Button>
        {/* Icon-only buttons need a localized accessible name. */}
        <Button size="icon" aria-label={t('iconLabel')}>
          <Plus className="size-4" aria-hidden="true" />
        </Button>
      </PropRow>
      <PropRow name="state">
        <Button disabled>disabled</Button>
        {/* No loading prop: disabled + aria-busy + icon. */}
        <Button disabled aria-busy="true" variant="outline">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          disabled aria-busy
        </Button>
      </PropRow>
    </DemoSection>
  );
}

function PropRow({name, children}: {name: string; children: ReactNode}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <code className="w-16 text-xs text-muted-foreground">{name}</code>
      {children}
    </div>
  );
}
