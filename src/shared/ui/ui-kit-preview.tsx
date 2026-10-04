'use client';

import {useTranslations} from 'next-intl';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {toast} from 'sonner';
import {LoaderCircle} from 'lucide-react';
import {Button} from './button';
import {Input} from './input';
import {Label} from './label';
import {Badge} from './badge';
import {Card, CardHeader, CardTitle, CardContent} from './card';
import {Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose} from './dialog';
import {Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription} from './sheet';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from './select';
import {Checkbox} from './checkbox';
import {Table, TableHeader, TableBody, TableRow, TableHead, TableCell} from './table';
import {Skeleton} from './skeleton';
import {Separator} from './separator';

export function UiKitPreview() {
  const t = useTranslations('common.kit');
  const common = useTranslations('common');
  const schema = z.object({
    name: z.string().trim().min(2, t('nameError')),
    email: z.email(t('emailError'))
  });
  const {register, handleSubmit, reset, formState: {errors}} = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema), defaultValues: {name: '', email: ''}
  });
  return <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
    <header className="space-y-4"><Badge>{common('uiKit')}</Badge><h1 className="text-3xl sm:text-4xl">{t('title')}</h1><p className="text-sm text-muted-foreground">{t('description')}</p></header>
    <section className="space-y-5"><h2 className="text-xl">{t('buttons')}</h2>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => toast(t('success'))}>{t('primary')}</Button>
        <Button variant="secondary" onClick={() => toast(t('success'))}>{t('secondary')}</Button>
        <Button disabled>{t('disabled')}</Button>
        <Button disabled aria-busy="true" variant="outline"><LoaderCircle className="size-4 animate-spin" aria-hidden="true" />{t('loading')}</Button>
      </div>
    </section>
    <Separator />
    <div className="grid gap-8 md:grid-cols-2">
      <Card><CardHeader><CardTitle>{t('fields')}</CardTitle><p className="text-sm text-muted-foreground">{t('localOnly')}</p></CardHeader><CardContent>
        <form noValidate onSubmit={handleSubmit(() => {toast.success(t('success')); reset();})} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="sample-name">{t('name')}</Label>
            <Input id="sample-name" placeholder={t('namePlaceholder')} {...register('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'sample-name-error' : undefined} />
            {errors.name && <p id="sample-name-error" role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2"><Label htmlFor="sample-email">{t('email')}</Label>
            <Input id="sample-email" type="email" {...register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'sample-email-error' : undefined} />
            {errors.email && <p id="sample-email-error" role="alert" className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit">{t('submit')}</Button>
        </form>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>{t('choices')}</CardTitle></CardHeader><CardContent className="space-y-6">
        <div className="space-y-2"><Label htmlFor="sample-select">{t('selectLabel')}</Label>
          <Select><SelectTrigger id="sample-select"><SelectValue placeholder={t('selectPlaceholder')} /></SelectTrigger>
            <SelectContent><SelectItem value="one">{t('optionOne')}</SelectItem><SelectItem value="two">{t('optionTwo')}</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3"><Checkbox id="sample-checkbox" /><Label htmlFor="sample-checkbox">{t('checkbox')}</Label></div>
        <div className="space-y-2"><Label htmlFor="error-input">{t('errorExample')}</Label><Input id="error-input" aria-invalid="true" aria-describedby="error-input-help" defaultValue="Example" /><p id="error-input-help" className="text-sm text-destructive">{t('errorHelp')}</p></div>
        <Input disabled aria-label={t('disabled')} placeholder={t('disabled')} />
      </CardContent></Card>
    </div>
    <section className="space-y-5"><h2 className="text-xl">{t('overlays')}</h2><div className="flex flex-wrap gap-3">
      <Dialog><DialogTrigger asChild><Button variant="outline">{t('openDialog')}</Button></DialogTrigger>
        <DialogContent closeLabel={common('close')}><DialogTitle>{t('dialogTitle')}</DialogTitle><DialogDescription>{t('dialogDescription')}</DialogDescription><DialogClose asChild><Button>{common('close')}</Button></DialogClose></DialogContent>
      </Dialog>
      <Sheet><SheetTrigger asChild><Button variant="outline">{t('openSheet')}</Button></SheetTrigger>
        <SheetContent closeLabel={common('close')}><SheetTitle>{t('sheetTitle')}</SheetTitle><SheetDescription>{t('sheetDescription')}</SheetDescription></SheetContent>
      </Sheet>
    </div></section>
    <Card><CardHeader><CardTitle>{t('table')}</CardTitle></CardHeader><CardContent>
      <Table><TableHeader><TableRow><TableHead>{t('column')}</TableHead><TableHead>{t('state')}</TableHead></TableRow></TableHeader>
        <TableBody>{['Button', 'Input', 'Dialog', 'Sheet'].map(name => <TableRow key={name}><TableCell>{name}</TableCell><TableCell><Badge>{t('ready')}</Badge></TableCell></TableRow>)}</TableBody>
      </Table>
    </CardContent></Card>
    <div className="grid gap-8 md:grid-cols-2">
      <Card><CardHeader><CardTitle>{t('card')}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{t('cardDescription')}</CardContent></Card>
      <section aria-label={t('skeleton')} className="space-y-3"><h2 className="text-xl">{t('skeleton')}</h2><Skeleton className="h-28 w-full" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></section>
    </div>
  </div>;
}
