import Link from 'next/link';
import {Button} from '@/shared/ui/button';

export function AdminShell({children}: {children: React.ReactNode}) {
  return <div className="min-h-screen">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4">ข้ามไปเนื้อหา</a>
    <header className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-6"><p className="text-xl tracking-[0.12em] uppercase">Perfume / Admin</p><Button asChild variant="outline"><Link href="/th">หน้าร้านตัวอย่าง</Link></Button></header>
    <div className="grid md:grid-cols-[16rem_1fr]">
      <aside className="border-b p-6 md:min-h-[80vh] md:border-r md:border-b-0">
        <nav aria-label="เมนูหลังบ้าน" className="flex flex-wrap gap-2 md:flex-col">
          <Link href="/admin" aria-current="page" className="rounded-md bg-secondary px-4 py-3 text-sm">ภาพรวมโครงสร้าง</Link>
          {['สินค้า / หมวดหมู่', 'ข้อมูลลูกค้า', 'โปรโมชัน', 'เนื้อหา / นโยบาย', 'ตัวเลือกน้ำหอม custom', 'รายงานรายเดือน', 'คำสั่งซื้อ'].map(label => <Button key={label} disabled variant="ghost" className="justify-start text-left" title="ยังไม่มี route หรือ action">{label}</Button>)}
        </nav>
      </aside>
      <main id="main-content" className="min-w-0 px-6 py-10 md:px-10">{children}</main>
    </div>
  </div>;
}
