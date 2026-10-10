# Perfume database diagrams for FigJam

สถานะ: **Proposed**. เป็นภาพจาก DBML เพื่อช่วยอ่านและอภิปราย ยังไม่มี migration หรือ database ที่นำ schema นี้ไปใช้

เปิด [FigJam: Outline และ Full](https://www.figma.com/board/hGYpDaBRB0XlkTaxSZut82) ในทีมส่วนตัวที่ผู้ใช้เลือก

| แผ่น | จุดประสงค์ | ตาราง | คอลัมน์ | FK |
|---|---|---:|---:|---:|
| [Outline](https://www.figma.com/board/hGYpDaBRB0XlkTaxSZut82?node-id=4-2944) | keys และ shared fields สำหรับจุดเชื่อมงาน | 26 | 111 | 29 |
| [Full](https://www.figma.com/board/hGYpDaBRB0XlkTaxSZut82?node-id=4-2952) | ทุกคอลัมน์ใน proposal ปัจจุบัน | 26 | 183 | 29 |

## คัดลอกเข้าบอร์ดของทีม

1. เปิดแผ่นที่ต้องการ เลือก Section `Outline` หรือ `Full` ทั้ง Section
2. กด `Cmd+C` บน Mac หรือ `Ctrl+C` บน Windows
3. เปิด FigJam board ปลายทาง แล้วกด `Cmd+V` หรือ `Ctrl+V`
4. ตารางเป็น native FigJam tables; แก้ข้อความในแต่ละ cell เพิ่มแถว และย้ายแต่ละตารางได้ เส้นเป็น native connectors ที่ผูกกับตาราง
5. ใช้ zoom เพื่ออ่านรายละเอียดโดยไม่ติดข้อจำกัดความละเอียดของภาพ raster

การคัดลอกไปบอร์ดปลายทางของผู้ใช้ยังไม่ได้ตรวจจริง ไม่มีการเขียนลงบอร์ดอื่นในรอบนี้

## วิธีอ่าน

- เริ่มที่ `customers` → `orders` → `order_items`
- สินค้าปกติ: `products` → `product_variants` → `order_items`
- Custom: `custom_options` และ `order_items` เชื่อมผ่าน `order_item_custom_options`
- สีน้ำเงิน: catalog; ชมพู: orders; ม่วง: custom; เขียวอ่อน: payments; เทา: identity; เหลือง: content/promotions
- สีส้ม: conditional scope ได้แก่ addresses, wishlist, production recipes, shipments และ refunds
- เส้นหนาเน้นจุดเชื่อมการซื้อ เส้นเทาบางเป็น actor/audit references ชื่อบนเส้นคือ column FK ของตารางลูก
- Crow foot = หลายรายการ; วงกลม = ไม่จำเป็นต้องมี; ขีด = หนึ่งรายการ ปลายทางแสดง cardinality จาก keys และ FK nullability ใน proposal
- `PK` = primary key, `FK` = foreign key, `UK` = unique column; composite PK ต้องอ่าน columns ที่มี PK ร่วมกัน

## แหล่งข้อมูลและขอบเขต

[Outline DBML](../schema-integration-outline.dbml) และ [Full DBML](../schema-proposal.dbml) เป็นต้นฉบับ รายละเอียด constraints, composite unique indexes, defaults, notes และกติกาธุรกิจให้อ่านจาก DBML และเอกสาร DB

ตรวจเทียบ source จาก [Outline DB](https://dbdiagram.io/d/Outline-DB-6ac351f5abcc87fb7aee9184) และ [Full db](https://dbdiagram.io/d/Full-db-6ac351f00f25a52d018ca910) วันที่ 2026-10-05 แล้ว ความยาวและ FNV-1a checksum ทั้งไฟล์ตรงกับ local: Outline `15380 / 54071303`, Full `15903 / 81a94022`

- [outline.mmd](outline.mmd) และ [full.mmd](full.mmd) เป็น source สำหรับ generate_diagram ไม่ใช่ schema migration
- Mermaid ไม่รับ comma ใน attribute type `numeric(12,3)` จึงแสดง type เป็น `numeric` และเก็บ precision `numeric(12,3)` ใน comment ของ `size_ml` โดยไม่เปลี่ยน DBML
- รูปแบบเส้นและสีใน FigJam เป็น presentation; ไม่ได้แทนข้อกำหนด RLS, delete behavior หรือ transaction
- หาก DBML เปลี่ยน ต้อง regenerate และตรวจภาพใหม่ FigJam ไม่ sync กลับ DBML อัตโนมัติ

ตรวจแล้ว: native table/column names และ FK endpoints ตรงกับต้นฉบับทั้งสองแผ่น แต่วันที่ 2026-10-05 ผู้ใช้พบปลายเส้นไม่ตรงขอบตาราง ตรวจซ้ำพบว่า geometry ของเส้นที่ generate ไว้ยังคลาดหลังขยายตาราง แม้ endpoint IDs ถูกต้อง การตรวจภาพรวมรอบแรกจึงไม่ยืนยันการลากกล่องหรือความตรงของปลายเส้น

สถานะการซ่อม 2026-10-05: ผู้ใช้อนุมัติ Code plugin และกดรันสคริปต์ซ่อมทั้งสองแผ่นแล้ว ภาพผ่าน browser แสดงเส้นที่ยึดขอบตารางและระยะกล่องที่ปรับแล้ว ทดสอบลาก `orders` ใน Outline (`1:334`) และ Full (`2:1741`) พบว่าเส้นขยับตามขอบกล่อง และ Undo คืนตำแหน่งเดิมแล้วทั้งสองแผ่น

[สคริปต์ซ่อม](repair-connections.js) ตรวจจำนวน 29 connectors ต่อแผ่นและรักษา endpoint IDs พร้อมเก็บเส้นเดิมแบบซ่อน แต่รอบนี้ไม่ได้อ่านผล assertion หรือจำนวนครบ 58 เส้นกลับจาก API เพราะ MCP quota ยังเต็ม จึงยืนยัน browser drag เฉพาะตารางที่ทดสอบ ไม่ใช่การลากทุกตารางหรือ audit ทุกเส้นซ้ำ รายละเอียดหลักฐานอยู่ใน `.docs/SESSIONLOG-db-figjam-browser-drag-2026-10-05.md`
