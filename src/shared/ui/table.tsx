import type {ComponentProps} from 'react';
import {cn} from '@/shared/lib/cn';

export function Table({className, ...props}: ComponentProps<'table'>) {
  return <div className="w-full overflow-x-auto"><table className={cn('w-full caption-bottom text-left text-sm', className)} {...props} /></div>;
}
export function TableHeader(props: ComponentProps<'thead'>) { return <thead {...props} />; }
export function TableBody(props: ComponentProps<'tbody'>) { return <tbody {...props} />; }
export function TableRow({className, ...props}: ComponentProps<'tr'>) { return <tr className={cn('border-b', className)} {...props} />; }
export function TableHead({className, ...props}: ComponentProps<'th'>) { return <th scope="col" className={cn('p-4 font-medium text-muted-foreground', className)} {...props} />; }
export function TableCell({className, ...props}: ComponentProps<'td'>) { return <td className={cn('p-4', className)} {...props} />; }
