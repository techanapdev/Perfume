# Perfume Commerce

ฐาน POC ของร้านน้ำหอมหนึ่งร้าน ใช้ Next.js + Supabase และ feature-first

**สถานะเอกสาร ณ 17 ตุลาคม 2026:** มีเอกสาร DB และ design system ใน `docs/perfume/` แล้ว แต่เอกสาร product-scope, architecture, team-ownership, feature-contracts, security-and-data, ui-workflow และ ADR บางรายการที่อ้างถึงยังไม่มีใน workspace ไม่ได้สร้าง requirement หรือ decisions ทดแทนขึ้นเอง อ่านคู่มือไฟล์ที่มีจริงด้านล่างก่อนเริ่มงาน

## เริ่มใช้งาน

ต้องใช้ Node **22.23.2** และ pnpm **10.33.3**; package นี้ private และใช้ pnpm-lock.yaml ชุดเดียว

```sh
nvm install
nvm use
corepack enable
corepack prepare pnpm@10.33.3 --activate
pnpm install --frozen-lockfile
pnpm dev
```

เปิด http://localhost:3000 ระบบพาไป /th ไม่ต้องสร้าง .env เพื่อเปิดหน้าตัวอย่าง ไม่มี remote fonts/images ในหน้าเริ่มต้น ระบบมีโค้ด Auth เดิมอยู่แล้ว การส่งฟอร์มบัญชีต้องใช้ configuration จริง; proxy refresh session เมื่อมี auth cookie

| Route                        | สิ่งที่มี                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------- |
| /th, /en                     | Landing preview ธีม Gold & Noir พร้อมภาษาและ mobile menu; แบบร่างยังรอตรวจรับ |
| /th/ui-kit, /en/ui-kit       | Shared primitives, local RHF/Zod validation และ toast                         |
| /th/login, /en/login         | หน้าเข้าสู่ระบบ ธีมเดียวกับหน้าร้าน ใช้ Auth form/actions เดิม                |
| /th/register, /en/register   | หน้าสมัครสมาชิกและสถานะยืนยันอีเมลจากฟอร์มเดิม                                |
| /th/customize, /en/customize | หน้า Custom แยกสำหรับเลือกเบสตัวอย่างและดูแอนิเมชัน ยังไม่บันทึกหรือสั่งซื้อ  |
| /admin                       | โครงสร้างหลังบ้านภาษาไทย มี requireStaff gate เดิม; เมนูอนาคตปิดการกด         |

Routes อื่น เช่น products/checkout ยังเป็น 404 ฟีเจอร์ business จะเริ่มหลัง requirement และ contract ของการ์ดนั้นรับรองแล้ว

อ่าน [คู่มือส่งต่องาน Navbar, บัญชี และ Custom](docs/perfume/design-system/storefront-ui-handoff.md) สำหรับจุดแก้เมนู สัญญา components ขอบเขตที่ทีมต้องต่อ และเช็กลิสต์ตรวจหน้าจอ

## UI Kit คืออะไร และเปิดอย่างไร

UI Kit เป็นหน้าตัวอย่าง UI กลางให้สมาชิกดูและใช้ปุ่ม ฟอร์ม Card, Badge, Dialog, Sheet, Select, Checkbox, Table และ Skeleton ชุดเดียวกัน พร้อมสถานะ error/disabled/loading และตัวอย่างฟอร์มที่ตรวจข้อมูลในเครื่องแล้วแสดง toast ยังไม่ใช่หน้าขายสินค้า หรือ design ที่ลูกค้ารับรอง

รัน `pnpm dev` แล้วใช้ URL `Local` ที่ terminal แสดง ต่อท้ายด้วย `/th/ui-kit` หรือ `/en/ui-kit` เช่น `http://localhost:3000/th/ui-kit` หากพอร์ตถูกใช้อยู่ Next อาจเลือกพอร์ตอื่น อย่ายึด 3000 เสมอ และ `/ui-kit` ตรง ๆ ไม่มี route

อ่าน [Shared UI guide](src/shared/ui/README.md) ดูตัวอย่าง [UI Kit source](src/shared/ui/ui-kit-preview.tsx) และ import primitives จากไฟล์เฉพาะใน `src/shared/ui/` หน้า UI Kit ไม่ต้องมี Supabase credentials

## ไฟล์แต่ละส่วนมีไว้ทำอะไร

| ไฟล์/พื้นที่                                                                                    | หน้าที่และจุดเริ่มอ่าน                                                                                                                |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                                     | คู่มือเริ่มรัน ตรวจงาน และภาพรวมโปรเจกต์                                                                                              |
| [AGENTS.md](AGENTS.md)                                                                          | ข้อตกลงการแก้โค้ด ขอบเขต feature และการตรวจงาน                                                                                        |
| `src/app/[locale]`                                                                              | ทางเข้าและ root layout ของหน้าร้าน TH/EN; page เรียก UI จาก feature/shared                                                            |
| `src/app/admin`                                                                                 | ทางเข้าและ root layout หลังบ้าน; ตอนนี้เป็น structure preview                                                                         |
| `src/features/*/README.md`                                                                      | อธิบายแต่ละ feature: หน้าที่ routes จุดเชื่อม และ requirement ที่ยังรอ; หลายโฟลเดอร์มีคู่มือเท่านั้น ยังไม่มี business implementation |
| [src/shared/ui](src/shared/ui/README.md)                                                        | UI primitives กลางและหน้าอ้างอิง; ใช้ร่วมกันทั้งร้านและ admin                                                                         |
| `src/app/globals.css`                                                                           | Semantic tokens สี ระยะและ styles กลาง; จุดปรับหน้าตาของระบบ                                                                          |
| [src/shared/layout](src/shared/layout/README.md)                                                | Store/admin shells, menu และตัวสลับภาษา                                                                                               |
| `src/shared/lib/cn.ts`                                                                          | Utility รวม class names ของ components                                                                                                |
| [src/shared/lib/supabase](src/shared/lib/supabase/README.md)                                    | Factories และ proxy session refresh เดิม; กฎบัญชีและ requireStaff อยู่ใน feature account                                              |
| `src/i18n`, `src/proxy.ts`                                                                      | กำหนด TH/EN โหลดข้อความ และ routing ภาษา                                                                                              |
| `messages/th`, `messages/en`                                                                    | ข้อความ UI แยกตามภาษาและ namespace                                                                                                    |
| `public/images`                                                                                 | Assets ในโปรเจกต์; มีภาพแนวคิดน้ำหอมที่สร้างสำหรับดีไซน์ Gold & Noir และภาพ placeholder เดิม                                          |
| [supabase/migrations](supabase/migrations/README.md)                                            | คู่มือก่อนสร้าง migration; ตอนนี้ยังไม่มี SQL schema                                                                                  |
| `scripts/foundation.check.mts`                                                                  | Assertion checks ของ env ภาษา layouts และขอบเขต shared                                                                                |
| `package.json`, `pnpm-lock.yaml`                                                                | Dependencies/scripts และเวอร์ชันติดตั้งที่ทีมใช้ร่วมกัน                                                                               |
| `.nvmrc`, `.editorconfig`, `.gitignore`                                                         | เวอร์ชัน Node รูปแบบไฟล์ และรายการที่ไม่ส่งเข้า Git                                                                                   |
| `.env.example`                                                                                  | ชื่อ environment variables แบบค่าว่าง; ห้ามใส่ secrets จริงลง Git                                                                     |
| `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json` | ตั้งค่า Next, TypeScript, lint, Tailwind และ shadcn aliases                                                                           |
| `next-env.d.ts`, `.next`, `node_modules`, `*.tsbuildinfo`                                       | ไฟล์/tool output ที่สร้างอัตโนมัติ; ไม่แก้เอง โดยส่งเข้า Git เฉพาะ `next-env.d.ts`                                                    |

บันทึกการตรวจเดิมอยู่ใน `.docs/` ในเครื่องเท่านั้น โฟลเดอร์นี้ถูก ignore จึงไม่รวมใน GitHub

## ตรวจงาน

```sh
pnpm check
pnpm build
pnpm start
```

check รัน ESLint CLI, Next route type generation + TypeScript และ runnable foundation assertions; build แยกเพื่อเห็นหลักฐานแต่ละ layer Node strip-types อาจแสดง experimental warning โดยไม่มี test framework

dev/build ใช้ Webpack option ทางการของ Next เพราะ Turbopack worker เปิด port ไม่ได้ในสภาพแวดล้อมตรวจนี้ ไม่เปลี่ยน framework/version หรือใช้ experimental config; หากทีมจะเปลี่ยน bundler ให้ตรวจ clean install/build/browser อีกครั้ง

Build/static ผ่านไม่เท่ากับ browser, DB หรือ payment ผ่าน ดูหลักฐานจริงและช่องว่างใน [.docs](.docs/SESSIONLOG-bootstrap-2026-10-03.md) ก่อนส่งฐานให้ทีม

## โครงสร้างและ owner

| พื้นที่                                                                   | Owner/ผู้ประสาน                                      |
| ------------------------------------------------------------------------- | ---------------------------------------------------- |
| src/features/catalog, promotions, reporting                               | คนที่ 1                                              |
| src/features/content, wishlist                                            | คนที่ 2                                              |
| src/features/custom-perfume, account, customers                           | คนที่ 3                                              |
| src/features/cart, checkout, orders, payments                             | คนที่ 4                                              |
| src/shared/ui, shared/layout, src/app/globals.css, src/i18n, src/proxy.ts | คนที่ 2 ประสาน                                       |
| src/shared/lib/supabase, session/access foundation, generated DB types    | คนที่ 3 ประสาน                                       |
| package/lockfile/framework/lint configs                                   | คนที่ 4 ประสาน                                       |
| supabase/migrations                                                       | Owner การ์ดเขียน; คนที่ 3 ประสานลำดับ และมี reviewer |

รายละเอียด [team ownership](docs/perfume/team-ownership.md) และ README ในแต่ละ feature; ข้อเสนอ ownership/capacity ต้องทีมรับทราบด้วย

- app เป็น route entry; แยก root layouts ร้าน [locale] กับ admin ไม่มี common app/layout.tsx
- feature เก็บ UI/rules/server operations ของธุรกิจเดียวกัน ทั้งหน้าร้านและ admin
- shared ไม่ import feature/provider; ใช้ semantic tokens และ primitives กลาง
- สร้าง schemas/actions/queries/types เมื่อมีงานจริง ไม่สร้าง implementation ว่าง
- ใช้ specific imports แยก server/client ไม่รวม operations กับ UI ใน barrel
- messages/th และ en แยก namespace; ตอนนี้ common/content เท่านั้น เพิ่ม namespace ของ feature ตัวเองพร้อมคำแปลทั้งคู่

## Supabase และ secrets

.env.example มีช่องว่างสำหรับ URL, publishable key และ Resend key ไม่จำเป็นสำหรับ preview อย่าใส่ secret/service-role key ใน NEXT_PUBLIC ตัวไหน

Factories จะตรวจ configuration เมื่อถูกเรียก โค้ดเดิมมี proxy session refresh, account Auth actions และ requireStaff แล้ว รอบ UI นี้ไม่ได้เปลี่ยนหรือทดสอบการเชื่อมต่อจริง ไม่มีการเพิ่ม domain queries, generated Database types, SQL migration หรือ email delivery ใหม่

ก่อนเชื่อมข้อมูลให้เจ้าของ feature กับ reviewer ยืนยัน [DB](docs/perfume/db.md), [contracts](docs/perfume/feature-contracts.md), target/environment และ access rules แล้ว generate Database types จาก schema จริง ดู [client guide](src/shared/lib/supabase/README.md)

## เริ่มงานเป็นทีม

1. เลือกหนึ่งการ์ดต่อคนจาก [Kanban](docs/perfume/kanban-backlog.md) และอ่าน feature README/requirements ที่เกี่ยวข้อง
2. คนที่ 1 เริ่ม catalog contract; คนที่ 2 รับ UI/content; คนที่ 3 เก็บ custom/access rules; คนที่ 4 เตรียม cart contract ทุกคนถาม requirement ของ feature ตัวเอง
3. คนที่ 2 ตรวจ /th/ui-kit และ /en/ui-kit ก่อนเปลี่ยน tokens; baseline ยังไม่ใช่ design ที่ลูกค้ารับรอง
4. ตกลง inputs/results/errors/states แล้วแยก branch ตามการ์ด ใช้ shared code เดิม ไม่มี Button/Form ชุดใหม่ราย feature
5. เปลี่ยนไฟล์กลางด้วย small PR ที่ผู้ประสาน review หลีกเลี่ยงหลายคนแก้ config/lockfile/globals พร้อมกัน
6. บันทึกหลักฐานตาม layer แล้วรวมทีละ flow; ไม่มี migration/payment/auth เดาเอง

อ่าน [AGENTS.md](AGENTS.md) ก่อนใช้ AI และ [architecture](docs/perfume/architecture.md) ก่อนย้าย boundary

## GitHub และการเริ่มงานจาก repo

Repository: https://github.com/techanapdev/Perfume · Branch: `main`

สมาชิกเริ่มด้วย:

```sh
git clone https://github.com/techanapdev/Perfume.git
cd Perfume
nvm install
nvm use
corepack enable
corepack prepare pnpm@10.33.3 --activate
pnpm install --frozen-lockfile
pnpm dev
```

ก่อน commit ตรวจ `git status` และ staged diff เสมอ ไม่มี .env จริง/node_modules/.next ใน Git มีเพียง .env.example ที่ว่าง Invite สมาชิกและตั้ง branch review ตามข้อตกลงทีม; ให้สมาชิกอีกคนลอง clone + frozen install + run/check จริง

## ข้อจำกัด dependency

เวอร์ชันที่เลือกยืนยันใน package.json/lockfile pnpm ติดตั้งโดยไม่มี peer conflict แต่ registry แจ้ง ESLint 9.39.5 และ @react-email/components 1.0.12 deprecated รวมบาง transitive email packages; ยังไม่มีการส่ง email ควรทบทวนก่อนเริ่ม email feature ไม่มีการอัปเกรดนอกแผนโดยอัตโนมัติ

shadcn CLI 4.21.1 ใช้ตรวจ source แต่ registry เสนอ umbrella imports/dependencies เพิ่ม ฐานนี้ใช้ scoped Radix ที่ pin และ cn กลาง ไม่มี next-themes dark-mode provider ดู [shared UI guide](src/shared/ui/README.md)
