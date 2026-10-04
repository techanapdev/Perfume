import {Badge} from '@/shared/ui/badge';
import {Card, CardHeader, CardTitle, CardContent} from '@/shared/ui/card';

export default function AdminPage() {
  return <div className="space-y-8">
    <header className="space-y-4"><Badge>Structure preview</Badge><h1 className="text-3xl">โครงสร้างระบบหลังบ้าน</h1>
      <p className="max-w-3xl text-sm leading-7 text-muted-foreground">หน้านี้เป็นตัวอย่างโครงสร้างที่เปิดดูได้ ยังไม่มี authentication ข้อมูลจริง หรือ actions และไม่ใช่ระบบหลังบ้านพร้อมใช้งาน</p>
    </header>
    <Card><CardHeader><CardTitle>Dashboard ตาม flow</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {['ยอดขายรวม', 'คำสั่งซื้อระหว่างดำเนินการ', 'จำนวนลูกค้า', 'รอชำระเงิน', 'การสอบถาม'].map(label => <div key={label} className="border p-5"><p className="text-sm">{label}</p><p className="mt-3 text-xs text-muted-foreground">ยังไม่ได้เชื่อมข้อมูล</p></div>)}
    </CardContent></Card>
    <Card><CardHeader><CardTitle>การจัดการคำสั่งซื้อ</CardTitle></CardHeader><CardContent>
      <p className="text-sm leading-8 text-muted-foreground">รอชำระเงิน → เตรียมสินค้า → แพ็ก → จัดส่ง → สำเร็จ</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">กติกาการเปลี่ยนสถานะ การยกเลิก และการคืนเงินยังรอ PO ยืนยัน ตัวอย่างนี้ไม่มีการบันทึกหรือเปลี่ยนสถานะ</p>
    </CardContent></Card>
  </div>;
}
