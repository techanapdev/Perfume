'use client';

import * as Primitive from '@radix-ui/react-checkbox';
import {Check} from 'lucide-react';
import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export function Checkbox({className, ...props}: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root className={cn('size-5 shrink-0 rounded-sm border data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground disabled:opacity-50', className)} {...props}>
    <Primitive.Indicator><Check className="size-4" aria-hidden="true" /></Primitive.Indicator>
  </Primitive.Root>;
}
