'use client';

import {ArrowUpRight} from 'lucide-react';
import {Link, usePathname} from '@/i18n/navigation';
import {cn} from '@/shared/lib/cn';
import {Button} from '@/shared/ui/button';
import {isStoreLinkActive, type StoreNavigationItem} from './store-navigation';

type StoreNavigationLinksProps = {
  items: readonly StoreNavigationItem[];
  label: string;
  variant?: 'main' | 'account' | 'menu';
  onNavigate?: () => void;
};

export function StoreNavigationLinks({
  items,
  label,
  variant = 'main',
  onNavigate
}: StoreNavigationLinksProps) {
  const pathname = usePathname();
  const isMenu = variant === 'menu';

  return (
    <nav aria-label={label}>
      <ul
        className={cn(
          'flex items-center',
          isMenu ? 'flex-col items-stretch gap-2' : variant === 'account' ? 'gap-2' : 'gap-1'
        )}
      >
        {items.map((item) => {
          const active = isStoreLinkActive(pathname, item.href);
          const link = (
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-3 text-label transition-colors',
                isMenu
                  ? 'w-full justify-between px-3 py-3 text-sm'
                  : 'justify-center px-3 whitespace-nowrap',
                active
                  ? 'text-primary'
                  : item.prominent
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                active && 'underline underline-offset-8',
                isMenu && active && !item.prominent && 'bg-primary/5'
              )}
            >
              {item.label}
              {isMenu && <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />}
            </Link>
          );

          return (
            <li key={item.href} className={isMenu ? 'w-full' : undefined}>
              {item.prominent ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn('border-border/70 hover:bg-transparent', isMenu && 'w-full')}
                >
                  {link}
                </Button>
              ) : (
                link
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
