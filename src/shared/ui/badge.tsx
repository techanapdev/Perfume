import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export function Badge({className, ...props}: ComponentProps<'span'>) {
  return <span className={cn('inline-flex rounded-full border bg-secondary px-3 py-1 text-xs font-medium', className)} {...props} />;
}
