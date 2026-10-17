'use client';

import * as Primitive from '@radix-ui/react-dialog';
import {X} from 'lucide-react';
import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;
export function DialogTitle({className, ...props}: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={cn('text-xl font-medium', className)} {...props} />;
}
export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      className={cn('text-sm leading-7 text-muted-foreground', className)}
      {...props}
    />
  );
}
export function DialogContent({
  children,
  className,
  closeLabel,
  isSheet = false,
  ...props
}: ComponentProps<typeof Primitive.Content> & {closeLabel: string; isSheet?: boolean}) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 z-40 bg-overlay/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <Primitive.Content
        className={cn(
          'fixed z-50 grid gap-5 bg-background p-8 shadow-xl',
          isSheet
            ? 'inset-y-0 left-0 w-[min(90vw,24rem)] overflow-y-auto'
            : 'top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border',
          className
        )}
        {...props}
      >
        {children}
        <Primitive.Close
          aria-label={closeLabel}
          className="absolute top-4 right-4 rounded-md p-2 hover:bg-secondary"
        >
          <X className="size-5" aria-hidden="true" />
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  );
}
