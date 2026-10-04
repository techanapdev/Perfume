'use client';

import * as Primitive from '@radix-ui/react-select';
import {Check, ChevronDown} from 'lucide-react';
import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export const Select = Primitive.Root;
export const SelectValue = Primitive.Value;
export function SelectTrigger({children, className, ...props}: ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Trigger className={cn('flex min-h-11 w-full items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50', className)} {...props}>
    {children}<Primitive.Icon><ChevronDown className="size-4" aria-hidden="true" /></Primitive.Icon>
  </Primitive.Trigger>;
}
export function SelectContent({children, className, ...props}: ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Portal><Primitive.Content position="popper" sideOffset={6} className={cn('z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-auto rounded-md border bg-popover p-1 shadow-lg', className)} {...props}>
    <Primitive.Viewport>{children}</Primitive.Viewport>
  </Primitive.Content></Primitive.Portal>;
}
export function SelectItem({children, className, ...props}: ComponentProps<typeof Primitive.Item>) {
  return <Primitive.Item className={cn('relative flex cursor-default items-center rounded-sm py-2 pr-8 pl-3 text-sm outline-none data-[highlighted]:bg-secondary data-[disabled]:opacity-50', className)} {...props}>
    <Primitive.ItemText>{children}</Primitive.ItemText>
    <Primitive.ItemIndicator className="absolute right-2"><Check className="size-4" aria-hidden="true" /></Primitive.ItemIndicator>
  </Primitive.Item>;
}
