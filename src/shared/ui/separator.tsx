'use client';

import * as Primitive from '@radix-ui/react-separator';
import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export function Separator({className, orientation = 'horizontal', decorative = true, ...props}: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root orientation={orientation} decorative={decorative} className={cn('bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)} {...props} />;
}
