# Checklist: ทำ theme และ design system แรกของ Perfume

สำหรับคนที่รับดูแลหน้าตาเว็บ งานคือ**เลือกค่ากลาง (สี, font, ขนาด, ระยะ) แล้วทำให้คนอื่นหยิบไปใช้ผ่าน component ได้** เช่น กำหนดสีปุ่มหลักครั้งเดียว ทุกคนใช้ `<Button>` แล้วได้สีนั้นเอง

ไม่เข้าใจขั้นไหน ดูคำอธิบายพร้อมตัวอย่างจากหน้าจริงที่ [เอกสารอธิบาย](design-system-walkthrough.md)

## ขอบเขตที่ตกลงแล้ว (6 ต.ค. 2026)

- Figma ใช้ทำ wireframe เท่านั้น หน้าตาจริงและ component ทำในโค้ด
- ค่าที่มีอยู่ใน repo ตอนนี้เป็นตัวอย่างตั้งต้น ไม่ต้องยึดตาม เสนอทิศทางของตัวเองได้
- **ผู้เริ่มโปรเจกต์**เป็นคนสรุปเมื่อทีมเห็นไม่ตรงกัน และเป็นคนอนุมัติ Draft 1
- คนดูแล design system ดูแล token, component กลาง, layout กลาง และหน้า UI Kit ส่วนกติกาธุรกิจ ข้อมูล และ validation ของแต่ละหน้าเป็นของเจ้าของ feature
- รอบนี้ยังไม่ทำหลาย theme, package กลาง หรือ component library ใน Figma

---

## ช่วงที่ 1: ไปถึง Draft 1

เป้าหมายคือ**ชื่อ** token, ชื่อ role และ props ของ component นิ่งพอให้ dev คนอื่นเริ่มใช้ได้ ส่วน**ค่า**ยังเป็น Proposed และปรับต่อได้

- [ ] **1. ดูของที่มีอยู่** รัน `pnpm dev` แล้วเปิด `/th/ui-kit` คู่กับ `/th` ดูว่ามี component อะไร และ token ถูกใช้ที่ไหนบ้าง → [อธิบาย §1](design-system-walkthrough.md#1-token-เดินทางจาก-css-ถึงหน้าเว็บยังไง-ขั้น-1-4)
- [ ] **2. จดสิ่งที่หน้าที่ได้รับต้องใช้** เช่น heading, ข้อความ, ปุ่ม, card, state loading/error ของแต่ละหน้า เรื่องที่ wireframe ไม่ได้บอก ให้ถามเจ้าของ feature
- [ ] **3. เสนอทิศทาง 1–2 แบบ** ใช้ reference และตัวอย่างเล็กๆ อธิบายเหตุผลว่าทำไมผู้ใช้อ่านง่ายหรือเห็นปุ่มหลักชัด → ทีมเลือกหนึ่งแบบ
- [ ] **4. สีหลัก** กำหนด `--primary` คู่กับ `--primary-foreground` (สีข้อความบนพื้นสีหลัก) ใน `src/app/globals.css` แล้วดูบนปุ่มจริงว่าอ่านออกทั้งตอนปกติและตอน hover
- [ ] **5. สีที่เหลือ** ได้แก่ พื้นหลัง, ข้อความหลัก, ข้อความรอง, เส้นขอบ, error และ focus ring ก่อนเปลี่ยน ให้เช็คก่อนว่าแต่ละ token ถูกใช้ที่ไหน → [อธิบาย §2](design-system-walkthrough.md#2-เปลี่ยน-token-หนึ่งตัว-กระทบที่ไหนบ้าง-ขั้น-4-5)
- [ ] **6. Font** เลือก font พร้อม fallback ตรวจทั้งภาษาไทยและอังกฤษ ถ้าเป็น font ใหม่ ต้องตกลงเรื่องแหล่งไฟล์และสิทธิ์การใช้ก่อน (การเขียนชื่อ font ใน CSS ไม่ได้โหลด font ให้)
- [ ] **7. ขนาดตัวอักษรและชื่อ role** กำหนด size / weight / line-height ของ page title, section title, body, label, caption แล้วตั้งชื่อ role ใน `globals.css` → [อธิบาย §3–4](design-system-walkthrough.md#3-ค่าแต่ละตัวควรอยู่ที่ไหน-ขั้น-7-8-10)
- [ ] **8. ระยะห่าง มุมโค้ง เงา** ใช้ Tailwind scale เดิมได้ แต่ต้องเขียนกติกาไว้ เช่น "field ห่างกัน `gap-4`, card ใช้ `p-6`, ปุ่มใช้ `rounded-md`"
- [ ] **9. กรอกตารางบันทึกค่า** ([ตารางด้านล่าง](#ตารางบันทึกค่า)) ทุกแถวต้องมีสถานะ Proposed หรือ Approved
- [ ] **10. ปรับ component และ UI Kit** แก้ไฟล์ใน `src/shared/ui/` ให้ใช้ค่าใหม่ และให้หน้า UI Kit แสดงสี, role และ component ครบ ก่อนเปลี่ยน props ให้ตรวจก่อนว่าใครใช้อยู่บ้าง → [อธิบาย §5](design-system-walkthrough.md#5-เพิ่ม-component-ใหม่ต้องทำอะไรบ้าง-ขั้น-10)
- [ ] **11. `pnpm check` และ `pnpm build` ผ่าน** (check จะล้มถ้า component ไม่มี demo ใน UI Kit หรือข้อความมีไม่ครบทั้ง th/en)
- [ ] **12. ส่ง Draft 1** ให้ผู้เริ่มโปรเจกต์ดูหน้า UI Kit และตารางบันทึกค่า เมื่ออนุมัติแล้ว:
  - เปลี่ยนข้อความ `kit.reference.baseline` ใน `messages/th/common.json` และ `messages/en/common.json` เป็น `Draft 1 · ใช้ประกอบหน้าได้ ค่ายังปรับได้` / `Draft 1 · ready to build with, values may change`
  - ประกาศในทีมตาม [รูปแบบประกาศ](#รูปแบบประกาศ)

### Draft 1 แปลว่าอะไรสำหรับ dev

ป้ายบนหัวหน้า UI Kit คือสถานะ ถ้ายังเป็น "Baseline" แปลว่ายังไม่พร้อม พอเป็น "Draft 1" dev เริ่มประกอบหน้าคู่ขนานได้ โดยใช้กติกา 4 ข้อนี้:

1. ใช้เฉพาะ class และ component ที่มีในหน้า UI Kit
2. ห้ามใส่รหัสสีหรือขนาดตรงๆ เช่น `#191817` หรือ `text-[15px]` ใช้ชื่อแทนเสมอ เช่น `bg-primary` หรือชื่อ role
3. ถ้าต้องใช้อะไรที่ UI Kit ยังไม่มี ให้ขอคนดูแล design system ห้ามสร้าง component เองในหน้าของตัวเอง
4. หลัง Draft 1 คนดูแลเปลี่ยน**ค่า**ได้ตลอด หน้าของ dev จะเปลี่ยนตามเอง แต่ถ้าจะเปลี่ยน**ชื่อ** ต้องประกาศก่อน

---

## ช่วงที่ 2: หลัง Draft 1

- [ ] **13. ใช้กับหน้าจริงหนึ่งหน้า** แนะนำ landing page เพราะมี pattern ที่ควรเป็น role อยู่แล้ว → [อธิบาย §3](design-system-walkthrough.md#3-ค่าแต่ละตัวควรอยู่ที่ไหน-ขั้น-7-8-10)
- [ ] **14. ทีมรีวิว** ทั้ง UI Kit และหน้าจริง จด feedback และข้อสรุป
- [ ] **15. Dev อีกคนลองใช้** ประกอบส่วนหนึ่งของ feature ตัวเองโดยไม่ก๊อป component และไม่ใส่รหัสสีเอง แล้วแจ้งจุดที่ติด
- [ ] **16. ตรวจในเบราว์เซอร์** ดูทั้ง TH/EN, จอแคบ/กว้าง, ข้อความยาว, keyboard/focus และ hover/disabled/error ก่อนตรวจให้ผู้เริ่มโปรเจกต์เลือกวิธี (ใช้ browser tool / checklist / ข้าม) ถ้าเลือกข้าม ข้อนี้ยังไม่ผ่าน
- [ ] **17. ปรับค่าให้เป็น Approved แล้วขยายไปหน้าอื่น** ทุกหน้าใช้ component และ role ชุดเดียวกัน ไม่มี component ที่ก๊อปไปแก้แยกในแต่ละหน้า

---

## ตารางบันทึกค่า

| รายการ | ค่าที่เลือก | ใช้ผ่าน | สถานะ |
|---|---|---|---|
| สีหลัก + สีข้อความบนสีหลัก | | `bg-primary text-primary-foreground` | Proposed |
| พื้นหลัง + ข้อความหลัก | | `bg-background text-foreground` | Proposed |
| ข้อความรอง, เส้นขอบ, error, focus | | `text-muted-foreground`, `border-border`, `text-destructive`, `:focus-visible` | Proposed |
| Font + fallback | | `body` ใน `globals.css` | Proposed |
| Page title / section title | | ชื่อ role ที่ตั้งในขั้น 7 | Proposed |
| Body / label / caption | | ชื่อ role ที่ตั้งในขั้น 7 | Proposed |
| ระยะใน field และ card | | `gap-*`, `p-*` + component กลาง | Proposed |
| มุมโค้ง / เส้นขอบ / เงา | | `rounded-*` + component กลาง | Proposed |

## รูปแบบประกาศ

```text
Design system: Draft 1 (หรือ Final)
UI Kit: /th/ui-kit
สิ่งที่เปลี่ยน: <token / role / component ที่เปลี่ยน>
ชื่อที่ใช้ได้: <ชื่อ role และ props ใหม่>
ยังเป็น Proposed: <รายการที่ค่ายังอาจเปลี่ยน>
ผลตรวจ: pnpm check / build ผ่าน · browser: <ผ่าน / ยังไม่ได้ตรวจ>
```

## ข้อห้าม

- ห้ามก๊อป Button หรือ component อื่นไปแก้ใน feature ให้แก้ที่ `src/shared/ui/` ตัวเดียว
- ห้ามใช้ shadcn CLI เขียนทับ component เดิมโดยไม่ตรวจ diff, imports และ accessibility
- Button ไม่มี `loading` prop ให้ใช้ `disabled` + `aria-busy` + icon แบบใน UI Kit ถ้าจะเพิ่ม prop ต้องตกลงกับทีมก่อน
- Dialog/Sheet ต้องมี title, description และ `closeLabel` ที่แปลแล้ว
- ห้ามลบ focus ring หรือการรองรับ reduced-motion
- ห้ามเพิ่ม dependency หรือแก้ config/lockfile เพื่อแก้เรื่องที่ของเดิมทำได้อยู่แล้ว
- ข้อความ, ราคา หรือข้อมูลสินค้าที่ยังไม่อนุมัติ ให้ใช้ placeholder ห้ามเดา

การติ๊ก checklist นี้เป็นแค่การบันทึกความคืบหน้า ไม่ได้อนุญาตให้ commit, push หรือ deploy
