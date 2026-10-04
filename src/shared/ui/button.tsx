import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive',
  {variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/85',
      outline: 'border bg-background hover:bg-secondary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-secondary',
      link: 'underline underline-offset-4'
    },
    size: {default: 'min-h-10 px-5 py-2', sm: 'min-h-9 px-3 py-1', lg: 'min-h-12 px-8 py-3', icon: 'size-10'}
  }, defaultVariants: {variant: 'default', size: 'default'}}
);

export function Button({className, variant, size, asChild = false, type = 'button', ...props}:
  ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {asChild?: boolean}) {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn(buttonVariants({variant, size}), className)} {...(!asChild ? {type} : {})} {...props} />;
}
