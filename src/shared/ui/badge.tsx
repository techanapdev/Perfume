import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export function Badge({className, ...props}: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-label text-primary',
        className
      )}
      {...props}
    />
  );
}
