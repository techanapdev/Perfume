import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-3 rounded-sm text-label transition-[background-color,color,border-color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-2 aria-invalid:ring-destructive [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-primary bg-primary text-primary-foreground shadow-sm hover:border-primary/85 hover:bg-primary/85',
        outline:
          'border bg-transparent text-foreground hover:border-primary/60 hover:bg-primary/10 hover:text-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        link: 'text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary'
      },
      size: {
        default: 'min-h-11 px-6 py-2.5',
        sm: 'min-h-9 px-4 py-1.5',
        lg: 'min-h-14 px-8 py-4',
        icon: 'size-11'
      }
    },
    defaultVariants: {variant: 'default', size: 'default'}
  }
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = 'button',
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {asChild?: boolean}) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      className={cn(buttonVariants({variant, size}), className)}
      {...(!asChild ? {type} : {})}
      {...props}
    />
  );
}
