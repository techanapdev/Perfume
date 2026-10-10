# อธิบาย design system ผ่านโค้ดจริง

เอกสารนี้อธิบายว่า token และ component ใน repo ทำงานยังไง โดยยกตัวอย่างจาก UI Kit และ landing page ใช้คู่กับ [Checklist](design-system-onboarding.md) ซึ่งบอกว่าต้องส่งอะไร แต่ละหัวข้ออ้างเลขขั้นใน checklist ไว้

> ค่าและชื่อ class ที่ติดป้าย "Proposed" เป็นตัวอย่างประกอบคำอธิบาย ยังไม่ใช่ค่าที่ทีมรับรอง

## 0. เปิดดูอะไร

รัน `pnpm dev` แล้วเปิดสองหน้าคู่กัน:

- `/th/ui-kit`: หน้าอ้างอิง แสดง token, ตัวอักษร, ระยะ และ component ทุกตัว
- `/th`: landing page หน้าจริงที่ใช้ token และ component ชุดเดียวกัน

| ไฟล์ | เก็บอะไร |
|---|---|
| [`src/app/globals.css`](../../../src/app/globals.css) | ค่า token (`:root`) และการแปลงเป็น class (`@theme inline`) |
| [`src/shared/ui/`](../../../src/shared/ui/) | Component กลาง เช่น `button.tsx`, `card.tsx` |
| [`src/shared/ui/ui-kit-*.tsx`](../../../src/shared/ui/) | หน้า UI Kit แยกตาม section |
| [`landing-preview.tsx`](../../../src/features/content/components/landing-preview.tsx) | Landing page |

## 1. Token เดินทางจาก CSS ถึงหน้าเว็บยังไง (ขั้น 1, 4)

ตัวอย่าง `bg-secondary` ที่เป็นพื้นของ hero ใน landing:

```text
globals.css :root          globals.css @theme inline              landing-preview.tsx
--secondary: #eeeae4   →   --color-secondary: var(--secondary) →  className="bg-secondary"
```

`@theme inline` คือสิ่งที่ทำให้ Tailwind สร้าง class `bg-secondary` ขึ้นมา หน้าเว็บจึงไม่ต้องรู้รหัสสีเลย รู้แค่ชื่อหน้าที่ของสี ถ้าเปลี่ยนรหัสสีที่ `:root` จุดเดียว ทุกที่ที่ใช้ class นั้นจะเปลี่ยนตาม

## 2. เปลี่ยน token หนึ่งตัว กระทบที่ไหนบ้าง (ขั้น 4, 5)

ก่อนเปลี่ยน token ต้องรู้ว่ามันถูกใช้ที่ไหนบ้าง ตัวอย่าง `--secondary` (ตรวจจาก source วันที่ 6 ต.ค. 2026):

| จุดที่เปลี่ยนตาม | มาจาก |
|---|---|
| พื้น hero ของ landing | `landing-preview.tsx` → `bg-secondary` |
| เมนูที่เลือกอยู่ใน admin | `admin-shell.tsx` → `bg-secondary` |
| Badge ทุกตัว | `badge.tsx` |
| Button `secondary` และ hover ของ `outline`/`ghost` | `button.tsx` |
| ปุ่มปิด Dialog ตอน hover | `dialog.tsx` |
| รายการที่ highlight ใน Select | `select.tsx` |
| สีพื้นตอนลากเลือกข้อความ | `globals.css` → `::selection` |
| `accent` ทั้งหมด | `@theme inline` → `--color-accent: var(--secondary)` |

ดังนั้นสีใหม่ต้องอ่านข้อความบนพื้นนั้นได้ (`text-secondary-foreground`) และยังมองเห็นเมื่อเป็น hover บนพื้นขาว หาจุดที่ใช้เองได้ด้วย `grep -rn "secondary" src`

## 3. ค่าแต่ละตัวควรอยู่ที่ไหน (ขั้น 7, 8, 10)

ทุกค่าในหน้าเว็บอยู่ในหนึ่งในสามระดับนี้:

| ระดับ | เก็บที่ | ตัวอย่าง |
|---|---|---|
| **Token** | `globals.css` | สี, font, radius, typography role |
| **Component / variant** | `src/shared/ui/` | หน้าตาปุ่ม, padding ของ Card |
| **ของหน้านั้น** | ไฟล์ของ feature | grid 3 คอลัมน์, ความสูง hero |

**หลักตัดสิน:** ถ้าค่าเดียวกันใช้ซ้ำตั้งแต่ 2 ที่ขึ้นไปและมีความหมายเดียวกัน ควรเป็น token หรือ component ถ้าใช้ที่เดียว ปล่อยไว้ในหน้าได้

ตัวอย่างจาก `landing-preview.tsx`:

| ที่เจอในโค้ด | ควรอยู่ระดับ | เหตุผล |
|---|---|---|
| ป้ายตัวเล็กเหนือหัวข้อ `text-xs tracking-[0.2em] uppercase` ใน `HeroSection` และ `tracking-[0.15em]` ใน `CollectionSection`, `CustomSection` | Token (typography role) | pattern เดียวกันใช้ 3 ที่ แต่ระยะตัวอักษรไม่เท่ากัน ซึ่งเป็นอาการของการไม่มีค่ากลาง ค่าจะค่อยๆ เพี้ยนโดยไม่มีใครตั้งใจ |
| หัวข้อ section `text-3xl sm:text-4xl` ใน `CollectionSection`, `CustomSection` | Token (typography role) | ใช้ซ้ำ และตรงกับ h1 ของหน้า UI Kit |
| ข้อความอธิบาย `text-sm leading-8 text-muted-foreground` ใน `CollectionSection`, `CustomSection` (ส่วน `HeroSection` ใช้ `leading-7`) | Token (typography role) | body/caption ที่ใช้ซ้ำ |
| `<Button variant="outline" className="rounded-none border-foreground bg-background/80">` ใน `HeroSection` | ต้องตัดสินใจร่วมกับทีม | หน้ากำลังเขียน class ทับหน้าตาของ component กลาง ถ้าปุ่มเหลี่ยมขอบเข้มเป็นภาษาภาพของแบรนด์ ให้ย้ายไปไว้ใน `button.tsx` ถ้าใช้ที่เดียว ปล่อยไว้ในหน้าได้ ก่อนแก้ต้องตรวจ callers |
| ความสูง hero `min-h-[34rem] sm:min-h-[42rem]` ใน `HeroSection` | ของหน้านั้น | ขึ้นกับ layout ของหน้านี้เท่านั้น |

ในโค้ดมี comment `ponytail:` เหนือ `LandingPreview` และ comment เหนือ `HeroSection` กำกับจุดเหล่านี้ไว้ เมื่อทำขั้น 7 เสร็จ ให้แทนค่าที่เขียนตรงๆ ด้วยชื่อ role แล้วลบ comment ออก

โลโก้ใน `store-shell.tsx` ใช้ `tracking-[0.14em]` อีกค่าหนึ่ง ต้องตัดสินใจแยกว่าควรใช้ role เดียวกับป้ายตัวเล็กหรือไม่

## 4. ตัวอย่าง typography role (ขั้น 7, 9)

Role หนึ่งตัวไม่ได้มีแค่ขนาด ต้องกำหนด size, weight และ line-height ไปด้วยกัน โดยเฉพาะภาษาไทยที่มีสระและวรรณยุกต์ ค่าเริ่มต้นสำหรับลองเสนอ (Proposed):

| Role | Size | Weight | Line-height |
|---|---|---|---|
| Page title | 32–48 px ตามความกว้างจอ | 600 | 1.25 |
| Section title | 24 px | 600 | 1.35 |
| Body | 16 px | 400 | 1.6 |
| Label / ข้อความบนปุ่ม | 14 px | 500 | 1.5 |
| Caption | 12 px | 400 | 1.5 |

วิธีตั้งชื่อ role ใน `globals.css`: ใส่ค่าใน `:root` แล้วเพิ่ม `--text-<ชื่อ>` ใน `@theme inline` Tailwind จะสร้าง class `text-<ชื่อ>` ให้ ค่าที่ต่อท้ายด้วย `--line-height` หรือ `--letter-spacing` จะติดไปกับ class นั้นด้วย ส่วนความหนาให้ใช้ `font-medium`, `font-semibold` ตามปกติ ตัวอย่าง (Proposed):

```css
:root {
  --font-size-eyebrow: 0.75rem;
  --tracking-eyebrow: 0.15em;
  --font-size-section-title: clamp(1.875rem, 1.5rem + 1.5vw, 2.25rem);
}

@theme inline {
  --text-eyebrow: var(--font-size-eyebrow);
  --text-eyebrow--letter-spacing: var(--tracking-eyebrow);
  --text-section-title: var(--font-size-section-title);
}
```

ผลที่เกิดกับหน้า landing (Proposed):

```tsx
// Before: ทุกที่ต้องจำค่าเอง และจำไม่ตรงกัน
<p className="mb-5 text-xs tracking-[0.2em] uppercase">{t('eyebrow')}</p>
<h2 className="text-3xl leading-snug sm:text-4xl">{t('collectionTitle')}</h2>

// After: หน้าบอกแค่หน้าที่ของข้อความ ค่าจริงอยู่ที่เดียว
<p className="mb-5 text-eyebrow uppercase">{t('eyebrow')}</p>
<h2 className="text-section-title">{t('collectionTitle')}</h2>
```

หลังจากนี้ ถ้าทีมอยากให้ป้ายตัวเล็กห่างขึ้น แก้ `--tracking-eyebrow` ที่เดียว แทนการไล่แก้ 3 จุดใน landing

ข้อควรรู้:

- `1rem` อิงขนาดตัวอักษรของเบราว์เซอร์ (ปกติ 16 px) ผู้ใช้ที่ตั้งตัวอักษรใหญ่ขึ้นจะได้ตัวใหญ่ตาม ส่วน `clamp(min, ค่ากลาง, max)` ทำให้หัวข้อโตตามความกว้างจอ แต่ไม่เล็กหรือใหญ่เกินขอบที่ตั้งไว้
- ตั้ง role แล้ว component เดิม**ไม่เปลี่ยนเอง** เช่น Button ยังใช้ `text-sm` อยู่ ถ้าอยากให้ปุ่มใช้ role label ต้องแก้ class ใน `button.tsx` ห้ามไปใส่ `className` เพิ่มทีละปุ่ม
- ถ้าเปลี่ยน font ทั้งเว็บ ให้แก้ rule `body` ใน `@layer base` ของ `globals.css` จุดเดียว
- เมื่อเพิ่ม role ใหม่ ให้เพิ่มตัวอย่างใน `TYPE_SAMPLES` ของ `ui-kit-foundations.tsx` ด้วย คนอื่นจะได้เห็นค่าที่วัดได้จริง
- การแก้ landing จริงเป็นขั้น 13 ซึ่งทำหลัง Draft 1

## 5. เพิ่ม component ใหม่ต้องทำอะไรบ้าง (ขั้น 10)

ตัวอย่างการเพิ่ม `textarea.tsx`:

1. สร้าง `src/shared/ui/textarea.tsx` โดยดูแบบจาก `input.tsx` และใช้ token เดิม (`border`, `bg-background`, `aria-invalid:border-destructive`)
2. เพิ่มตัวอย่างใน `ui-kit-*.tsx` ด้วย `DemoSection` ให้ครบทุก state ที่ใช้จริง เช่น default, `aria-invalid`, `disabled`
3. ป้ายบนตัวอย่างใช้ชื่อ prop ตรงตัว (`disabled` ไม่ใช่ "ยังไม่พร้อม") เพราะ UI Kit เป็นพจนานุกรมให้ dev ดูภาพแล้วเขียนโค้ดได้ทันที
4. ข้อความที่ผู้ใช้เห็นต้องเพิ่มทั้ง `messages/th/common.json` และ `messages/en/common.json`

`pnpm check` จะล้มเองถ้าลืมทำข้อ 2 (ขึ้น `Missing UI Kit demo: textarea.tsx`) หรือลืมเพิ่มข้อความภาษาใดภาษาหนึ่งในข้อ 4

## 6. ทำไม Draft 1 ถึงให้คนอื่นทำงานคู่ขนานได้ (ขั้น 12)

dev ใช้**ชื่อ** (`bg-primary`, `text-section-title`, `<Button variant="outline">`) ไม่ได้ใช้**ค่า** เพราะฉะนั้นเมื่อคนดูแลเปลี่ยนสีหรือขนาดภายหลัง หน้าของ dev จะเปลี่ยนตามเองตามเส้นทางในหัวข้อ 1 ไม่ต้องรื้อ

ดังนั้น Draft 1 ไม่ได้แปลว่าค่าเป็นค่าสุดท้ายแล้ว แต่แปลว่า**ชื่อนิ่งแล้ว** สถานะดูได้จากป้ายบนหัวหน้า UI Kit ส่วนกติกาสำหรับ dev อยู่ที่ [checklist](design-system-onboarding.md#draft-1-แปลว่าอะไรสำหรับ-dev)

## เมื่อติด

- **ค่าในเอกสารไม่ตรงกับโค้ด:** เชื่อโค้ด (`globals.css` และไฟล์ component) แล้วแจ้งแก้เอกสาร เอกสารนี้อ้างชื่อ section component (เช่น `HeroSection`) แทนเลขบรรทัด เพื่อไม่ให้คลาดเมื่อไฟล์ถูกแก้
- **อยากเปลี่ยน props ของ component กลาง:** ตรวจผู้ใช้ก่อนด้วย `grep -rn "<Button" src` แล้วคุยกับเจ้าของ feature
