import type {Metadata} from 'next';
import {SignOutButton} from '@/features/account/components/sign-out-button';
import {AdminShell} from '@/shared/layout/admin-shell';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin structure | Perfume',
  robots: {index: false, follow: false}
};
export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="th">
      <body>
        <AdminShell>
          <div className="mb-6 flex justify-end">
            <SignOutButton label="ออกจากระบบ" />
          </div>
          {children}
        </AdminShell>
      </body>
    </html>
  );
}
