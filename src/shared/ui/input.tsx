import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export function Input({className, ...props}: ComponentProps<'input'>) {
  return <input className={cn('flex min-h-11 w-full rounded-md border bg-background px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive', className)} {...props} />;
}
