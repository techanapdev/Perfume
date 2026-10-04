import type {Metadata} from 'next';
import {AdminShell} from '@/shared/layout/admin-shell';
import '../globals.css';

export const metadata: Metadata = {title: 'Admin structure | Perfume', robots: {index: false, follow: false}};
export default function AdminLayout({children}: {children: React.ReactNode}) {
  return <html lang="th"><body><AdminShell>{children}</AdminShell></body></html>;
}
