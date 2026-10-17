'use client';

import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {cn} from '@/shared/lib/cn';
import {Input} from './input';
import {Button} from './button';
import {Card, CardContent, CardHeader, CardTitle} from './card';

const COLORS = [
  {name: 'background', token: '--background', sample: 'bg-background', usage: 'bg-background'},
  {name: 'foreground', token: '--foreground', sample: 'bg-foreground', usage: 'text-foreground'},
  {name: 'card', token: '--card', sample: 'bg-card', usage: 'bg-card text-card-foreground'},
  {
    name: 'primary',
    token: '--primary',
    sample: 'bg-primary',
    usage: 'bg-primary text-primary-foreground'
  },
  {
    name: 'primaryForeground',
    token: '--primary-foreground',
    sample: 'bg-primary-foreground',
    usage: 'text-primary-foreground'
  },
  {
    name: 'secondary',
    token: '--secondary',
    sample: 'bg-secondary',
    usage: 'bg-secondary text-secondary-foreground'
  },
  {name: 'muted', token: '--muted', sample: 'bg-muted', usage: 'bg-muted'},
  {
    name: 'mutedForeground',
    token: '--muted-foreground',
    sample: 'bg-muted-foreground',
    usage: 'text-muted-foreground'
  },
  {
    name: 'border',
    token: '--border',
    sample: 'border-4 border-border bg-background',
    usage: 'border-border'
  },
  {
    name: 'destructive',
    token: '--destructive',
    sample: 'bg-destructive',
    usage: 'text-destructive'
  },
  // No component uses ring-ring; focus comes from the global :focus-visible rule in globals.css.
  {name: 'ring', token: '--ring', sample: 'bg-ring', usage: ':focus-visible (global, automatic)'}
];

type SampleProps = {
  'data-reference': string;
  'data-properties': string;
  children: string;
};

// Component-backed samples render the real component, so measured values follow its source.
const TYPE_SAMPLES: {role: string; source: string; Sample: (props: SampleProps) => ReactNode}[] = [
  {role: 'caption', source: 'text-xs', Sample: (props) => <p className="text-xs" {...props} />},
  {role: 'button', source: '<Button>', Sample: (props) => <Button {...props} />},
  {
    role: 'body',
    source: '<Input>',
    Sample: ({children, ...props}) => (
      <Input readOnly defaultValue={children} aria-label={children} {...props} />
    )
  },
  {
    role: 'cardTitle',
    source: '<CardTitle>',
    Sample: (props) => <CardTitle role="presentation" {...props} />
  },
  {role: 'title', source: 'text-3xl', Sample: (props) => <p className="text-3xl" {...props} />},
  {
    role: 'largeTitle',
    source: 'sm:text-4xl',
    Sample: (props) => <p className="text-4xl" {...props} />
  }
];

const LAYOUT_SAMPLES = [
  {classes: 'gap-2', property: 'column-gap', role: 'iconGap'},
  {classes: 'gap-4', property: 'column-gap', role: 'fieldGap'},
  {classes: 'p-6', property: 'padding-top', role: 'cardPadding'},
  {classes: 'rounded-sm', property: 'border-radius', role: 'controlRadius'},
  {classes: 'rounded-lg', property: 'border-radius', role: 'cardRadius'}
];

type Readings = Record<string, string>;

// show current CSS values without copying theme values into this file.
// Refresh after CSS edits; font-family reports the stack, not the font used for every glyph.
export function UiKitFoundations() {
  const t = useTranslations('common.kit.reference');
  const rootRef = useRef<HTMLDivElement>(null);
  const [readings, setReadings] = useState<Readings>({});
  const readValues = useCallback(() => {
    const next: Readings = {};
    for (const node of rootRef.current?.querySelectorAll<HTMLElement>('[data-reference]') ?? []) {
      const style = getComputedStyle(node);
      const properties = node.dataset.properties?.split(',') ?? [];
      next[node.dataset.reference ?? ''] = properties
        .map((property) => style.getPropertyValue(property).trim())
        .join(' / ');
    }
    setReadings(next);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(readValues);
    window.addEventListener('resize', readValues);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', readValues);
    };
  }, [readValues]);

  return (
    <div ref={rootRef} id="foundations" className="scroll-mt-8 space-y-8">
      <section className="space-y-4 rounded-lg border bg-muted p-6">
        <h2 className="text-xl font-medium">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <p className="text-sm">{t('valuesNote')}</p>
        <Button variant="outline" size="sm" onClick={readValues}>
          {t('refresh')}
        </Button>
      </section>
      <ColorsSection readings={readings} />
      <TypographySection readings={readings} />
      <LayoutSection readings={readings} />
      <UsageSection />
    </div>
  );
}

function ColorsSection({readings}: {readings: Readings}) {
  const t = useTranslations('common.kit.reference');
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-medium">{t('colorsTitle')}</h2>
      <p className="text-sm text-muted-foreground">{t('colorsNote')}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLORS.map((color) => (
          <li key={color.token} className="overflow-hidden rounded-lg border">
            <div
              className={cn('h-16 border-b', color.sample)}
              data-reference={color.token}
              data-properties={color.token}
              aria-hidden="true"
            />
            <div className="space-y-2 p-4">
              <p className="font-medium">{t(`colors.${color.name}`)}</p>
              <code className="block break-all text-sm">{color.token}</code>
              <code className="block break-all text-sm">
                {readings[color.token] ?? t('pending')}
              </code>
              <code className="block break-all text-xs text-muted-foreground">{color.usage}</code>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TypographySection({readings}: {readings: Readings}) {
  const t = useTranslations('common.kit.reference');
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-medium">{t('typographyTitle')}</h2>
      <div className="space-y-2 rounded-lg border p-4">
        <p data-reference="font-family" data-properties="font-family">
          {t('fontFamily')}
        </p>
        <code className="block break-all text-sm">{readings['font-family'] ?? t('pending')}</code>
        <p className="text-sm text-muted-foreground">{t('fontNote')}</p>
      </div>
      <p className="text-sm text-muted-foreground">{t('typographyNote')}</p>
      <p className="text-sm">{t('metrics')}</p>
      <ul className="divide-y rounded-lg border">
        {TYPE_SAMPLES.map(({role, source, Sample}) => (
          <li key={role} className="space-y-3 break-words p-4">
            <p className="text-sm text-muted-foreground">{t(`roles.${role}`)}</p>
            <Sample data-reference={role} data-properties="font-size,font-weight,line-height">
              {t('sampleText')}
            </Sample>
            <code className="block text-sm">{source}</code>
            <code className="block text-xs text-muted-foreground">
              {readings[role] ?? t('pending')}
            </code>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">{t('proposedNote')}</p>
    </section>
  );
}

function LayoutSection({readings}: {readings: Readings}) {
  const t = useTranslations('common.kit.reference');
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-medium">{t('layoutTitle')}</h2>
      <p className="text-sm text-muted-foreground">{t('layoutNote')}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LAYOUT_SAMPLES.map((sample) => (
          <li key={sample.classes} className="space-y-3 rounded-lg border p-4">
            <p className="text-sm">{t(`layout.${sample.role}`)}</p>
            <div
              className={cn('inline-flex border bg-card', sample.classes)}
              data-reference={sample.classes}
              data-properties={sample.property}
              aria-hidden="true"
            >
              <span className="size-6 bg-secondary" />
              <span className="size-6 bg-primary" />
            </div>
            <code className="block text-sm">{sample.classes}</code>
            <code className="block text-xs text-muted-foreground">
              {readings[sample.classes] ?? t('pending')}
            </code>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UsageSection() {
  const t = useTranslations('common.kit.reference');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('usageTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
          <code>{`import {Button} from '@/shared/ui/button';
import {Card, CardContent} from '@/shared/ui/card';

<Card>
  <CardContent>
    <Button variant="outline" size="sm">...</Button>
  </CardContent>
</Card>`}</code>
        </pre>
        <p className="text-sm">{t('variantsNote')}</p>
        <code className="block break-words text-xs">
          variant: default | outline | secondary | ghost | link
        </code>
        <code className="block break-words text-xs">size: default | sm | lg | icon</code>
        <p className="text-sm">{t('statesNote')}</p>
        <p className="text-sm">{t('rulesNote')}</p>
        <p className="text-sm text-muted-foreground">{t('guideNote')}</p>
        <code className="block break-all text-xs">src/shared/ui/README.md</code>
      </CardContent>
    </Card>
  );
}
