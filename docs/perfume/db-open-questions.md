# DB — คำถามที่ต้องรับรองก่อนทำ migration

สถานะ: Pending client confirmation · 5 ตุลาคม 2026

ผู้ใช้อนุญาตให้ใช้คำแนะนำเป็นฐาน diagram ชั่วคราว ไม่ใช่การรับรอง requirement แทนร้าน ดู [DB proposal](db.md) และ [DBML](schema-proposal.dbml)

ถามลูกค้าด้วยคำถามในตาราง ขอคำตอบพร้อมตัวอย่างข้อมูลจริงที่ไม่มี secrets แล้วบันทึกผู้รับรอง/วันที่ อย่าแก้ Pending เป็น Confirmed จากการคาดเดา ทีมเป็นผู้ตัดสินใจด้าน implementation หลังได้กติกาธุรกิจ

## ต้องรู้ก่อนลง schema ของ flow ซื้อ

| ID | คำถามง่าย ๆ | แนวเริ่มต้นที่แนะนำ | ถ้าคำตอบต่าง ต้องเปลี่ยนอะไร |
|---|---|---|---|
| Q-A01 | ซื้อโดยไม่สมัครได้ไหม? | Guest + Member | Member-only บังคับ verified auth link; Guest-only ไม่ทำสมาชิก/Wishlist ก่อน |
| Q-A02 | Login ด้วยอะไร และ Guest กลับมาดู Order อย่างไร? | เลือกวิธี Auth เดียว; Guest ใช้ช่องทางยืนยันที่ตกลง เช่นลิงก์เข้าถึงเฉพาะ Order | ต้องออกแบบ guest access tokens/expiry/revocation หรือ OTP; Order ID/อีเมลอย่างเดียวไม่พอ และห้ามรวม Guest orders จากอีเมลที่ยังไม่ยืนยัน |
| Q-P01 | สินค้ามีขนาด ความเข้มข้น หรือแพ็กเกจอะไรบ้าง? แต่ละตัวมีรหัส/ราคาไหม? | Product + Variant | เพิ่มมิติ Variant หรือ bundle ตามจริง; ไม่ใช้ชื่อสินค้าเป็นตัวอ้างอิง |
| Q-P02 | หมวดกลิ่น เพศ และ Collection ใช้รายการอะไร สินค้าอยู่ได้กี่หมวด? | Categories แยกชนิด + join table | กำหนด cardinality/unique constraints; ถ้ามี collection metadata ค่อยแยก entity |
| Q-P03 | ของหมดดูจากใคร ต้องนับสต็อกจริงไหม? | เปิด/ปิดพร้อมขายด้วยคน | ถ้านับขวดเพิ่ม inventory/reservations; ถ้านับวัตถุดิบต้องรู้หน่วย สูตร การคืนสต็อก และการแย่งซื้อพร้อมกัน |
| Q-C01 | วันเกิดต้องกรอกแบบ พ.ศ./ค.ศ.? ต้องมีเวลาเกิดไหม? ข้ามได้ไหม? | Date ที่ normalize ชัด ใช้ข้อมูลเท่าที่สูตรต้องใช้ | เปลี่ยน input contract; timezone/time/place ไม่เพิ่มจนร้านยืนยันความจำเป็น |
| Q-C02 | วิธีคิดส่งเป็นอะไร ผลลัพธ์คือสินค้า กลุ่มกลิ่น หรือส่วนผสม? | ขอสูตร/decision table และตัวอย่างอย่างน้อยกรณีปกติ/29 ก.พ./ขอบเขตปี | กำหนด output identifiers, rule version และ result snapshot; algorithm ใน code ไม่ต้องสร้าง generic rule table |
| Q-C03 | เลือกอะไรได้บ้าง กี่ตัว คู่ไหนผสมไม่ได้ ต้องแยก Top/Middle/Base ไหม? | เก็บ selectable options โดยไม่ถือว่าเป็นวัตถุดิบจริง | เปลี่ยน option group, selection constraints และ compatibility model; ต้องมีตัวอย่างผลิตได้/ไม่ได้ |
| Q-C04 | Custom คิดราคาจากขนาด ส่วนผสม ขวด หรือร้านประเมินทีหลัง? | Instant price เฉพาะเมื่อร้านให้กติกาคำนวณที่รับรอง | ประเมินทีหลังเพิ่ม quote_requests/quotes/quote_items/expiry/customer acceptance ก่อน payable order; มัดจำต้องมี balance model เพิ่ม |
| Q-C05 | ร้านต้องเก็บสูตรและอัตราส่วนในเว็บไหม? ใครเห็น/แก้/อนุมัติได้? ต้องเก็บสูตรเก่าทุก revision ไหม? | Customer choices เป็น public summary; สูตรผลิตเป็น private ถ้าต้องเก็บ | เปิดใช้ production_recipes เฉพาะที่รับรอง; ถ้าต้องมีประวัติปรับสูตรเปลี่ยนเป็น append-only versions ไม่ overwrite row เดิม |
| Q-C06 | Custom มีขนาด/ขวดเหมือน Variant สินค้าปกติไหม? | รอรายการหน่วยขายจริง | ถ้ามี base SKU ให้ custom item อ้าง Variant; ถ้าไม่มีต้องมี approved custom spec/size และราคา snapshot โดยไม่สร้าง Variant ปลอม |
| Q-C07 | จ่ายแล้วผลิตเลย หรือร้านต้องอนุมัติก่อน? เลือกส่วนผสมที่ร้านทำไม่ได้หลังจ่ายจัดการอย่างไร? | แยก Payment success จาก production approval | เปลี่ยน lifecycle, recipe approval, cancellation/refund และอาจต้อง quote ก่อนรับเงิน |
| Q-C08 | ต้องเก็บวันเกิดไว้จริงไหม เพื่ออะไร ใครดู เก็บกี่วัน? | ไม่เก็บ raw DOB; เก็บผล/รุ่นกติกาเท่าที่จำเป็น | หากต้องเก็บเพิ่ม protected storage, retention/deletion และ access policy; ห้ามใส่ใน public profile หรือ logs โดยปริยาย |
| Q-M01 | ขายราคา THB และส่งในไทยก่อนใช่ไหม? | THB + domestic | หลายสกุลเงินเพิ่ม price books และ rounding/minor-unit rules; หลายประเทศเพิ่ม address/shipping/tax model ไม่เกี่ยวกับจำนวนภาษาโดยตรง |
| Q-M02 | ร้านจะเปิดบัญชีรับเงินกับ Provider ไหน และ Sandbox ทดสอบวิธีจ่ายอะไร? | ยังไม่เลือก Provider | กำหนด payment IDs/events, webhook verification, expiry, merchant identity และ refund capability; ไม่แสดง redirect success เป็น paid |
| Q-O01 | ราคาที่เห็นรวมภาษีหรือยัง ต้องมีใบกำกับภาษีไหม? | เก็บยอดย่อยชัด; tax rule Pending | เปลี่ยน tax calculation, billing snapshot และเอกสาร invoice; ห้ามยืนยัน total equation จนรู้ inclusive/exclusive |
| Q-O02 | ค่าส่งคิดอย่างไร มีรับที่ร้าน ของขวัญ ฉลากหรือแพ็กเกจพิเศษไหม? | จัดส่งหนึ่งวิธีและเก็บ fee snapshot | เพิ่ม option pricing/configuration และ billing fields ตามจริง; ถ้า pickup ไม่บังคับ shipping address |
| Q-O03 | หนึ่ง Order ส่งพัสดุเดียวไหม ใครใส่เลขติดตาม ต้องเชื่อมขนส่งไหม? | Manual tracking หนึ่งพัสดุ | หลายพัสดุเพิ่ม shipment_items และ quantity allocation; integration เพิ่ม carrier events/retries |
| Q-O04 | ยกเลิกได้ถึงขั้นไหน ใครทำได้ หมดเวลาจ่ายแล้วทำอย่างไร? | ทั้ง Order ก่อนจุดที่ร้านรับรอง | กำหนด transitions, expiry, permissions และ inventory release; partial cancellation ต้องมี item-level state |
| Q-O05 | คืนเงินทั้ง Order หรือบางสินค้า ค่าส่งคืนไหม Provider คืนเงินจริงได้ไหม? | Whole-order refund เมื่อรับรอง | Partial refund เพิ่ม allocations; ต้องคุมยอดรวม <= เงินที่ยืนยันแล้ว และแยก canceled กับ refunded |
| Q-B01 | ใครเป็น Admin และแต่ละคนทำอะไรได้ เช่น แก้ราคา ดูลูกค้า ดูสูตร คืนเงิน? | เริ่มบทบาทเท่าที่จำเป็น | กำหนด staff roles/permission matrix, bootstrap/revoke และ RLS; ไม่ใช้ customer-editable metadata เป็นสิทธิ์ |

## ต้องรู้ก่อนเปิด feature เสริม / admin editing

| ID | คำถามง่าย ๆ | แนวเริ่มต้นที่แนะนำ | ผลต่อ schema |
|---|---|---|---|
| Q-A03 | สมาชิกต้องบันทึกที่อยู่หลายที่ไหม? | ยังไม่เปิดใช้จนยืนยัน | เปิด customer_addresses; order ใช้ snapshot ไม่อ้าง address ที่แก้ย้อนหลังได้ |
| Q-A04 | Wishlist ต้องมีไหม เก็บระดับสินค้า/ขนาด และ Guest ใช้ได้ไหม? | Member product-level ถ้าต้องมี | Variant-level เปลี่ยน FK/PK; Guest local storage ไม่มี table หรือ server persistence ต้องออกแบบ identity/merge |
| Q-A05 | Guest คนเดิมนับเป็นลูกค้าคนเดียวอย่างไร ต้องรวมประวัติเมื่อสมัครไหม? | ไม่ merge ด้วยอีเมลอย่างเดียว | ต้องมี verified account-linking/deduplication workflow และนิยาม customer count |
| Q-C09 | บันทึกสูตรที่เลือกไว้หรือสั่งซ้ำข้าม session ได้ไหม? | Client draft ก่อนซื้อ + order selection snapshots | เพิ่ม custom_configurations/options/ownership/version ถ้าต้องบันทึก; reorder ตรวจราคากับ availability ใหม่ |
| Q-C10 | Admin แก้สูตรแนะนำเองไหม หรือทีมแก้ code ตามสูตรร้าน? | Code version จนมีรูปแบบ rule ชัด | ถ้าแก้เองค่อยเพิ่ม private custom_rule_versions/publish/approval; ไม่เก็บ executable code จาก CMS |
| Q-P04 | รูปสินค้าอัปโหลดจากไหน จำกัดขนาดเท่าไร ใช้รูปเดียวหลายสินค้าไหม? | Storage path reference | เปลี่ยน asset relationship/metadata, access และ deletion policy; รูปตัวเลือกตามภาษาเพิ่ม translation relation |
| Q-P05 | TH/EN ต้องครบก่อนเผยแพร่ไหม ถ้าขาดภาษาให้แสดงอะไร? ภาษาที่สามคืออะไร? | Translation rows; TH/EN พร้อมตาม policy ที่รับรอง | กำหนด locale constraints, fallback และ publication gate ไม่เพิ่ม name_th/name_en columns |
| Q-R01 | โปรโมชั่นแรกเป็นลดบาท ลดเปอร์เซ็นต์ หรือส่งฟรี? ใช้ Custom ได้ไหม? | ชนิดเดียวและหนึ่งโปรโมชั่นต่อ Order | กำหนด discount unit/eligibility; stacking เปลี่ยน unique order usage และลำดับคิดส่วนลด |
| Q-R02 | จำกัดใช้กี่ครั้ง ต่อคน/ต่อ Order? ถือว่าใช้แล้วตอนจองหรือจ่าย? | ยังไม่เพิ่ม usage limit จนรับรอง | ถ้ามี quota เพิ่ม reservation/redemption lifecycle และ transaction lock ป้องกันเกินโควตา |
| Q-T01 | หน้าแรก/นโยบายมีส่วนไหนที่ร้านแก้ได้ ต้องมี Draft/Preview/Approve ไหม? | Validated content entries แยก key+locale | Draft พร้อม live version ต้องมี content revisions/publication model; ห้ามเปิด draft ผ่าน public row |
| Q-T02 | ต้องเก็บว่า Order ยอมรับนโยบายฉบับไหนหรือไม่? | ถ้าธุรกิจต้องอ้างฉบับที่ยอมรับ ให้เก็บ immutable version | เพิ่ม policy versions และ order acceptance relation/timestamp ไม่อ้าง policy row ที่แก้ทับ |
| Q-T03 | Contact เป็นแค่ LINE/โทร/อีเมล หรือรับข้อความเข้าเว็บ? | ลิงก์ติดต่อก่อน | ถ้ารับข้อความเพิ่ม inquiries/retention/permissions และ workflow จัดการ; ไม่แสดงจำนวน inquiry ที่ไม่มี source |
| Q-D01 | ยอดขายหมายถึงสั่งซื้อ จ่ายแล้ว หรือส่งแล้ว? คืนเงินนับอย่างไร ใช้เวลาไทยไหม? | Paid/reconciled facts ตามนิยามที่รับรอง | เริ่ม queries/views จาก payments/orders/refunds; ไม่สร้าง report rows ซ้ำ; customer count ต้องรู้ Q-A05 |
| Q-D02 | ต้องมีกราฟ Export CSV หรือรายงานต้นทุน/กำไรไหม? | Monthly sales summary ก่อน | Profit ต้องมี cost snapshots; ไม่อนุมานต้นทุนจากราคา; export ต้องมีสิทธิ์และขอบเขตข้อมูล |
| Q-S01 | ส่งอีเมลแจ้งอะไรบ้าง ต้องยืนยันส่งสำเร็จ/ลองใหม่ไหม? | ยังไม่เพิ่ม email persistence ก่อนรับรอง | เพิ่ม outbox/delivery logs เมื่อจำเป็น; ยืนยัน Order transaction ก่อนส่ง ไม่ส่งซ้ำจาก event ซ้ำ |
| Q-S02 | เก็บข้อมูลลูกค้า/payment events/สูตรนานเท่าไร ลบบัญชีแล้วเก็บ Order อะไร? | กำหนด retention ต่อชนิดข้อมูลก่อนใช้จริง | เปลี่ยน anonymization/FK deletion/audit policy; ห้าม cascade ลบประวัติการเงินจาก auth user deletion |
| Q-S03 | POC ใช้ข้อมูลสมมติล้วนไหม และแยก Sandbox จาก Production อย่างไร? | Synthetic data และ environment แยก | กำหนด seed, retention, provider event environment และ deployment guard; ไม่ใช้ credentials จริงใน diagram |

## แบบบันทึกคำตอบ

```text
Question ID:
Answer:
Approved by / date:
Example input / expected output:
Affected tables / contracts / access:
Status: Pending | Confirmed | Superseded
Follow-up:
```

ใช้ IDs ในไฟล์นี้สำหรับชุดคำถาม DB รอบนี้; ไม่เปลี่ยน IDs PO-C/PO-M/PO-A/PO-B ในเอกสารเดิม คำตอบใหม่ต้อง trace กลับ requirement เดิมเมื่อย้ายเข้าชุด SSOT ของทีม
