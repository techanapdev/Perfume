# Data dictionary — ตารางไหนใช้ทำอะไร

สถานะ: **Core applied + schema/privilege/anonymous HTTP checks PASS** · 11 ตุลาคม 2026 · Project `mpzsrprdvvmhormesrva`

## Core ที่ส่งให้ทีมใช้ร่วมกัน

แหล่งจริงของ Core คือ [migration](../../supabase/migrations/20261011075113_core_tables.sql) และ [ADR 0004](../adr/0004-core-table-integration.md). ส่วนข้อเสนอ 26 ตารางด้านล่างเป็นแนวออกแบบ feature เท่านั้น **ห้ามถือว่าคอลัมน์ในข้อเสนอมีอยู่แล้ว**

เป้าหมาย Core: ให้ทีมใช้ตาราง, ID และ FK ชุดเดียว ไม่สร้างตารางซ้ำหรือเชื่อมผิดชนิด. Core รอบนี้มีเฉพาะ ID/FK/เวลาสร้าง ยังไม่มีชื่อสินค้า, slug, SKU, ราคา, ยอดขาย, status, snapshots หรือ provider fields จึงยังไม่ใช่ Catalog/Checkout/Payment ที่เปิดใช้งานได้

| ตาราง                     | Owner                     | ใช้ทำอะไรตอนนี้                                     | Owner เพิ่มภายหลัง                                            |
| ------------------------- | ------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `public.customers`        | 3                         | ตัวตนลูกค้าที่ผูกบัญชีสมาชิกให้ Order อ้าง          | โปรไฟล์, linkage operation, anonymization/access              |
| `public.products`         | 1                         | ตัวตนสินค้าให้ Variant และ feature อื่นอ้าง         | slug, publication, รายละเอียด/คำแปล/รูป                       |
| `public.product_variants` | 1                         | ตัวตนหน่วยขายที่อยู่ใต้ Product ให้ Order Item อ้าง | SKU, ขนาด, ราคา/currency, availability                        |
| `public.orders`           | 4                         | ตัวตน Order ที่เป็นของ Customer                     | ยอดเงิน, lifecycle, idempotency, purchase snapshots           |
| `public.order_items`      | 4; review กับ 1/3         | ตัวตนรายการใต้ Order และลิงก์ Variant เมื่อมี       | quantity, ราคา, snapshots และ Custom constraints              |
| `public.payments`         | 4                         | ตัวตนรายการ Payment ที่อ้าง Order                   | attempts/retry, amount/currency, provider, verified lifecycle |
| `private.staff_members`   | 3; มีอยู่ก่อน Core        | authority ของ Admin ใช้ผ่าน `is_active_staff()`     | การจัดการ staff ตาม access contract                           |
| `auth.users`              | Supabase; มีอยู่ก่อน Core | บัญชีล็อกอินที่ Customer/Staff อ้าง                 | ไม่สร้าง/แก้ managed schema เอง                               |

### คอลัมน์ Core ทุกตัว

`Null: ไม่` = ต้องมีค่า; `Null: ได้` = ว่างได้. `created_at` ทุกตารางใหม่เป็น `timestamptz NOT NULL DEFAULT now()` ใช้เวลาสร้างแถว ไม่ใช่เวลาซื้อหรือจ่ายสำเร็จ และไม่มี `updated_at`/trigger ใน Core รอบนี้

| ตาราง            | คอลัมน์        | ชนิด        | Null | Default/ข้อบังคับ                             | เอาไว้ทำอะไร                                                                                            |
| ---------------- | -------------- | ----------- | ---- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| customers        | `id`           | uuid        | ไม่  | PK; `gen_random_uuid()`                       | ตัวอ้างอิงลูกค้าที่คงอยู่แยกจากบัญชี Auth                                                               |
| customers        | `auth_user_id` | uuid        | ไม่  | UNIQUE; FK → auth.users.id; RESTRICT          | ผูก Customer กับสมาชิกหนึ่งบัญชี ไม่ใช่ email ที่ client กรอก                                           |
| customers        | `created_at`   | timestamptz | ไม่  | `now()`                                       | เวลาสร้าง Customer                                                                                      |
| products         | `id`           | bigint      | ไม่  | PK; GENERATED ALWAYS AS IDENTITY              | ตัวอ้างอิงสินค้าถาวร; DB สร้างเลขให้ ไม่ใช่ SKU/slug                                                    |
| products         | `created_at`   | timestamptz | ไม่  | `now()`                                       | เวลาสร้าง Product                                                                                       |
| product_variants | `id`           | bigint      | ไม่  | PK; GENERATED ALWAYS AS IDENTITY              | ตัวอ้างอิงหน่วยขายที่ Order Item ใช้                                                                    |
| product_variants | `product_id`   | bigint      | ไม่  | FK → products.id; RESTRICT; indexed           | Product เจ้าของ Variant; Product เดียวมีหลาย Variant ได้                                                |
| product_variants | `created_at`   | timestamptz | ไม่  | `now()`                                       | เวลาสร้าง Variant                                                                                       |
| orders           | `id`           | uuid        | ไม่  | PK; `gen_random_uuid()`                       | ตัวอ้างอิง Order; ไม่ใช่เลข Order สำหรับลูกค้าและไม่ใช่สิทธิ์เข้าถึง                                    |
| orders           | `customer_id`  | uuid        | ไม่  | FK → customers.id; RESTRICT; indexed          | Customer เจ้าของ Order; server ต้อง derive จาก session ที่ตรวจแล้ว                                      |
| orders           | `created_at`   | timestamptz | ไม่  | `now()`                                       | เวลาสร้างแถว ไม่ใช่เวลารับ Order/paid                                                                   |
| order_items      | `id`           | uuid        | ไม่  | PK; `gen_random_uuid()`                       | ตัวอ้างอิงรายการเพื่อเชื่อม Custom หรือ production ภายหลัง                                              |
| order_items      | `order_id`     | uuid        | ไม่  | FK → orders.id; RESTRICT; indexed             | Order ที่รายการนี้อยู่; หลายรายการอยู่ Order เดียวได้                                                   |
| order_items      | `variant_id`   | bigint      | ได้  | FK → product_variants.id; RESTRICT; indexed   | Variant ที่ซื้อเมื่อมี; nullable รอ owner ออกแบบ Custom ไม่ใช่อนุญาต Standard checkout ที่ไม่มี Variant |
| order_items      | `created_at`   | timestamptz | ไม่  | `now()`                                       | เวลาสร้างรายการ                                                                                         |
| payments         | `id`           | uuid        | ไม่  | PK; `gen_random_uuid()`                       | ตัวอ้างอิง Payment ภายใน ไม่ใช่ provider payment ID                                                     |
| payments         | `order_id`     | uuid        | ไม่  | FK → orders.id; RESTRICT; indexed; ไม่ UNIQUE | เชื่อมกับ Order; schema ไม่จำกัดจำนวนแถว แต่ retry/attempt policy ยังให้ owner เคาะ                     |
| payments         | `created_at`   | timestamptz | ไม่  | `now()`                                       | เวลาสร้างแถว Payment; ไม่ใช่หลักฐานชำระเงินสำเร็จ                                                       |

### Staff columns ที่มีอยู่จริงก่อน Core

| คอลัมน์      | ชนิด        | Null | ข้อบังคับ/Default                         | เอาไว้ทำอะไร                                                                        |
| ------------ | ----------- | ---- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `user_id`    | uuid        | ไม่  | PK; FK → auth.users.id; ON DELETE CASCADE | บัญชี staff; cascade นี้ลบเฉพาะ staff authority ไม่ลบประวัติ Core                   |
| `role`       | text        | ไม่  | CHECK role = 'admin'; ไม่มี default       | role ที่รองรับจริงใน migration staff ปัจจุบัน ไม่ใช่ permission vocabulary ทั้งร้าน |
| `is_active`  | boolean     | ไม่  | false                                     | เปิด/ปิด authority; ต้องผ่าน function/server authorization                          |
| `created_at` | timestamptz | ไม่  | now()                                     | เวลาสร้าง staff row                                                                 |

`auth.users` เป็น managed table; dictionary นี้อธิบายเฉพาะ `id` UUID ที่ Core อ้าง ไม่ใช่สัญญาให้ทีมแก้คอลัมน์ Auth. Signup เดิมสร้าง Auth user แต่ยังไม่สร้าง Customer อัตโนมัติ; owner 3/4 ต้องเพิ่ม operation ผูก Customer ก่อน Checkout

### ทำอะไรได้ / ยังทำอะไรไม่ได้

- เจ้าของ feature เพิ่มคอลัมน์หรือ extension tables ด้วย migration ต่อจาก Core และใช้ PK/FK ข้างบน ไม่สร้าง Core ซ้ำ ไม่แก้ชนิด/ชื่อ/nullability โดยไม่ review ผู้ใช้จุดเชื่อม
- ทุกตารางใหม่เปิด RLS, ไม่มี policies และ revoke privileges จาก PUBLIC/anon/authenticated รวม identity sequences: browser/session ปกติยังอ่าน/เขียนตารางไม่ได้ ต้องมี feature access migration ก่อน
- Privileged owner/service role เป็น trust boundary และอาจ bypass RLS; ทุก sensitive server operation ต้องตรวจ session/role/ownership ไม่เชื่อ customer ID/ราคา/paid จาก browser
- การลบ Auth user ที่มี Customer จะถูกกั้น; การลบ Customer ที่มี Order, Product ที่มี Variant, Variant ที่มี Item และ Order ที่มี Item/Payment จะถูกกั้นด้วย RESTRICT. ไม่ได้ทำ account deletion หรือ archive UI ให้แล้ว
- RESTRICT รักษาประวัติจากการลบ parent ไม่ใช่ระบบ immutable audit: privileged direct delete/update ของ leaf rows ยังต้องควบคุมใน owner operations/retention contract. ไม่มีการอนุมัติ cleanup/delete ในงานนี้
- UUID ส่งผ่าน shared APIs เป็น string; Catalog bigint IDs ใช้ decimal strings ใน API contracts ใหม่ ห้ามผ่าน `Number()` เพื่อไม่เสีย precision. DB identity ไม่ใช่เลขต่อเนื่องไร้ช่องว่าง
- Generated [Database types](../../src/shared/lib/supabase/database.types.ts) มาจาก schema จริง แต่ generator แสดง bigint เป็น TypeScript `number`; ไม่ hand-edit generated types. ก่อนส่ง bigint IDs ผ่าน shared API owner ต้องออกแบบ SQL projection/RPC ที่คืน ID เป็น text ตั้งแต่ก่อน JSON/JS parse ไม่ใช่รับ number ที่เสีย precision แล้วค่อยแปลงเป็น string
- ยังคำนวณรายงานยอดขาย, รับเงินจริง, ยืนยัน paid หรือเปิด Custom checkout ไม่ได้: ต้องมีราคา/quantity/ยอดเงิน, snapshots/version, status, idempotency, transactions และ access ที่ owners review ก่อน
- เงินเมื่อ owner เพิ่มต้องใช้ integer minor units คู่ currency; tax/provider/Custom สูตรจริงยัง Pending ไม่ใช้ default จากข้อเสนอเป็นคำตอบธุรกิจ
- ลูกค้าต้องสมัครสมาชิกก่อนซื้อ; การมี Auth FK ไม่พิสูจน์ session/verification/ownership โดยตัวมันเอง

### ตัวอย่างการต่อของทีม (สมมติ ไม่ใช่ production write)

สมาชิก 1 เพิ่ม slug/SKU/ราคาและ Catalog operations ลง Product/Variant เดิม; สมาชิก 3 เพิ่ม Customer linkage และ Custom contract; สมาชิก 4 รับ Customer/Variant IDs ไปสร้าง Order + Items + snapshots ใน transaction แล้วต่อ Payment ที่ตรวจ provider จริง. สมาชิก 2 รับ safe projections จาก owners ไม่อ่านข้อมูล private ผ่านตารางดิบ

### หลักฐานและสถานะ

Independent agent scrutiny: **PASS / ship** สำหรับ SQL และ dictionary ก่อน apply. Apply `core_tables` สำเร็จบน PostgreSQL 17.11; remote version `20261011075836`, local CLI filename `20261011075113_core_tables.sql`. ไม่ใช้ bulk db push เพราะ timestamp history ต่างกัน

หลัง apply dump [schema evidence](../../.docs/core-schema-2026-10-11.json) และตรวจครบ 18 คอลัมน์, 6 PK, 6 FK แบบ RESTRICT, 1 UNIQUE Auth link, 12 indexes รวม PK/unique/FK; [SQL assertions](../../scripts/core-schema.check.sql) ผ่าน RLS/no policies/table+sequence privileges ของ anon/authenticated. Anonymous HTTP GET ทั้งหกตารางตอบ 401 + code 42501 ตาม deny-by-default; ไม่ใช่ 404/table missing

ทั้งหกตารางมี 0 แถว; staff ยังหนึ่งแถวและ function MD5 `98aab462066e161b83e4468843e9e2b2` ตรงก่อน apply. ไม่สร้าง fixture/ลูกค้า/Order/Payment จริงเพื่อทดสอบ. Generated types ถูกสร้างจาก schema หลัง apply; หลักฐานรวมดู [session log](../../.docs/SESSIONLOG-core-migration-2026-10-11.md)

ยังไม่ทดสอบ authenticated HTTP session, successful domain mutations, transaction/retry concurrency, browser, provider/payment หรือการลบจริง; SQL catalog/denied HTTP เป็นหลักฐานระดับ structural/access เท่านั้น. Feature policies/ราคา/snapshots ยังต้อง owners เพิ่มก่อนเปิดใช้งาน

## ภาคผนวก: Proposed feature dictionary — ไม่ใช่คอลัมน์ที่ติดตั้งแล้ว

เอกสารนี้ให้ทีมรู้ว่าแต่ละตารางมีไว้ทำอะไร ใครดูแล และคอลัมน์แต่ละตัวหมายถึงอะไร สรุปจาก [schema-proposal.dbml](schema-proposal.dbml) ไม่เพิ่มคอลัมน์หรือกติกาใหม่ ดูความสัมพันธ์ที่ [db-integration-outline.md](db-integration-outline.md) และคำถามที่ยังค้างที่ [db-open-questions.md](db-open-questions.md)

## อ่านอย่างไร

- **สถานะ:** `Foundation` = ฐานที่เสนอ · `Conditional` = สร้างเมื่อร้านรับรอง feature นั้น · `Managed` = Supabase จัดการเอง ไม่สร้างซ้ำ
- **Schema `private.*`:** ไม่เปิดผ่าน Data API สาธารณะ เข้าถึงผ่าน server operation เท่านั้น
- **ทุกตารางที่มี `created_at` / `updated_at`:** เป็น `timestamptz` เวลาสร้าง/แก้ล่าสุด ไม่อธิบายซ้ำรายตาราง
- **เงินทุกช่อง `*_minor`:** จำนวนเต็มหน่วยย่อย (สตางค์) คู่กับ `currency` ห้ามใช้ทศนิยม
- **Snapshot (`*_snapshot`):** ค่า ณ วันซื้อ แก้ย้อนหลังไม่ได้ ไม่ผูกกับข้อมูลสดของสินค้า/ลูกค้า
- **ค่าที่ยัง Pending** (เช่น `status`, `role`, `discount_kind`) ไม่มีการกำหนดชุดค่าไว้ ต้องรอร้านรับรอง

## ภาพรวม 26 ตาราง

| กลุ่ม       | ตาราง                        | สถานะ               | เจ้าของ            | ใช้ทำอะไร                                   |
| ----------- | ---------------------------- | ------------------- | ------------------ | ------------------------------------------- |
| Identity    | `auth.users`                 | Managed             | Supabase           | บัญชีล็อกอิน                                |
| Identity    | `customers`                  | Foundation          | 3                  | โปรไฟล์ลูกค้าสมาชิก                         |
| Identity    | `private.staff_members`      | Foundation          | 3                  | ระบุว่าใครเป็น Admin                        |
| Catalog     | `products`                   | Foundation          | 1                  | ตัวตนของสินค้า                              |
| Catalog     | `product_translations`       | Foundation          | 1                  | ชื่อ/คำอธิบายสินค้า TH/EN                   |
| Catalog     | `product_variants`           | Foundation          | 1                  | หน่วยขายจริง (SKU/ขนาด/ราคา)                |
| Catalog     | `categories`                 | Foundation          | 1                  | หมวดกลิ่น/กลุ่มเป้าหมาย/คอลเลกชัน           |
| Catalog     | `category_translations`      | Foundation          | 1                  | ชื่อหมวด TH/EN                              |
| Catalog     | `product_categories`         | Foundation          | 1                  | จับคู่สินค้ากับหมวด                         |
| Catalog     | `product_images`             | Foundation          | 1                  | อ้างอิงรูปใน Storage                        |
| Custom      | `custom_options`             | Foundation          | 3                  | ตัวเลือกกลิ่นที่ลูกค้าเลือกได้              |
| Custom      | `custom_option_translations` | Foundation          | 3                  | ชื่อตัวเลือก TH/EN                          |
| Custom      | `order_item_custom_options`  | Foundation          | 3 กำหนด / 4 บันทึก | ตัวเลือกที่ลูกค้าเลือกจริงในแต่ละรายการสั่ง |
| Commerce    | `orders`                     | Foundation          | 4                  | หัวคำสั่งซื้อ ยอดเงิน ที่อยู่ ณ วันซื้อ     |
| Commerce    | `order_items`                | Foundation          | 4                  | รายการสินค้าในคำสั่งซื้อ                    |
| Commerce    | `order_status_history`       | Foundation          | 4                  | ประวัติเปลี่ยนสถานะ (เพิ่มอย่างเดียว)       |
| Commerce    | `payments`                   | Foundation          | 4                  | ความพยายามชำระเงินแต่ละครั้ง                |
| Commerce    | `private.payment_events`     | Foundation          | 4                  | event จาก Provider ที่ตรวจแล้ว              |
| Promotion   | `promotions`                 | Foundation          | 1                  | นิยามโปรโมชั่น                              |
| Promotion   | `order_promotions`           | Foundation          | 1 นิยาม / 4 บันทึก | ส่วนลดที่ใช้จริงในคำสั่งซื้อ                |
| Content     | `content_entries`            | Foundation          | 2                  | เนื้อหาหน้าแรก/ติดต่อ/นโยบาย TH+EN          |
| Conditional | `customer_addresses`         | Conditional (Q-A03) | 3                  | ที่อยู่ที่สมาชิกบันทึกไว้                   |
| Conditional | `wishlist_items`             | Conditional (Q-A04) | 2                  | รายการโปรดของสมาชิก                         |
| Conditional | `private.production_recipes` | Conditional (Q-C05) | 3                  | สูตรผลิตลับของร้าน                          |
| Conditional | `shipments`                  | Conditional (Q-O03) | 4                  | เลขพัสดุและสถานะจัดส่ง                      |
| Conditional | `private.refunds`            | Conditional (Q-O05) | 4                  | การคืนเงิน                                  |

---

## Identity

### `customers` — ข้อเสนอส่วนขยายโปรไฟล์สมาชิก

แยกจากบัญชีล็อกอิน เพื่อให้คนซื้อโดยไม่สมัครมีตัวตนใน Order ได้ · คำถามค้าง: Q-A01, Q-A02, Q-A05, Q-S02

| คอลัมน์        | ชนิด | Null | ความหมาย                                                                    |
| -------------- | ---- | ---- | --------------------------------------------------------------------------- |
| `id`           | uuid | ไม่  | PK                                                                          |
| `auth_user_id` | uuid | ไม่  | Core: FK ไป `auth.users` (unique, RESTRICT); เชื่อมจาก identity ที่ตรวจแล้ว |
| `display_name` | text | ได้  | ชื่อที่แสดง                                                                 |
| `email`        | text | ได้  | ไม่ unique และห้ามใช้เป็นตัวตัดสินสิทธิ์                                    |
| `phone`        | text | ได้  | เบอร์ติดต่อ                                                                 |

ไม่เก็บวันเกิดดิบ (Q-C08)

### `private.staff_members` — สิทธิ์ Admin

| คอลัมน์     | ชนิด    | Null | ความหมาย                                                                               |
| ----------- | ------- | ---- | -------------------------------------------------------------------------------------- |
| `user_id`   | uuid    | ไม่  | PK + ลิงก์ไป `auth.users`                                                              |
| `role`      | text    | ไม่  | บทบาท (ชุดค่าและ permission matrix Pending, Q-B01) ห้ามใช้ metadata ที่ผู้ใช้แก้ได้แทน |
| `is_active` | boolean | ไม่  | เปิดใช้สิทธิ์หรือไม่ (default `false`)                                                 |

มี migration เดิม `supabase/migrations/20261010000000_staff_auth.sql`; actual Core ดูส่วนต้นของ dictionary นี้

---

## Catalog

### `products` — ตัวตนสินค้า

คำถามค้าง: Q-P01, Q-P02 · เก็บเฉพาะตัวตน ส่วนชื่อ/คำอธิบายอยู่ใน `product_translations`

| คอลัมน์        | ชนิด        | Null | ความหมาย                                                   |
| -------------- | ----------- | ---- | ---------------------------------------------------------- |
| `id`           | bigint      | ไม่  | Core PK เลขรันจาก DB                                       |
| `slug`         | text        | ไม่  | ใช้ใน URL (unique)                                         |
| `is_published` | boolean     | ไม่  | แสดงหน้าร้านหรือไม่ (default `false`)                      |
| `archived_at`  | timestamptz | ได้  | เวลาเก็บเข้าคลัง ใช้ archive แทนลบ เพราะ Order อ้างอิงอยู่ |

### `product_translations` — ชื่อและคำอธิบายสินค้าแยกภาษา

PK = (`product_id`, `locale`) · คำถามค้าง: Q-P05

| คอลัมน์             | ชนิด   | Null | ความหมาย             |
| ------------------- | ------ | ---- | -------------------- |
| `product_id`        | bigint | ไม่  | FK → `products`      |
| `locale`            | text   | ไม่  | ภาษา เช่น `th`, `en` |
| `name`              | text   | ไม่  | ชื่อสินค้า           |
| `description`       | text   | ไม่  | คำอธิบาย             |
| `notes_description` | text   | ได้  | คำอธิบายโน้ตกลิ่น    |

### `product_variants` — หน่วยขายจริง

สิ่งที่ลูกค้าซื้อและที่ Order อ้างถึง (ไม่ใช่ `products`) · คำถามค้าง: Q-P01, Q-P03, Q-C06

| คอลัมน์            | ชนิด          | Null | ความหมาย                                                    |
| ------------------ | ------------- | ---- | ----------------------------------------------------------- |
| `id`               | bigint        | ไม่  | Core PK เลขรันจาก DB                                        |
| `product_id`       | bigint        | ไม่  | Core FK → `products`                                        |
| `sku`              | text          | ไม่  | รหัสสินค้า (unique)                                         |
| `size_ml`          | numeric(12,3) | ได้  | ขนาดเป็น มล.                                                |
| `concentration`    | text          | ได้  | ความเข้มข้น                                                 |
| `unit_price_minor` | bigint        | ไม่  | ราคาต่อหน่วย ต้อง ≥ 0                                       |
| `currency`         | text          | ไม่  | สกุลเงิน (default `THB`)                                    |
| `is_available`     | boolean       | ไม่  | พร้อมขายหรือไม่ ตั้งด้วยคน ไม่ได้นับสต็อก (default `false`) |
| `archived_at`      | timestamptz   | ได้  | เวลาเก็บเข้าคลัง                                            |

### `categories` — หมวดสินค้า

| คอลัมน์         | ชนิด    | Null | ความหมาย                                                |
| --------------- | ------- | ---- | ------------------------------------------------------- |
| `id`            | uuid    | ไม่  | PK                                                      |
| `category_kind` | text    | ไม่  | ชนิดของหมวด เช่น กลุ่มกลิ่น / กลุ่มเป้าหมาย / คอลเลกชัน |
| `slug`          | text    | ไม่  | unique คู่กับ `category_kind`                           |
| `sort_order`    | integer | ไม่  | ลำดับแสดง (default 0)                                   |
| `is_enabled`    | boolean | ไม่  | เปิดใช้หรือไม่ (default `false`)                        |

### `category_translations` — ชื่อหมวดแยกภาษา

PK = (`category_id`, `locale`) · คอลัมน์: `category_id` FK → `categories`, `locale`, `name`

### `product_categories` — จับคู่สินค้ากับหมวด

PK = (`product_id`, `category_id`) · FK → `products` และ `categories` · สินค้าอยู่ได้หลายหมวดตามแนวเริ่มต้น (Q-P02)

### `product_images` — อ้างอิงรูปสินค้า

เก็บ path ใน Storage ไม่เก็บไฟล์ · คำถามค้าง: Q-P04

| คอลัมน์       | ชนิด    | Null | ความหมาย                                                       |
| ------------- | ------- | ---- | -------------------------------------------------------------- |
| `id`          | uuid    | ไม่  | PK                                                             |
| `product_id`  | bigint  | ไม่  | FK → `products`                                                |
| `bucket_name` | text    | ไม่  | Storage bucket                                                 |
| `object_path` | text    | ไม่  | path ของไฟล์                                                   |
| `alt_text`    | jsonb   | ไม่  | alt text แยกภาษา เช่น `{"th": "...", "en": "..."}` ไม่ใช่ HTML |
| `sort_order`  | integer | ไม่  | ลำดับรูป                                                       |

---

## Custom perfume

### `custom_options` — ตัวเลือกกลิ่นที่ลูกค้าเลือกได้

เป็น "ตัวเลือกให้เลือก" ไม่จำเป็นต้องเป็นวัตถุดิบจริง ไม่มีอัตราส่วนหรือสูตรในตารางนี้ · คำถามค้าง: Q-C03

| คอลัมน์        | ชนิด    | Null | ความหมาย                                                      |
| -------------- | ------- | ---- | ------------------------------------------------------------- |
| `id`           | uuid    | ไม่  | PK                                                            |
| `code`         | text    | ไม่  | รหัสตัวเลือก (unique)                                         |
| `option_group` | text    | ได้  | กลุ่ม เช่น Top/Middle/Base ใช้เมื่อร้านยืนยันความหมายเท่านั้น |
| `is_enabled`   | boolean | ไม่  | เปิดให้เลือกหรือไม่ (default `false`)                         |
| `sort_order`   | integer | ไม่  | ลำดับแสดง                                                     |

### `custom_option_translations` — ชื่อตัวเลือกแยกภาษา

PK = (`custom_option_id`, `locale`) · คอลัมน์: `name`, `description` (ได้)

### `order_item_custom_options` — ตัวเลือกที่ลูกค้าเลือกจริง

สมาชิก 3 นิยามรูปแบบการเลือก สมาชิก 4 บันทึกพร้อม Order ในธุรกรรมเดียวกัน · PK = (`order_item_id`, `custom_option_id`)

| คอลัมน์            | ชนิด  | Null | ความหมาย                                    |
| ------------------ | ----- | ---- | ------------------------------------------- |
| `order_item_id`    | uuid  | ไม่  | FK → `order_items` (เฉพาะ item ชนิด custom) |
| `custom_option_id` | uuid  | ไม่  | FK → `custom_options`                       |
| `option_snapshot`  | jsonb | ไม่  | code/ชื่อ/กลุ่ม ณ วันซื้อ ไม่มีอัตราส่วน    |

---

## Commerce

### `orders` — หัวคำสั่งซื้อ

ยอดเงินทั้งหมดคำนวณฝั่ง server เท่านั้น · คำถามค้าง: Q-A01, Q-M01, Q-O01, Q-O02, Q-O04

| คอลัมน์                | ชนิด        | Null | ความหมาย                                                                            |
| ---------------------- | ----------- | ---- | ----------------------------------------------------------------------------------- |
| `id`                   | uuid        | ไม่  | PK                                                                                  |
| `order_number`         | text        | ไม่  | เลขที่ให้คนอ่าน (unique) ไม่ใช่รหัสเข้าถึง                                          |
| `customer_id`          | uuid        | ไม่  | FK → `customers`                                                                    |
| `checkout_request_key` | text        | ไม่  | กันสั่งซ้ำเมื่อกดซ้ำ (unique)                                                       |
| `locale`               | text        | ไม่  | ภาษาที่ลูกค้าใช้ตอนสั่ง                                                             |
| `currency`             | text        | ไม่  | สกุลเงิน (default `THB`)                                                            |
| `status`               | text        | ไม่  | สถานะ ชุดค่าและการเปลี่ยนสถานะ Pending                                              |
| `subtotal_minor`       | bigint      | ไม่  | ยอดรวมสินค้า                                                                        |
| `discount_minor`       | bigint      | ไม่  | ส่วนลด (default 0)                                                                  |
| `shipping_minor`       | bigint      | ไม่  | ค่าส่ง (default 0)                                                                  |
| `tax_minor`            | bigint      | ไม่  | ภาษี (default 0)                                                                    |
| `total_minor`          | bigint      | ไม่  | ยอดสุทธิ เสนอ = subtotal − discount + shipping + tax (ภาษีรวมในราคาหรือไม่ Pending) |
| `snapshot_version`     | integer     | ไม่  | เวอร์ชันของรูปแบบ snapshot                                                          |
| `buyer_snapshot`       | jsonb       | ไม่  | ชื่อ/ติดต่อ ณ วันซื้อ                                                               |
| `shipping_snapshot`    | jsonb       | ไม่  | ที่อยู่/วิธีส่ง/ค่าส่ง ณ วันซื้อ                                                    |
| `placed_at`            | timestamptz | ไม่  | เวลาสั่งซื้อ                                                                        |

ไม่มี flag `is_paid` ความจริงเรื่องจ่ายเงินดูจาก `payments` ที่ตรวจแล้ว

### `order_items` — รายการสินค้าในคำสั่งซื้อ

| คอลัมน์                   | ชนิด    | Null | ความหมาย                                                                                        |
| ------------------------- | ------- | ---- | ----------------------------------------------------------------------------------------------- |
| `id`                      | uuid    | ไม่  | PK                                                                                              |
| `order_id`                | uuid    | ไม่  | FK → `orders`                                                                                   |
| `variant_id`              | bigint  | ได้  | FK → `product_variants` สินค้าปกติต้องมี ส่วน custom ขึ้นกับว่าร้านนิยามหน่วยขายอย่างไร (Q-C06) |
| `item_kind`               | text    | ไม่  | `standard` หรือ `custom` (ข้อเสนอ)                                                              |
| `quantity`                | integer | ไม่  | จำนวน ต้อง > 0                                                                                  |
| `unit_price_minor`        | bigint  | ไม่  | ราคาต่อหน่วย ณ วันซื้อ                                                                          |
| `line_subtotal_minor`     | bigint  | ไม่  | = quantity × unit_price                                                                         |
| `snapshot_version`        | integer | ไม่  | เวอร์ชัน snapshot                                                                               |
| `product_snapshot`        | jsonb   | ไม่  | ชื่อ/SKU/ขนาด/ตัวเลือก custom ที่เปิดเผยได้ ณ วันซื้อ ไม่มีสูตรลับ                              |
| `rule_version_snapshot`   | text    | ได้  | เวอร์ชันกติกาที่ใช้แนะนำ (Q-C02)                                                                |
| `recommendation_snapshot` | jsonb   | ได้  | ผลแนะนำที่ร้านรับรอง ไม่มีวันเกิดดิบ รูปแบบยังไม่กำหนด                                          |

### `order_status_history` — ประวัติสถานะ

เพิ่มแถวอย่างเดียว ไม่แก้/ลบ · เปลี่ยนสถานะ `orders` และเพิ่มแถวนี้ในธุรกรรมเดียวกัน

| คอลัมน์         | ชนิด | Null | ความหมาย                                             |
| --------------- | ---- | ---- | ---------------------------------------------------- |
| `id`            | uuid | ไม่  | PK                                                   |
| `order_id`      | uuid | ไม่  | FK → `orders`                                        |
| `actor_user_id` | uuid | ได้  | ใครเป็นคนเปลี่ยน (FK → `auth.users`)                 |
| `actor_kind`    | text | ไม่  | พนักงาน/ลูกค้า/ระบบ กำหนดจาก server ไม่รับจาก client |
| `from_status`   | text | ได้  | สถานะก่อน                                            |
| `to_status`     | text | ไม่  | สถานะหลัง                                            |
| `reason`        | text | ได้  | เหตุผล (เป็นโน้ตภายในได้ หน้าลูกค้าต้องไม่แสดง)      |

### `payments` — ความพยายามชำระเงิน

หนึ่ง Order มีได้หลายครั้ง · คำถามค้าง: Q-M02 · ไม่เก็บข้อมูลบัตร

| คอลัมน์               | ชนิด        | Null | ความหมาย                                                 |
| --------------------- | ----------- | ---- | -------------------------------------------------------- |
| `id`                  | uuid        | ไม่  | PK                                                       |
| `order_id`            | uuid        | ไม่  | FK → `orders`                                            |
| `provider`            | text        | ไม่  | ผู้ให้บริการ (ยังไม่เลือก)                               |
| `environment`         | text        | ไม่  | `sandbox` / production (default `sandbox`)               |
| `request_key`         | text        | ไม่  | กันสร้างซ้ำ (unique)                                     |
| `provider_payment_id` | text        | ได้  | รหัสฝั่ง Provider (unique คู่กับ provider + environment) |
| `amount_minor`        | bigint      | ไม่  | ยอดที่เรียกเก็บ                                          |
| `currency`            | text        | ไม่  | สกุลเงิน                                                 |
| `status`              | text        | ไม่  | สถานะ Pending ตาม Provider                               |
| `verified_at`         | timestamptz | ได้  | เวลาตรวจ signature/ยอด/สกุลเงินผ่าน                      |
| `paid_at`             | timestamptz | ได้  | เวลาจ่ายสำเร็จที่ยืนยันแล้ว                              |

หน้า redirect กลับจาก Provider ไม่ถือว่า "จ่ายแล้ว"

### `private.payment_events` — event จาก Provider

เก็บเฉพาะ event ที่ตรวจ signature แล้ว กันประมวลผลซ้ำ

| คอลัมน์                        | ชนิด        | Null      | ความหมาย                                           |
| ------------------------------ | ----------- | --------- | -------------------------------------------------- |
| `id`                           | uuid        | ไม่       | PK                                                 |
| `payment_id`                   | uuid        | ได้       | FK → `payments` ว่างได้ถ้า event มาก่อนจับคู่      |
| `provider` / `environment`     | text        | ไม่       | ที่มาของ event                                     |
| `provider_event_id`            | text        | ไม่       | รหัส event (unique คู่กับ provider + environment)  |
| `event_type`                   | text        | ไม่       | ชนิด event                                         |
| `event_summary`                | jsonb       | ได้       | ข้อมูลที่ล้างแล้วเท่าที่จำเป็น ไม่เก็บ payload ดิบ |
| `processing_status`            | text        | ไม่       | ประมวลผลถึงไหน (ลองใหม่ได้เมื่อล้มเหลว)            |
| `received_at` / `processed_at` | timestamptz | ไม่ / ได้ | เวลารับ / เวลาประมวลผลเสร็จ                        |

---

## Promotion

### `promotions` — นิยามโปรโมชั่น

เริ่มจากชนิดเดียวที่ร้านรับรอง ไม่ใช่ rule engine · คำถามค้าง: Q-R01, Q-R02

| คอลัมน์                 | ชนิด        | Null | ความหมาย                                                          |
| ----------------------- | ----------- | ---- | ----------------------------------------------------------------- |
| `id`                    | uuid        | ไม่  | PK                                                                |
| `name`                  | text        | ไม่  | ชื่อโปรโมชั่น                                                     |
| `code`                  | text        | ได้  | โค้ดส่วนลด (unique) ว่างถ้าไม่ใช้โค้ด                             |
| `discount_kind`         | text        | ไม่  | ชนิดส่วนลด (เลือก 1 ชนิดก่อน)                                     |
| `discount_value`        | bigint      | ไม่  | ค่าส่วนลด หน่วยขึ้นกับ `discount_kind` (สตางค์ หรือ basis points) |
| `starts_at` / `ends_at` | timestamptz | ได้  | ช่วงเวลาใช้งาน                                                    |
| `is_active`             | boolean     | ไม่  | เปิดใช้หรือไม่ (default `false`)                                  |

### `order_promotions` — ส่วนลดที่ใช้จริง

PK = (`order_id`, `promotion_id`) · ข้อเสนอ: UNIQUE(`order_id`) = หนึ่ง Order ใช้ได้หนึ่งโปรโมชั่น

| คอลัมน์              | ชนิด   | Null | ความหมาย                   |
| -------------------- | ------ | ---- | -------------------------- |
| `order_id`           | uuid   | ไม่  | FK → `orders`              |
| `promotion_id`       | uuid   | ไม่  | FK → `promotions`          |
| `discount_minor`     | bigint | ไม่  | ส่วนลดที่คิดจริง           |
| `promotion_snapshot` | jsonb  | ไม่  | เงื่อนไขโปรโมชั่น ณ วันใช้ |

---

## Content

### `content_entries` — เนื้อหาเว็บ

หนึ่งแถวต่อ (`content_key`, `locale`) · คำถามค้าง: Q-T01, Q-T02, Q-T03 · ยังไม่มี draft แยกจากฉบับเผยแพร่

| คอลัมน์          | ชนิด        | Null | ความหมาย                                       |
| ---------------- | ----------- | ---- | ---------------------------------------------- |
| `id`             | uuid        | ไม่  | PK                                             |
| `content_key`    | text        | ไม่  | หน้า/ส่วน เช่น landing, contact, policy        |
| `locale`         | text        | ไม่  | ภาษา                                           |
| `schema_version` | integer     | ไม่  | เวอร์ชันโครงสร้างของ `content`                 |
| `content`        | jsonb       | ไม่  | เนื้อหา ตรวจรูปแบบตาม `content_key` ก่อนบันทึก |
| `is_published`   | boolean     | ไม่  | เผยแพร่หรือไม่ หน้าสาธารณะเห็นเฉพาะที่เผยแพร่  |
| `published_at`   | timestamptz | ได้  | เวลาเผยแพร่                                    |
| `updated_by`     | uuid        | ได้  | FK → `auth.users` ผู้แก้ล่าสุด                 |

---

## Conditional — สร้างเมื่อร้านรับรองเท่านั้น

| ตาราง                        | เงื่อนไข | ใช้ทำอะไร                                                                   | คอลัมน์หลัก                                                                                                                                               |
| ---------------------------- | -------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customer_addresses`         | Q-A03    | ที่อยู่ที่สมาชิกบันทึก Order ต้องคัดลอกลง `shipping_snapshot` ไม่อ้างแถวนี้ | `customer_id`, `label`, `address` (jsonb), `schema_version`                                                                                               |
| `wishlist_items`             | Q-A04    | รายการโปรดระดับสินค้า PK = (`customer_id`, `product_id`)                    | `customer_id`, `product_id`                                                                                                                               |
| `private.production_recipes` | Q-C05    | สูตรผลิตลับ หนึ่ง order_item ต่อหนึ่งสูตรปัจจุบัน ห้ามเปิดให้หน้าร้านเห็น   | `order_item_id` (unique), `revision`, `recipe_definition` (jsonb), `prepared_by`                                                                          |
| `shipments`                  | Q-O03    | เลขพัสดุ หนึ่ง Order ต่อหนึ่งพัสดุ กรอกเอง                                  | `order_id` (unique), `carrier`, `tracking_number`, `status`, `shipped_at`, `delivered_at`                                                                 |
| `private.refunds`            | Q-O05    | คืนเงิน ยอดรวมที่คืนต้องไม่เกินยอดที่ยืนยันว่าจ่ายแล้ว                      | `payment_id`, `request_key` (unique), `provider_refund_id`, `amount_minor`, `currency`, `status`, `reason`, `requested_by`, `requested_at`, `verified_at` |

---

## สิ่งที่เอกสารนี้ไม่ได้ทำ

- ภาคผนวกนี้สรุปข้อเสนอ feature จาก DBML เท่านั้น; ผลตรวจ Core จริงอยู่ส่วนต้นของ dictionary ไม่ถือว่าภาคผนวกผ่าน SQL/HTTP แล้ว
- ชื่อคอลัมน์/ชนิดเป็นข้อเสนอฐาน เจ้าของตารางออกแบบคอลัมน์เพิ่มเองได้ตามกติกาใน [db-integration-outline.md](db-integration-outline.md) แต่การเปลี่ยน PK/FK, หน่วยเงิน หรือความหมายของ status ต้อง review กับผู้ใช้งานตารางก่อน
- ยังไม่ได้ทำ RLS/grants ต่อตาราง ต้องออกแบบพร้อม migration ของแต่ละ feature (session/role/ownership ต้องตรวจใน server operation)
