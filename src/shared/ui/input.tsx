import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export function Input({className, ...props}: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex min-h-12 w-full rounded-sm border bg-card px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}
