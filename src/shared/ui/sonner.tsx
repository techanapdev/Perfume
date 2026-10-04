'use client';

import {Toaster as Sonner} from 'sonner';

export function Toaster() {
  return <Sonner theme="light" position="bottom-right" closeButton toastOptions={{style: {background: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border)'}}} />;
}
