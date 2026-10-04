'use client';

import {Menu} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {Button} from '@/shared/ui/button';
import {Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose} from '@/shared/ui/sheet';

export function StoreMenu({labels}: {labels: {menu: string; close: string; description: string; home: string; uiKit: string; catalog: string; custom: string; notReady: string}}) {
  return <Sheet>
    <SheetTrigger asChild><Button variant="ghost" className="gap-2" aria-label={labels.menu}><Menu className="size-5" aria-hidden="true" /><span className="hidden sm:inline">{labels.menu}</span></Button></SheetTrigger>
    <SheetContent closeLabel={labels.close}>
      <SheetTitle>{labels.menu}</SheetTitle><SheetDescription>{labels.description}</SheetDescription>
      <nav className="flex flex-col gap-3">
        <SheetClose asChild><Link href="/" className="py-3">{labels.home}</Link></SheetClose>
        <SheetClose asChild><Link href="/ui-kit" className="py-3">{labels.uiKit}</Link></SheetClose>
        <Button disabled variant="ghost" className="justify-start" title={labels.notReady}>{labels.catalog}</Button>
        <Button disabled variant="ghost" className="justify-start" title={labels.notReady}>{labels.custom}</Button>
      </nav>
    </SheetContent>
  </Sheet>;
}
