'use client';

import type {ComponentProps} from 'react';
import {DialogContent} from './dialog';

export {Dialog as Sheet, DialogTrigger as SheetTrigger, DialogTitle as SheetTitle, DialogDescription as SheetDescription, DialogClose as SheetClose} from './dialog';
export function SheetContent(props: Omit<ComponentProps<typeof DialogContent>, 'isSheet'>) {
  return <DialogContent {...props} isSheet />;
}
