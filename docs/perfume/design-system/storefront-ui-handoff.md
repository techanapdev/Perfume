# คู่มือส่งต่องาน UI หน้าร้าน

อัปเดต 17 ตุลาคม 2026 · Gold & Noir เป็นแบบร่างสำหรับตรวจรับ ยังไม่ใช่ดีไซน์หรือกติกาธุรกิจที่ทีมรับรอง

## เปิดดูงาน

```sh
pnpm dev
```

ใช้พอร์ต Local ที่ terminal แสดง และเปิดเส้นทางต่อไปนี้ เปลี่ยน `/th` เป็น `/en` เพื่อดูภาษาอังกฤษ

| เส้นทาง         | สิ่งที่มีตอนนี้                                              |
| --------------- | ------------------------------------------------------------ |
| `/th`           | หน้าแรก คอลเลกชันตัวอย่าง ingredient preview และทางไป Custom |
| `/th/login`     | หน้าเข้าสู่ระบบ พร้อมส่วนขออีเมลยืนยันใหม่                   |
| `/th/register`  | หน้าสมัครสมาชิก พร้อมสถานะจากฟอร์มเดิม                       |
| `/th/customize` | หน้าทดลองเลือกเบสตัวอย่าง 3 กลิ่นและแอนิเมชันระดับน้ำหอม     |
| `/th/ui-kit`    | อ้างอิง primitives, tokens และสถานะ UI กลาง                  |

หน้าแรกและ Custom เปิดดูพรีวิวได้โดยไม่ต้องมี Supabase credentials ส่วนฟอร์ม Login/Register **ยังเชื่อมกับ Server Actions เดิม** การกดส่งอาจติดต่อระบบ Auth ที่ตั้งค่าไว้ ไม่ใช่ฟอร์มจำลอง รอบงาน UI นี้ไม่ได้ส่งฟอร์มหรือทดสอบการส่งอีเมลจริง

## Navbar และโครงหน้าร่วมกัน

`src/app/[locale]/layout.tsx` วาง `StoreShell` ครั้งเดียวให้ทุกหน้าร้าน ทีมเพิ่มเนื้อหาใน page ได้เลย ไม่ต้องครอบ shell หรือเพิ่ม Navbar/Footer ซ้ำ

| ไฟล์                                           | หน้าที่                                            |
| ---------------------------------------------- | -------------------------------------------------- |
| `src/shared/layout/store-shell.tsx`            | Skip link, header, main และ footer                 |
| `src/shared/layout/store-header.tsx`           | ประกอบแบรนด์ เมนู ภาษา และทางเข้าสู่บัญชีบน server |
| `src/shared/layout/store-navigation.ts`        | รายการเส้นทางและการตรวจลิงก์หน้าปัจจุบัน           |
| `src/shared/layout/store-navigation-links.tsx` | แสดงลิงก์และ `aria-current` จาก pathname           |
| `src/shared/layout/store-menu.tsx`             | เมนูมือถือผ่าน Sheet กลาง                          |
| `src/shared/layout/language-switcher.tsx`      | สลับภาษาโดยคง pathname                             |

ตั้งแต่ `lg` (64rem ตามค่า Tailwind ปัจจุบัน) ใช้โลโก้ซ้าย เมนูกลาง และภาษา/บัญชีขวา จอเล็กใช้ปุ่มเมนูซ้าย โลโก้กลาง และภาษาขวา Drawer ใช้รายการลิงก์ชุดเดียวกับ desktop ปิดหลังเลือกลิงก์และเมื่อขยายหน้าจอถึง desktop ลิงก์ UI reference อยู่ใน Footer

เพิ่มหรือแก้รายการที่ `storeMainLinks` / `storeAccountLinks` ใน `store-navigation.ts` พร้อมคำแปล `common.navigation` ทั้ง `messages/th/common.json` และ `messages/en/common.json` เพิ่มเฉพาะเส้นทางที่เปิดได้จริง ปุ่มสมัครสมาชิกใช้ `prominent: true` เพื่อแสดงผ่าน Button กลางแบบ outline พื้นโปร่งใสและเส้นขอบบาง ส่วน Sign in เป็นลิงก์ข้อความ ใช้รูปแบบเรียบนี้ทั้ง Navbar และเมนูมือถือ

ใช้ `Link` และ `usePathname` จาก `@/i18n/navigation` เพื่อให้เส้นทางตามภาษาปัจจุบัน ค่า pathname จาก adapter ไม่มี locale prefix การตรวจ active ตรงกับหน้าปัจจุบันและหน้าลูกตามขอบเขต `/` ส่วน `/#collection` เป็นตำแหน่งในหน้า จึงไม่ประกาศเป็น current page และไม่ได้ติดตามตำแหน่ง scroll

### สัญญา props

`StoreShell({children})` คง API เดิม ไม่มี props ด้าน session หรือธุรกิจ

`StoreNavigationItem` เป็นข้อมูล UI เท่านั้น:

```ts
type StoreNavigationItem = {
  href: string;
  label: string;
  prominent?: boolean;
};
```

`StoreNavigationLinks` รับ `items`, `label` (ชื่อ navigation สำหรับ accessibility), `variant?: 'main' | 'account' | 'menu'` และ `onNavigate?: () => void` callback ต้องส่งจาก client component

**StoreMenu เปลี่ยน API ในรอบนี้** จากชุด labels ที่มี home/uiKit/catalog/custom/notReady เป็น:

```ts
type StoreMenuProps = {
  mainItems: readonly StoreNavigationItem[];
  accountItems: readonly StoreNavigationItem[];
  labels: {
    menu: string;
    close: string;
    description: string;
    main: string;
    account: string;
  };
};
```

Caller ปัจจุบันคือ `StoreHeader` และอัปเดตพร้อมกันแล้ว หากทีมมี branch ที่เรียก StoreMenu โดยตรง ให้ปรับตามสัญญานี้ ไม่สร้างรายการเมนูอีกชุดไว้ใน feature

Navbar แสดงทางเข้าสู่ระบบและสมัครสมาชิกแบบคงที่ ยังไม่ได้สะท้อน session ผู้ใช้ ไม่ใช่หลักฐานการอนุญาตเข้าถึงข้อมูล หากต้องมีชื่อผู้ใช้/เมนูบัญชี/ออกจากระบบ ให้ทีม account ตกลง state และข้อมูลที่ส่งเข้า UI ร่วมกันก่อน

## ส่งต่องาน Login และ Register

Routes เป็นทางเข้าบาง ๆ โดยเรียก `LoginScreen` / `RegisterScreen` จาก `src/features/account/components/` ส่วน `AuthPageShell` ดูแลภาพประกอบ แท็บสลับหน้า และกรอบฟอร์มร่วมกัน

`LoginForm`, `RegisterForm`, `ResendConfirmationForm`, `actions.ts`, `schemas.ts`, `session.server.ts` และ `redirect-target.ts` เป็นโค้ดบัญชีเดิม รอบนี้ไม่เปลี่ยนการตรวจข้อมูล รหัสผ่าน session การส่งอีเมล หรือกฎ redirect หน้า Login ยังส่ง `next` ผ่าน `safeNextPath` และแสดงข้อผิดพลาดยืนยันอีเมลจาก `error=confirm`

ทีม account รับช่วงทดสอบ credentials จริง การยืนยันอีเมล การส่งซ้ำ session และ redirect ตาม environment ที่ได้รับอนุญาต แยกหลักฐานจากการตรวจ UI อย่าสรุปว่า Auth พร้อมใช้จาก build ผ่าน

## ส่งต่องาน Custom

`src/app/[locale]/customize/page.tsx` เรียก `CustomPerfumePreview` จาก feature `custom-perfume` หน้าแรกและหน้านี้ใช้ `IngredientPreview` ตัวเดียวกัน แต่มี state แยกในแต่ละครั้งที่ mount

| ส่วน                   | ไฟล์ใน `src/features/custom-perfume/`                                 |
| ---------------------- | --------------------------------------------------------------------- |
| จัดหน้า Custom         | `components/custom-perfume-preview.tsx`                               |
| Section ในหน้าแรก      | `components/ingredient-section.tsx`                                   |
| เลือก/ลบ/ล้างเบส       | `components/ingredient-preview.tsx`, `preview-selection.ts`           |
| ขวดและระดับน้ำ         | `components/ingredient-bottle.tsx`, `components/ingredient-liquid.ts` |
| Animation / responsive | `components/ingredient-preview.module.css`                            |

พรีวิวเลือกได้สูงสุด 3 เบส น้ำเพิ่มตามจำนวนที่เลือก ลบและล้างได้แม้ครบ 3 แล้ว รูปตัวอย่างอยู่ที่ `public/images/ingredients/*-v1.webp` ข้อความอยู่ใน `content.ingredients` และ `content.customize` ทั้งสองภาษา

state อยู่ในหน่วยความจำ ไม่บันทึกข้ามการเปลี่ยนหน้า/รีเฟรช และไม่ส่ง API จำนวน 3 เบส ภาพ วัตถุดิบ และระดับน้ำเป็นพรีวิวที่ผู้ใช้ขอ ไม่ใช่สูตร อัตราส่วน inventory หรือข้อจำกัดสินค้าจริง

สิ่งที่ยัง Pending ให้เจ้าของ feature ยืนยันก่อนทำต่อ: การใช้วันเกิด ตัวเลือกจริง สูตร/อัตราส่วน ราคา การเก็บข้อมูล การบังคับล็อกอิน และการเชื่อม cart/order รอบนี้ไม่มีการเพิ่มกติกาเหล่านี้

## วิธีทำหน้าใหม่ให้เข้าชุด

1. อ่าน README ของ feature และใช้ `/th/ui-kit` เป็นตัวอย่าง
2. วางเนื้อหาและกฎของ feature ไว้ใน feature; route เรียก component ของ feature
3. ใช้ `site-container` เพื่อให้ขอบและแนวกึ่งกลางตรงกัน และใช้ `text-heading`, `text-body`, `text-label`, `text-eyebrow`, `font-display` ตามบทบาท
4. ใช้ semantic colors เช่น `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `text-primary` และ Button/Input จาก `@/shared/ui/` ไม่ทำสำเนา
5. ใช้ Server Component เป็นหลัก แยกส่วนที่ใช้ state/event เป็น client leaf; shared layout ต้องไม่ import feature หรือ provider
6. เพิ่มคำแปล TH/EN และตรวจ callers ก่อนเปลี่ยน API กลาง ประสาน UI owner สำหรับ tokens, layout และ primitives

อย่าเพิ่มเมนูเข้าสู่หน้าที่ยังไม่มี route หรือสมมติกฎ auth เพื่อให้ UI ดูสมบูรณ์ ให้ทีมตกลง contract แล้วเพิ่มในส่วนของ feature

## ตรวจงานและส่งต่อ

```sh
pnpm format <files>
node --experimental-strip-types scripts/store-navigation.check.mts
node --experimental-strip-types scripts/ingredient-preview.check.mts
pnpm check
pnpm build
```

Assertions ตรวจการเลือกเมนู เส้นทาง/anchor คำแปล และ logic ของ ingredient preview ส่วน check ตรวจ lint/types/foundation และ build ตรวจ production compilation คำสั่งเหล่านี้ไม่ได้พิสูจน์หน้าตา พฤติกรรมใน browser หรือ Auth/DB/email จริง

ผลตรวจรอบ 17 ตุลาคม 2026: assertions ทั้งสองชุด, `pnpm check` และ `pnpm build` ผ่าน ตรวจ HTTP แบบ GET ทั้ง 10 หน้าข้างต้นใน TH/EN ได้ 200 รวมถึงหน้า Login ที่มีข้อผิดพลาดยืนยันอีเมลและ safe return target ยังไม่ได้ส่งฟอร์มบัญชีหรือทดสอบ Auth จริง

ผู้ใช้เลือกตรวจ browser ด้วยตนเองไว้แล้ว เช็กลิสต์นี้ **รอผลตรวจ**:

- เปิด TH/EN ที่ 320, 375, 768, 1024, 1440 และ 1920px: ไม่มีแนวนอนล้น โลโก้และเนื้อหาอยู่ตามแนวกึ่งกลาง ข้อความไทยไม่ทับปุ่ม
- ลอง Home, Fragrances, Custom, Login และ Sign up: ถึงหน้าถูกภาษา ลิงก์หน้าปัจจุบันมีสถานะชัดเจน UI reference เปิดจาก Footer ได้
- มือถือเปิดเมนูด้วย keyboard ตรวจ Tab/Shift+Tab, Escape, ปุ่มปิด, การคืน focus และการปิดหลังเลือกลิงก์ ลองเปิดค้างแล้วขยายเป็น desktop เพื่อให้หน้าเลื่อนและกดได้ตามปกติ
- หน้า Login/Register: แท็บสลับหน้า ช่องกรอก label และปุ่มอยู่ครบ ไม่มี Navbar ซ้ำ ตรวจ `/th/login?error=confirm` ว่าแสดงข้อความและส่วนส่งอีเมลใหม่
- ตรวจหน้าตาฟอร์มโดยไม่กดส่ง หากจะทดสอบ Auth จริง ให้เจ้าของ account ใช้บัญชีและ environment ที่ได้รับอนุญาต
- หน้า Custom: เลือก 1 → 2 → 3 เห็นระดับน้ำเพิ่ม เลือกข้อที่ 4 ไม่ได้ ลบ/ล้างแล้วลดลง และทดสอบ reduced motion
- ย้ายจากพรีวิวในหน้าแรกไป Custom แล้วรีเฟรช: เริ่มพรีวิวใหม่ตามขอบเขตที่ยังไม่บันทึกข้อมูล

อ่านต่อ: [Shared UI guide](../../../src/shared/ui/README.md), [design-system onboarding](design-system-onboarding.md), [account README](../../../src/features/account/README.md) และ [custom-perfume README](../../../src/features/custom-perfume/README.md)
