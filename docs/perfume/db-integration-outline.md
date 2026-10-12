# DB integration outline — จุดเชื่อมกลางสำหรับสมาชิก 4 คน

ปรับปรุง 11 ตุลาคม 2026 · Core applied after independent scrutiny PASS. Core SQL/[data dictionary](data-dictionary.md) define actual fields; DBML business columns remain Proposed/Pending. Owners design internal columns; shared changes require consumer review.

[DBML แบบย่อ](schema-integration-outline.dbml) · [แบบละเอียดอ้างอิง](schema-proposal.dbml) · [คำถามธุรกิจที่ยังต้องรับรอง](db-open-questions.md)

นำ DBML แบบย่อทั้งไฟล์ไปวางใน dbdiagram เช่นเดียวกับชุดก่อน มี **26 ตารางและ 29 FK จุดเชื่อมเดิม** สีฟ้าเป็นฐานที่เสนอ สีส้ม 5 ตารางเป็น Conditional สีเทา auth.users เป็น reference ที่ Supabase จัดการเอง ไม่สร้างซ้ำ

## อ่านอย่างไร

- **คอลัมน์ที่วาด:** keys, ownership, identity, หน่วยเงิน, state/version และ purchase snapshots ที่มีผลต่อ feature อื่น เป็น baseline สำหรับทีมตกลง ไม่ใช่ schema ที่ apply ได้เลย
- **Note ของแต่ละ table:** Owner, Consumer/Partner, Shared และ Owner designs ระบุสิ่งที่ส่งต่อกับสิ่งที่เจ้าของออกแบบเพิ่ม
- **คอลัมน์ที่ไม่วาด:** ไม่ได้แปลว่าไม่จำเป็นหรือ nullable เจ้าของต้องเพิ่มก่อน implementation เช่นชื่อสินค้า เนื้อหา รูป timestamps และรายละเอียดราคาย่อย
- **JSONB ที่เหลือในภาพ:** ใช้เพื่อบอกขอบเขต snapshot เท่านั้น ไม่ใช่เปิดให้ใส่ key อะไรก็ได้ สมาชิกผู้ส่ง/ผู้รับต้องตกลง schema version, fields, validation และข้อมูลที่เปิดเผยร่วมกัน
- **status/role/discount_kind:** ไม่กำหนด vocabulary หรือ transitions แทนร้าน; state machine และสิทธิ์ยังต้องรับรอง

แผนภาพนี้ใช้คุยเรื่อง physical relationships แต่การเชื่อมโค้ดให้ใช้ feature exports/operations ที่ตกลง ไม่ให้ทุกคนอ่านตาราง/แก้แถวของ feature อื่นโดยตรง

## สิทธิ์ในการออกแบบเพิ่ม

### Core migration boundary — ยืนยันขอบเขต 11 ตุลาคม 2026

เป้าหมายที่ผู้ใช้ยืนยันคือสร้างจุดเชื่อม Catalog/Order ชุดเดียวก่อน เพื่อไม่ให้ feature owners สร้างตารางซ้ำหรือกำหนด FK ไม่ตรงกัน ไม่ใช่รับรอง business schema ทั้ง 26 ตาราง

- Core scope: `customers`, `products`, `product_variants`, `orders`, `order_items`, `payments`; ใช้ `private.staff_members` จาก migration เดิม ไม่สร้างซ้ำ
- Shared relationships: `product_variants.product_id → products.id`, `orders.customer_id → customers.id`, `order_items.order_id → orders.id`, `order_items.variant_id → product_variants.id`, `payments.order_id → orders.id`. Core types match approved PKs; all FKs use RESTRICT; only variant_id is nullable. Concrete SQL requires independent scrutiny before apply
- Catalog และ Order เชื่อมกันใน Core รอบเดียว ไม่เลื่อน `product_variants`/`order_items` ไปสร้างแยกโดยแต่ละ feature owner
- ID types confirmed: `products.id` และ `product_variants.id` ใช้ `bigint` เลขรันจาก DB; `customers.id`, `orders.id`, `order_items.id`, `payments.id` ใช้ UUID. คอลัมน์ที่อ้าง `auth.users.id` คง UUID
- FK types follow referenced PKs: `product_variants.product_id` และ `order_items.variant_id` ใช้ `bigint`; FK ที่อ้าง Customer/Order ใช้ UUID. UUID defaults use DB gen_random_uuid(); new API contracts send bigint IDs as decimal strings without Number conversion
- Proposed `products.slug` เป็นชื่อสำหรับ URL; Proposed `product_variants.sku` เป็นรหัสหน่วยขายสำหรับงาน Catalog/Order. ทั้งสองแยกจาก PK และไม่ใช้แทน FK; ยังไม่มีคอลัมน์เหล่านี้ใน thin Core ให้ Catalog owner เพิ่มหลัง review
- Purchase eligibility confirmed: ต้องสมัครสมาชิกก่อนซื้อ ไม่รองรับ Guest checkout. การตรวจ session/identity และการลบหรือปกปิดข้อมูลสมาชิกยังต้องกำหนดร่วมกับ access/retention contract
- Catalog cardinality confirmed: Product หนึ่งตัวมีหลาย Variant ได้; Variant แต่ละตัวอ้าง Product หนึ่งตัว
- Payment attempts: สมาชิก 4 เจ้าของ Checkout/Payment เสนอจำนวน attempts, retry และ lifecycle; cardinality/unique constraints ที่กระทบ Core ยังต้อง review ก่อนกำหนด ห้ามถือว่ารอบนี้รับรอง one-to-one หรือ one-to-many แล้ว
- History preservation confirmed: การลบสมาชิก, Product หรือ Variant ต้องไม่ลบประวัติ Order/Payment ตามไปด้วย รวมถึง Order Items และ commercial snapshots ที่ใช้แสดงประวัติการขาย; ห้าม cascade จาก Auth/Customer/Catalog มาทำลายประวัติเหล่านี้
- Catalog deletion: สมาชิก 1 เจ้าของ Catalog เสนอวิธี archive/deletion ภายใต้กติกาคงประวัติ; ผลต่อ FK และ snapshots ต้อง review กับสมาชิก 4. สมาชิก 3 เสนอวิธี account deletion/anonymization ร่วมกับสมาชิก 4; FK nullability/delete behavior และ retention ของข้อมูลส่วนตัวยัง Pending ไม่ถือว่ารับรองให้เก็บ PII ทุกชนิดตลอดไป
- Custom sellable model delegated by user: สมาชิก 3 เจ้าของ Custom ออกแบบขนาด/ขวด/หน่วยขาย และ review กับสมาชิก 1 เมื่อใช้ Product/Variant และสมาชิก 4 สำหรับ Order/quote/snapshot integration. ไม่สร้าง Variant ปลอมหรือสมมติว่าทุกรายการ Custom มี/ไม่มี Variant
- Custom integration remains Pending: Core leaves `order_items.variant_id` nullable; owners review item-kind constraints and Custom snapshots before feature activation. nullable ไม่อนุมัติ Standard checkout ที่ไม่มี Variant หรือ default อื่นของ DBML
- Core creation มี migration ชุดเดียวที่สมาชิก 3 ประสานลำดับ; สมาชิก 1 review Catalog, สมาชิก 3 review Customer/access และสมาชิก 4 review Order/Payment ตาม ownership เดิม
- หลัง Core พร้อม owner เพิ่มคอลัมน์/ตารางของ feature ผ่าน migration ต่อจาก Core ไม่สร้าง Core tables หรือ FK เดิมซ้ำ; shared contract changes ต้อง review กับ consumers ตามตารางด้านล่าง
- ผู้ใช้อนุมัติ apply Core หลัง independent scrutiny ผ่านและตรวจ target ตรง; ไม่รับรองราคา/ภาษี/status/Custom model/feature policies และไม่อนุมัติ commit, push, deploy หรือ feature activation

| เปลี่ยนอะไร                                                                                                  | ทำอย่างไร                                                                                        |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| เพิ่มชื่อ รายละเอียด รูป sort order audit timestamp หรือข้อมูลเฉพาะ feature                                  | Owner ออกแบบใน feature ของตนตาม requirement ที่รับรอง พร้อม reviewer และ migration ของตน         |
| เพิ่มตารางภายใน feature โดยไม่เปลี่ยนข้อมูลที่คนอื่นรับ                                                      | Owner เสนอ physical model/review แล้วประสานลำดับ migration; ไม่ต้องเพิ่ม generic framework       |
| เปลี่ยน PK/FK type/name/nullability, unique key หรือจำนวนความสัมพันธ์                                        | ตกลงกับเจ้าของตารางที่อ้างและคนที่ใช้งานก่อน เปลี่ยน diagram/contracts/callers/checks ในงานเดียว |
| เปลี่ยนบาทเป็นสตางค์, currency, quantity unit, status meaning, snapshot result shape หรือ publication/access | เป็น shared contract change ต้อง review กับ consumers แม้ FK ไม่เปลี่ยน                          |
| เพิ่มสูตร ราคา ข้อห้าม หรือวิธีเก็บวันเกิด                                                                   | รับรองกับร้านก่อน ตามคำถามเดิม ไม่ถือว่าการอนุญาตออกแบบคอลัมน์คืออนุญาตเดากติกา                  |
| เพิ่มข้อมูลที่ลูกค้าดูได้ใน projection                                                                       | ตรวจ privacy/access ทุกครั้ง; public table ไม่ได้แปลว่าเปิดอ่านทุก column                        |

ไม่ใช้ generic `extra_data jsonb` ทุก table เพื่อแก้ปัญหา schema conflict รายละเอียดที่ต้อง query/validate มี explicit columns ส่วน JSON ใช้เฉพาะ validated snapshot/content ที่จำเป็น

## ใครดูแลตารางไหน

| เจ้าของหลัก | ตาราง                                                                                                                                                           | ออกแบบต่อเรื่องอะไร                                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| สมาชิก 1    | products, product_translations, product_variants, categories, category_translations, product_categories, product_images, promotions                             | ชื่อ/รายละเอียด/ขนาด/รูป/taxonomy/เงื่อนไขส่วนลดตามร้าน; ส่ง catalog และ promotion operations ให้ 4; projection ให้ 2       |
| สมาชิก 2    | content_entries; wishlist_items เมื่อรับรอง                                                                                                                     | Content schema/TH+EN/publication, wishlist UI/data; รับ customer identity จาก 3 และ product identity จาก 1                  |
| สมาชิก 3    | customers, private.staff_members, custom_options, custom_option_translations; customer_addresses/private.production_recipes เมื่อรับรอง                         | Profile/access, Custom options/constraints, saved address/สูตร private; ส่ง customer/access/custom contract ให้ 4           |
| สมาชิก 4    | orders, order_items, order_item_custom_options, order_status_history, payments, private.payment_events, order_promotions; shipments/private.refunds เมื่อรับรอง | Commercial snapshots/totals/order/payment/fulfillment และ transaction; ส่ง order/history/payment facts ที่มีสิทธิ์ให้ 1/2/3 |
| Supabase    | auth.users                                                                                                                                                      | Managed Auth เท่านั้น สมาชิก 3 ประสาน integration ไม่สร้างหรือแก้ managed schema                                            |

**ตารางเชื่อมไม่ให้มีผู้เขียนสองชุด:** สมาชิก 4 เป็นผู้ persist order_item_custom_options/order_promotions ใน Order transaction; สมาชิก 3 นิยาม Custom selection และสมาชิก 1 นิยามโปรโมชั่น ต้อง review snapshot/validation กับคู่ของตนก่อนเขียน

การแบ่ง ownership ไม่รับรองชั่วโมงเท่ากัน ทุกคนมี named reviewer และช่วยกันได้เมื่อมีขอบเขตไฟล์ชัด สมาชิก 3 ประสาน migration sequencing/generated types ไม่ต้องเขียนทุก query ให้ทีม

## จุดเชื่อมที่ต้องส่งให้กัน

| ผู้ส่ง → ผู้รับ | ตกลงก่อนต่อ                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1 → 4           | Product/Variant IDs, SKU, quantity unit, server price/currency/availability, promotion eligibility/amount/errors                    |
| 3 → 4           | Customer identity/access, custom option IDs, valid configuration/size, quote or quote-request result และ summary/version ที่ปลอดภัย |
| 4 → 3           | Own-order list/detail projection, states/time และ safe item summaries; ห้ามอ่าน private payment payload/recipe                      |
| 4 → 1           | Verified payment/refund/order facts ตามนิยามรายงาน ไม่ส่งยอดจาก browser                                                             |
| 1/3/4 → 2       | Catalog card display, session display และ cart display API; UI visibility ไม่แทน authorization                                      |
| 2 → ทุกคน       | Shared UI/tokens/locale conventions; เนื้อหาผ่าน approved localized content projection                                              |

ID อย่างเดียวไม่พอ ต้องระบุ input/result/errors และ success/invalid/denied/failed examples ที่เกี่ยวข้อง แต่ไม่ต้องล็อกรายละเอียด implementation ภายในทุก feature เพื่อเริ่มทำงาน

## ข้อกำหนดที่ยังต้องรักษา แม้ลดคอลัมน์ในภาพ

- เงินไม่ใช้ float; final prices/totals คิดบน server; currencies/หน่วยตรงกัน; quantity เป็นจำนวนหน่วยขาย
- Commercial snapshots ไม่เปลี่ยนตามสินค้าหรือ profile ที่แก้ภายหลัง; internal shape ต้อง validate/version และไม่เก็บ raw DOB/สูตรลับใน public summary
- Order+items+Custom choices+ส่วนลด+history persist ใน transaction เดียว มี owner/payload-scoped idempotency
- Payment events ต้อง verified/deduplicated และ transition กัน fulfillment ซ้ำ; refund ไม่เท่ากับ cancellation และยอดคืนรวมไม่เกินยอดจ่ายที่ยืนยัน
- Guest order access ต้อง verified/scoped; email/order number ไม่ใช่สิทธิ์; สมาชิกอ่านเฉพาะของตน; staff roles จาก trusted storage
- RLS/grants/exposed schemas/server authorization ต้องออกแบบและทดสอบก่อนใช้จริง; private schema ต้องไม่ expose และ service key ไม่อยู่ใน browser
- Archive referenced catalog/promotions; อย่า cascade ลบประวัติการเงินจากบัญชีที่ลบ; retention/anonymization ต้องตกลง
- Standard item ต้องมี Variant; Custom options ใช้กับ Custom item เท่านั้น; constraints/ราคา Custom จริงยัง Pending

ในชุดย่อเพิ่ม `UNIQUE(order_id)` ของ order_promotions ให้สะท้อน one-promotion baseline ที่ Note ชุดละเอียดระบุไว้แล้ว ถ้าร้านต้อง stacking ต้องแก้ constraint และ contract ร่วมกันก่อนใช้ เป็นรายละเอียดของ proposal ไม่ใช่ constraint ที่ apply แล้ว

## ก่อนส่งงานให้คนอื่นต่อ

แต่ละคนส่ง physical schema ของ feature + validated public/server contract + migration dependencies + ตัวอย่าง input/output ที่รับรอง + access/acceptance checks ให้ reviewer ตรวจ สมาชิก 3 รวมลำดับ migrations แล้ว generate types จาก schema จริง ห้าม hand-edit generated types. Core apply ได้รับอนุมัติและเสร็จแล้ว; feature migrations ต่อไปต้องมี authorization ของตนเอง

ชุดย่อไม่แทน full proposal ด้วย migration ที่มีแค่คอลัมน์ในภาพ และ full proposal ก็ยังเป็น draft ไม่ใช่ข้อบังคับให้ Owner ใช้ทุกคอลัมน์เหมือนตัวอย่าง

## การตรวจ

ตอนสร้างชุดย่อ Structural assertions ผ่าน: คง 26 tables, 29 FK references/cardinality/type/nullability และ 6 groups จากชุดละเอียด; ลด 183 เป็น 111 columns; Owner/Consumer หรือ Partner/Shared/Owner designs ครบทุก table ที่ทีมดูแล; local links ผ่าน โดยไม่ได้แก้ full DBML ในรอบสร้าง outline

รอบแก้ syntax สีวันที่ 5 ตุลาคม 2026 เปลี่ยนทั้งสองไฟล์เป็น `headercolor: #2563EB` ไม่มี quote ตาม [DBML Colors](https://dbml.dbdiagram.io/syntax/enrichment-visualization/#colors) ผ่าน parser `@dbml/core@10.2.0` ทั้ง `dbml` และ `dbmlv2` โดยยังมี 26 tables และ 29 FK ต่อไฟล์ ดู [parser check](../../scripts/dbml.check.cjs) ไม่เพิ่ม dependency ในโปรเจกต์

ไม่มี SQL/RLS/HTTP/payment/browser acceptance การผ่าน parser ไม่พิสูจน์ database runtime หรือ browser layout
