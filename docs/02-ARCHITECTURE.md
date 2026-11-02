# 02 — Technical Architecture

## 1. C4-lite / data flow

```text
Browser (8 static pages, optional JS islands without React)
          |
          v
Netlify CDN + managed TLS + custom domain
          |
          +-- static HTML/CSS/JS and optimized images from `dist/`
          |
          +-- [Phase 2] HTML lead form POST -> Netlify Forms
                                   |
                                   +-- secure submissions dashboard
                                   +-- export CSV -> Excel
                                   +-- approved notification/retention workflow

Local/CI (build only): GitHub repo -> Node LTS + npm ci -> Astro static build -> dist/
```

Node.js/Astro dùng lúc build, **không** là runtime phục vụ các trang public. Không dùng PHP, SQL, API/SSR server riêng. **Responsive được triển khai trên cùng HTML/routing và CSS mobile-first, không có bản web mobile riêng hoặc client-side UA routing.**

## 2. Repo structure bắt buộc
```text
nam-han-logistics/
├── AGENTS.md
├── README.md
├── .nvmrc                    # pin dòng Node LTS đã kiểm thử; ghi phiên bản cụ thể khi bootstrap
├── package.json
├── package-lock.json
├── astro.config.mjs
├── netlify.toml
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── images/                 # chỉ ảnh public không cần Astro image pipeline
│   ├── icons/
│   └── _headers                # security policies sau khi test
├── src/
│   ├── assets/                 # ảnh tối ưu bởi Astro build
│   ├── pages/
│   │   ├── index.astro
│   │   ├── ve-nam-han.astro
│   │   ├── dich-vu/
│   │   │   ├── index.astro
│   │   │   ├── van-tai-duong-bo.astro
│   │   │   ├── boc-xep-ho-tro-van-tai.astro
│   │   │   ├── logistics-giao-nhan.astro
│   │   │   └── giai-phap-van-tai.astro
│   │   ├── lien-he.astro
│   │   └── 404.astro
│   ├── layouts/
│   │   └── SiteLayout.astro
│   ├── components/
│   │   ├── layout/             # SiteHeader, SiteFooter, Breadcrumb
│   │   ├── ui/                 # ButtonLink, SectionHeading, InputField, Cards
│   │   ├── sections/           # FeatureGrid, ServiceGrid, Timeline, CTA, FAQ
│   │   └── seo/                # PageHead
│   ├── features/
│   │   ├── lead-form/          # UI + validation + adapter interface
│   │   ├── route-inquiry/      # UI riêng, contract dùng chung
│   │   └── voice-input/        # progressive enhancement
│   ├── content/
│   │   ├── company.ts
│   │   ├── services.ts
│   │   ├── news.ts
│   │   ├── faqs.ts
│   │   └── navigation.ts
│   ├── lib/
│   │   ├── types.ts
│   │   └── lead-submission/     # implementation adapter ở Phase 2
│   └── styles/
│       ├── tokens.css
│       └── global.css
├── tests/
│   ├── e2e/
│   └── unit/
└── docs/
```
Route slugs trên là **đề xuất**, phải duyệt trước deploy production để tránh SEO redirects sau này. Không hardcode đường dẫn trong hàng chục component; dùng typed route constants.

## 3. Layer boundaries
| Layer | Cho phép | Không cho phép |
|---|---|---|
| `pages` | compose layout/sections, define SEO/page metadata | business logic, direct fetch tới provider |
| `components/ui` | thuần hiển thị, props typed | import Netlify, phụ thuộc route cụ thể |
| `components/sections` | nhóm component tái sử dụng | giữ PII/state của provider |
| `content` | dữ liệu trình bày, static FAQs/news/services | lấy PII, fake business claims |
| `features/*` | forms, voice, validation, state machine | secrets server; heavy runtime |
| `lib/lead-submission` | adapter provider được phê duyệt | rò rỉ sang UI, build SSR |

Data contract concept:
```ts
// API logic example, KHÔNG phải code thành phẩm:
type LeadRequestType = 'shipment_quote' | 'handling_quote' | 'route_inquiry';
type SubmissionState = 'idle' | 'invalid' | 'submitting' | 'success' | 'error';
interface LeadSubmissionPort {
  submit(data: NormalizedLead): Promise<{ ok: true } | { ok: false; message: string }>;
}
```
Phase 1 dùng `DemoLeadSubmissionPort` **trả trạng thái `demo-not-connected`**, không trả success.
Phase 2 implement `NetlifyLeadSubmissionAdapter` tương ứng. Nếu form gửi HTML bình thường, progressive enhancement vẫn được giữ và không phụ thuộc JS.

## 3a. Responsive architecture invariants (Phase 1)
- `SiteLayout` phải bao gồm viewport meta (`width=device-width, initial-scale=1`), đúng `lang="vi"`, max-width `.container`, breakpoint/tokens thống nhất.
- Chỉ một cây DOM/ngữ nghĩa cho từng route; CSS Grid/Flexbox thay đổi cách bố trí theo viewport, tránh duplicate desktop/mobile page content.
- `SiteHeader` có mobile disclosure/menu accessible, desktop navigation thích hợp. Tất cả form nằm trong module `features/*`, field data/validation dùng chung, chỉ thay bố trí responsive.
- Component được chia theo trách nhiệm; mobile không phải lý do tạo `HomeMobile.astro` độc lập để sao chép nội dung. Có thể có visual-only responsive child khi thực sự cần và được ghi rõ.
- Breakpoint được đề xuất 768/1024 CSS px và có thể điều chỉnh theo content, nhưng test matrix 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 là bắt buộc theo **`docs/11-MOBILE-RESPONSIVE-SPEC.md`**.
- Build tĩnh không thay đổi theo User-Agent; tránh dùng browser runtime sniffing và không kéo thêm framework cho hamburger, FAQ hoặc form validation.

## 4. Cài đặt & build policy
- Bootstrap Astro stable có hỗ trợ Node LTS hiện hành; kiểm tra API tương thích trong ngày khởi tạo.
- Chọn **Node 26 LTS nếu runtime Netlify/Astro được xác nhận hỗ trợ**; nếu không chọn Node LTS khác được hỗ trợ và ghi rõ. Không tự đoán Node minor/patch.
- `.nvmrc` ghi chính xác dòng Node đã kiểm thử, lock `package-lock.json` commit vào git.
- `npm ci` để cài trên CI; không tự upgrade major hoặc thêm package để “dễ code”.
- `astro.config.mjs` đặt `output: 'static'`; `site` là canonical URL chỉ sau khi doanh nghiệp cấp domain.
- Không thêm Netlify SSR adapter khi chưa có tính năng on-demand; Astro static deploy không cần adapter.
- Không hotlink ảnh Figma hoặc URL asset có hạn dùng; assets phải trong repo hoặc nguồn đã cấp quyền.
- Một SEO title/description/canonical/OG per route; sitemap và robots production đầy đủ.

## 5. Tính ổn định và khả năng đổi nền tảng
- Static bundle không phụ thuộc phiên bản Astro/Node mới khi đang được phục vụ.
- Chỉ một adapter form provider, contract ổn định, không để JSX/service provider API nằm trong UI.
- Nếu cần migrate, có thể chuyển `dist/` sang bất kỳ CDN/static host hỗ trợ đường dẫn; **form sẽ cần dịch vụ thay thế**.
- Lưu checksum `dist` release, bản archived deploy, Node version, lockfile và README khôi phục.
- Không thêm analytics/tracker mặc định; nếu doanh nghiệp cần mới duyệt cookie/privacy impact.

## 6. ADR change policy
Mọi thay đổi sang CMS, SSR, PHP backend, CRM, speech cloud, XLSX generated service phải có ADR gồm: nhu cầu nghiệp vụ, options, privacy, vận hành, chi phí, migration, rollback và quyết định owner.
