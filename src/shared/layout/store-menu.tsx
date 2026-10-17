'use client';

import {useEffect, useState} from 'react';
import {Menu} from 'lucide-react';
import {Button} from '@/shared/ui/button';
import {Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription} from '@/shared/ui/sheet';
import type {StoreNavigationItem} from './store-navigation';
import {StoreNavigationLinks} from './store-navigation-links';

type StoreMenuProps = {
  mainItems: readonly StoreNavigationItem[];
  accountItems: readonly StoreNavigationItem[];
  labels: {menu: string; close: string; description: string; main: string; account: string};
};

export function StoreMenu({mainItems, accountItems, labels}: StoreMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const breakpoint = window.matchMedia('(min-width: 64rem)');
    const closeOnDesktop = () => {
      if (breakpoint.matches) setOpen(false);
    };
    breakpoint.addEventListener('change', closeOnDesktop);
    return () => breakpoint.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={labels.menu}>
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent closeLabel={labels.close}>
        <div className="self-start space-y-7 pt-8">
          <p className="font-display text-3xl tracking-widest text-primary">PERFUME.</p>
          <div className="space-y-2">
            <SheetTitle>{labels.menu}</SheetTitle>
            <SheetDescription>{labels.description}</SheetDescription>
          </div>
          <StoreNavigationLinks
            items={mainItems}
            label={labels.main}
            variant="menu"
            onNavigate={() => setOpen(false)}
          />
          <div className="space-y-3 border-t pt-6">
            <p className="text-eyebrow text-muted-foreground">{labels.account}</p>
            <StoreNavigationLinks
              items={accountItems}
              label={labels.account}
              variant="menu"
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
