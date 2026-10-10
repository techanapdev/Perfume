import {getTranslations} from 'next-intl/server';
import {Button} from './button';
import {Badge} from './badge';
import {Card, CardHeader, CardTitle, CardContent} from './card';
import {Checkbox} from './checkbox';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from './dialog';
import {Label} from './label';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from './select';
import {Separator} from './separator';
import {Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription} from './sheet';
import {Skeleton} from './skeleton';
import {Table, TableHeader, TableBody, TableRow, TableHead, TableCell} from './table';
import {ButtonsSection} from './ui-kit-buttons';
import {DemoSection} from './ui-kit-demo-section';
import {FieldsSection} from './ui-kit-fields';
import {UiKitFoundations} from './ui-kit-foundations';

// Server Component: only ButtonsSection, FieldsSection and UiKitFoundations are client leaves.
// Every src/shared/ui component needs a demo here (enforced by pnpm check:foundation).
// Theme baseline and usage rules: src/shared/ui/README.md.
// Owner checklist (steps 1-17, Draft 1 at step 12): docs/perfume/design-system/design-system-onboarding.md.
export function UiKitPreview() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <PageHeader />
      <UiKitFoundations />
      <Separator />
      <ButtonsSection />
      <FieldsSection />
      <ChoicesSection />
      <OverlaysSection />
      <TableSection />
      <div className="grid gap-8 md:grid-cols-2">
        <CardSection />
        <SkeletonSection />
      </div>
    </div>
  );
}

const SECTIONS = [
  'foundations',
  'buttons',
  'fields',
  'choices',
  'overlays',
  'table',
  'card',
  'skeleton'
] as const;

async function PageHeader() {
  const t = await getTranslations('common.kit');

  return (
    <header className="space-y-4">
      <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
      <Badge>{t('reference.baseline')}</Badge>
      <p className="text-sm text-muted-foreground">{t('description')}</p>
      <nav aria-label={t('navLabel')}>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className="underline underline-offset-4">
                {id === 'foundations' ? t('reference.title') : t(id)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

async function ChoicesSection() {
  const t = await getTranslations('common.kit');

  return (
    <DemoSection
      id="choices"
      title={t('choices')}
      imports={{
        select: 'Select, SelectTrigger, SelectValue, SelectContent, SelectItem',
        checkbox: 'Checkbox'
      }}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="sample-select">{t('selectLabel')}</Label>
            <Select>
              <SelectTrigger id="sample-select">
                <SelectValue placeholder={t('selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">{t('optionOne')}</SelectItem>
                <SelectItem value="two">{t('optionTwo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-select">disabled</Label>
            <Select disabled>
              <SelectTrigger id="disabled-select">
                <SelectValue placeholder={t('selectPlaceholder')} />
              </SelectTrigger>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox id="sample-checkbox" />
            <Label htmlFor="sample-checkbox">{t('checkbox')}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="checked-checkbox" defaultChecked />
            <Label htmlFor="checked-checkbox">defaultChecked</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="disabled-checkbox" disabled />
            <Label htmlFor="disabled-checkbox">disabled</Label>
          </div>
        </div>
      </div>
    </DemoSection>
  );
}

// keep title, description and localized closeLabel; check keyboard and focus when changing.
async function OverlaysSection() {
  const t = await getTranslations('common.kit');
  const common = await getTranslations('common');

  return (
    <DemoSection
      id="overlays"
      title={t('overlays')}
      imports={{
        dialog: 'Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose',
        sheet: 'Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription'
      }}
    >
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{t('openDialog')}</Button>
          </DialogTrigger>
          <DialogContent closeLabel={common('close')}>
            <DialogTitle>{t('dialogTitle')}</DialogTitle>
            <DialogDescription>{t('dialogDescription')}</DialogDescription>
            <DialogClose asChild>
              <Button>{common('close')}</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">{t('openSheet')}</Button>
          </SheetTrigger>
          <SheetContent closeLabel={common('close')}>
            <SheetTitle>{t('sheetTitle')}</SheetTitle>
            <SheetDescription>{t('sheetDescription')}</SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </DemoSection>
  );
}

const TABLE_ROWS = ['Button', 'Input', 'Dialog', 'Sheet'];

// static demo data; no API integration belongs here.
async function TableSection() {
  const t = await getTranslations('common.kit');

  return (
    <DemoSection
      id="table"
      title={t('table')}
      imports={{
        table: 'Table, TableHeader, TableBody, TableRow, TableHead, TableCell',
        badge: 'Badge'
      }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('column')}</TableHead>
            <TableHead>{t('state')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TABLE_ROWS.map((name) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>
                <Badge>{t('ready')}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DemoSection>
  );
}

async function CardSection() {
  const t = await getTranslations('common.kit');

  return (
    <DemoSection
      id="card"
      title={t('card')}
      imports={{card: 'Card, CardHeader, CardTitle, CardContent'}}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('card')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{t('cardDescription')}</CardContent>
      </Card>
    </DemoSection>
  );
}

// skeletons show appearance only, not an actual request.
async function SkeletonSection() {
  const t = await getTranslations('common.kit');

  return (
    <DemoSection id="skeleton" title={t('skeleton')} imports={{skeleton: 'Skeleton'}}>
      <div className="space-y-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </DemoSection>
  );
}
