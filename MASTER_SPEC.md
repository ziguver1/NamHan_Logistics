# NAM HÂN LOGISTICS — MASTER SPEC v1.1.0

Bản tổng hợp sinh từ `README.md`, `AGENTS.md`, các file `docs/` và `CHANGELOG.md`. File gốc là nguồn chuẩn.


---

<!-- Source: README.md -->

# NAM HÂN LOGISTICS — Astro Architecture & Implementation Specification

**Version:** 1.1.0 (Mobile-first UI addendum)  
**Ngày:** 25/10/2026  
**Mục đích:** triển khai UI 8 trang theo Figma trước; kết nối tiếp nhận yêu cầu khách hàng / xuất Excel sau; giảm công việc vận hành trong giai đoạn 2026–2031.  
**Nguồn thiết kế:** https://www.figma.com/design/EDp0z0ghKDZUdexTUjJfpL/NAM-H%C3%82N-LOGISTICS?node-id=0-1  
**Trạng thái:** Kiến trúc frontend và phạm vi UI **desktop + tablet + mobile** đã chốt; bố cục mobile/tablet là **phương án đề xuất** từ desktop Figma (chưa có frame mobile được xác minh) và cần phê duyệt hình ảnh trước nghiệm thu.

> Đây là **tài liệu đặc tả**, không phải mã nguồn website đã xây dựng. Những thông số chưa được Figma/người dùng xác nhận đều được gắn [PENDING] hoặc ghi rõ là mục tiêu kỹ thuật đề xuất. Không khẳng định website không cần bảo trì trong 5 năm.

## Cách dùng với ANti / coding agent

1. Đặt toàn bộ gói này ở thư mục gốc repository, giữ nguyên `AGENTS.md` và `docs/`.
2. Agent phải đọc `AGENTS.md` và `docs/` trước khi viết code.
3. Agent dùng Figma node IDs để truy vấn thiết kế từng section, không chỉ dựa vào ảnh tổng quan.
4. Chỉ triển khai **Phase 1** đến khi doanh nghiệp duyệt. Không gửi dữ liệu thật bằng dịch vụ chưa cấu hình.
5. Trong Phase 1 **bắt buộc triển khai mobile-first** theo `docs/11-MOBILE-RESPONSIVE-SPEC.md`, chụp và kiểm tra đủ viewport cho 8 trang; trình bày proposal mobile để phê duyệt.
6. Sau khi có quyết định nghiệp vụ, duyệt `docs/05-FORMS-DATA.md`, `docs/06-VOICE-INPUT.md`, rồi mới làm Phase 2.
7. Kết quả cần được kiểm thử theo `docs/07-QA-ACCEPTANCE.md` và bàn giao theo `docs/08-OPERATIONS-5Y.md`.

## Danh mục tài liệu

- `AGENTS.md` — luật triển khai dành cho AI agent (bắt buộc).
- `docs/01-SCOPE-DECISIONS.md` — quyết định và giới hạn sản phẩm.
- `docs/02-ARCHITECTURE.md` — kiến trúc, cấu trúc mã, dependency policy và contract.
- `docs/03-FIGMA-PAGE-MAP.md` — 8 routes, Figma node IDs, section và các điểm cần kiểm tra.
- `docs/04-DESIGN-UI-SPEC.md` — design system, responsive, accessibility, assets, tương tác.
- `docs/05-FORMS-DATA.md` — contract tiếp nhận lead, một bảng xuất CSV/Excel, trạng thái, bảo mật.
- `docs/06-VOICE-INPUT.md` — voice input có thật, fallback và quyền riêng tư.
- `docs/07-QA-ACCEPTANCE.md` — checklist QA, nghiệm thu UI, chức năng, SEO, hiệu năng.
- `docs/08-OPERATIONS-5Y.md` — domain, deploy, backup, rollback, vận hành 4–5 năm.
- `docs/09-PHASES-AND-TASKS.md` — backlog triển khai theo từng phase.
- `docs/10-PENDING-APPROVALS.md` — những điểm phải làm rõ với doanh nghiệp.
- **`docs/11-MOBILE-RESPONSIVE-SPEC.md` — hợp đồng responsive/mobile-first bắt buộc: breakpoints, 8 route adaptations, menu, form, voice, kiểm thử thiết bị.**
- `templates/netlify.toml.example` — cấu hình tham khảo cho static build, không giả định domain.
- `MASTER_SPEC.md` — bản tổng hợp để đọc/đưa vào công cụ tài liệu; các file trong `docs` là nguồn chuẩn.
- `CHANGELOG.md` — những thay đổi giữa các bản spec.

## Cơ sở công nghệ (kiểm tra ngày 25/10/2026)

- Astro mặc định tạo static output: https://docs.astro.build/en/reference/configuration-reference/
- Astro trên Netlify: static build `npm run build` và publish `dist`, không cần SSR adapter: https://docs.astro.build/en/guides/deploy/netlify/
- Netlify Forms: form detection trong HTML build, dashboard submissions và CSV: https://docs.netlify.com/manage/forms/setup/ và https://docs.netlify.com/manage/forms/submissions/
- Netlify spam protection: https://docs.netlify.com/manage/forms/spam-filters/
- SpeechRecognition có giới hạn tương thích trình duyệt: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- Node lifecycle: https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule

**Lưu ý:** chính sách giá, quota, điều khoản và tính năng nhà cung cấp có thể đổi trong 4–5 năm; kiểm tra khi ký bàn giao.


---

<!-- Source: AGENTS.md -->

# AGENTS.md — RÀNG BUỘC BẮT BUỘC CHO AI CODING AGENT

## 0. Thứ tự ưu tiên
1. Yêu cầu người dùng/doanh nghiệp đã phê duyệt trong cuộc làm việc hiện tại.
2. Tài liệu `docs/01-SCOPE-DECISIONS.md`, `docs/02-ARCHITECTURE.md` và **`docs/11-MOBILE-RESPONSIVE-SPEC.md` (bắt buộc cho UI mobile/tablet)**.
3. Figma node tương ứng trong `docs/03-FIGMA-PAGE-MAP.md` cho thiết kế hình ảnh và nội dung.
4. Các tài liệu acceptance, vận hành và hợp đồng dữ liệu trong `docs/`.
5. Những suy luận kỹ thuật phải đánh dấu `[ASSUMPTION]`; không giả thành yêu cầu đã duyệt.

## 1. Stack cứng
- **Astro, `output: 'static'`, TypeScript strict, HTML semantic, scoped CSS + CSS custom properties.**
- Không tự thêm PHP, Express, Next.js, React, Vue, CMS, database, SSR adapter, edge function, API backend, Tailwind hoặc UI framework.
- Không cài dependency nếu có giải pháp platform-native đủ tốt. Đề xuất thay đổi phải kèm ADR/đánh giá tác động và được duyệt.
- Không dùng endpoint/api giả làm có thật, không nhúng token hoặc secret vào client bundle, không ghi PII vào analytics/log.
- Không tạo CMS/admin/login. Không tự tạo thêm trang ngoài scope (trừ trang báo trạng thái, trang cảm ơn hoặc pháp lý được duyệt).

## 2. Figma là nguồn sự thật cho UI desktop
- File key `EDp0z0ghKDZUdexTUjJfpL`, page root `0:1`; lấy trực tiếp node IDs trong page map.
- Trước khi code một trang: đọc node Figma, chụp reference, xác định section, fonts, spacing, assets, interaction; ghi mapping.
- Tải các asset nguyên bản cần dùng vào repo, đặt tên có nghĩa, giữ đúng tỷ lệ. **Không** dùng ảnh screenshot của cả trang làm UI; không hotlink URL asset tạm thời của Figma.
- **Mobile/tablet là phạm vi bắt buộc ngay Phase 1, không để cuối dự án.** Với Figma mới có desktop 1280px: tuân theo `docs/11-MOBILE-RESPONSIVE-SPEC.md`, ghi `PROPOSED RESPONSIVE` cho các phương án suy ra, dựng preview và xin duyệt. Không tuyên bố pixel-perfect mobile theo Figma chưa tồn tại.
- Không sửa số liệu, công ty, chứng nhận, câu khẳng định uy tín hoặc nội dung legal khi chưa được duyệt; đánh dấu `CONTENT_REVIEW_REQUIRED` trong inventory.
- UI phải semantic, keyboard accessible, focus visible, reduced-motion aware.

## 3. Chia phase
- **Phase 1:** 8 routes triển khai mobile-first cho **mobile + tablet + desktop**, component, responsive test matrix, static content, SEO cơ bản, interactions hiện hữu, giao diện form với validate, trạng thái demo rõ ràng. Chỉ thực hiện trình duyệt voice nếu module được phê duyệt; có fallback nhập tay.
- **Phase 2:** Netlify Form submission lưu lead thật, thông báo, Excel/CSV export, spam, consent và giọng nói đạt kiểm thử theo target browsers. Không bắt đầu nếu owner/config/privacy chưa xác nhận.
- Phase 1 không hiển thị “Gửi thành công” hoặc “Có xe sẵn” như kết quả thật. Có thể đặt CTA trong preview dạng demo thông báo “Chưa kết nối tiếp nhận” hoặc thao tác xem trước mà không gửi dữ liệu.

## 4. Code rules
- Cấu trúc `src/pages`, `src/layouts`, `src/components/{layout,ui,sections}`, `src/features`, `src/content`, `src/styles`, `src/lib`.
- Content tách khỏi markup; dùng typed data models; không inline copy data nhiều lần.
- Shared only if reused meaningfully. Không tạo abstraction vô ích hoặc global state store.
- `astro.config.*` `output: 'static'`; tránh dynamic routes mà không có `getStaticPaths`.
- CSS tokens chung cho màu/chữ/khoảng cách/shadow/breakpoint; style scoped cho component. **Mobile-first**, breakpoint content-driven; cards/grids/timeline/form/nav có quy tắc trong `docs/11-MOBILE-RESPONSIVE-SPEC.md`. Không dùng `overflow-x: hidden` che lỗi tràn, không fixed-height cho text tiếng Việt.
- Accessibility: `lang="vi"`, heading hierarchy, nav, alt cho ảnh, label cho input, error messages accessible, không click-only controls; links có `href` thật.
- URLs internal canonical, không `href="#"` trong production; anchor có section ID thật.
- Nếu import JS cho tương tác, dùng progressive enhancement; content chính vẫn xem được không cần JS.
- Khóa dependency bằng `package-lock.json`, dùng `npm ci` trên CI; ghi Node major LTS đã xác thực trong `.nvmrc` (không tự nâng major).

## 5. Kiểm thử bắt buộc mỗi phase
- `npm run check`, `npm run build`, tests và link check phải pass trước merge.
- Kiểm tra output `dist/` chứa tất cả route; không có server runtime hoặc API key trong HTML/JS.
- Screenshot diff: desktop 1280 theo Figma; **mobile tại 320, 360, 375, 390, 430 và tablet 768, 1024** theo responsive proposal; desktop 1440 để kiểm tra max-width. Kiểm tra mỗi route cả khi chưa được duyệt, xin duyệt trước UI UAT.
- Không có 404 nội bộ, ảnh thiếu, **horizontal scroll tài liệu ở 320px**, phần tử tràn/cắt chữ, nút inert/tap target quá nhỏ, form bị bàn phím che, form báo thành công giả, nội dung placeholder vô nghĩa.
- Ghi rõ những browser không hỗ trợ SpeechRecognition và hành vi fallback; **kiểm thử giọng nói trên mobile thật** (iOS Safari và Android Chrome trong thiết bị mục tiêu) trước khi ký duyệt chức năng voice.
- Mọi PR nêu: mục tiêu, Figma node, file thay đổi, kiểm thử, ảnh trước/sau, rủi ro còn tồn tại.

## 5a. Mobile-specific release blocker
- Agent MUST read `docs/11-MOBILE-RESPONSIVE-SPEC.md` trước khi viết một section mới; code và screenshot thử từ viewport 375px trước, rồi 768/1280.
- Mọi route phải có menu mobile hoạt động, CTA chạm được, card/timeline xếp hợp lý, footer đọc được và form hợp lệ nếu có.
- Trạng thái responsive proposal là `PROPOSED` cho đến khi người phụ trách duyệt; không trì hoãn việc dựng mobile, **nhưng không cho phép ký nghiệm thu UI khi chưa duyệt**.
- Không bỏ nội dung thiết yếu trên mobile, không tạo một website mobile riêng, không thêm carousel tự chạy chỉ để tiết kiệm chiều cao.

## 6. Quy trình làm việc
1. Audit repo, design map, acceptance criteria.
2. Viết kế hoạch task nhỏ và những điểm cần quyết định.
3. Implement một route/feature tại một thời điểm; tận dụng component có sẵn.
4. Verify visual + functionality + build; không tự vượt scope.
5. Tóm tắt, để người duyệt chốt trước khi tiến phase tiếp theo.

## 7. Điều cấm về dữ liệu
- Không đưa PII khách hàng thật vào repo, ảnh demo, form fixtures, logs.
- Không public CSV hoặc gửi submission sang tài khoản cá nhân của lập trình viên.
- Không chuyển voice/audio sang dịch vụ bên ngoài nếu chưa có sự đồng ý/phê duyệt của doanh nghiệp về bảo mật và cách xử lý dữ liệu.
- Dữ liệu demo phải ghi rõ là demo.


---

<!-- Source: docs/01-SCOPE-DECISIONS.md -->

# 01 — Product scope và quyết định kiến trúc

## 1. Bối cảnh đã xác nhận
- Website công ty **NAM HÂN LOGISTICS**, file Figma 8 trang desktop 1280px; **triển khai bắt buộc cho desktop, tablet và mobile** bằng responsive cùng một bộ source.
- Website giới thiệu doanh nghiệp/dịch vụ, không cần đăng nhập, backend nghiệp vụ, CMS hoặc dashboard tùy biến.
- Có thu thập yêu cầu khách hàng, doanh nghiệp cần xem dữ liệu và **xuất ra Excel**.
- Có thành phần **“Nói thay vì nhập” phải có hoạt động thực tế**, cơ chế giọng nói cụ thể cần được business approve.
- Ưu tiên làm UI trước để giải trình doanh nghiệp, sau mới tích hợp dữ liệu.
- Yêu cầu vận hành lâu dài 4–5 năm, giảm số dịch vụ/dependency và lượng bảo trì.

## 2. Architectural decisions (approved baseline)
| ID | Quyết định | Lý do | Điều không cam kết |
|---|---|---|---|
| ADR-001 | Astro SSG, output static | 8 trang thông tin, deploy HTML/CSS/JS tĩnh | Không đồng nghĩa với không bảo trì |
| ADR-002 | TypeScript strict + scoped CSS | Ít runtime dependencies, dễ đọc/bàn giao | Không đảm bảo tự responsive |
| ADR-003 | Astro components + vanilla TS | Tránh React runtime không cần thiết | Interactive có thể cần JS nhỏ |
| ADR-004 | Static content typed TS | Không cần CMS lúc đầu | Muốn doanh nghiệp tự edit cần bổ sung quy trình |
| ADR-005 | Netlify static hosting + Netlify Forms **đề xuất cho Phase 2** | Gộp hosting và form, dashboard/CSV | Giá/quota, điều khoản sẽ thay đổi |
| ADR-006 | Voice progressive enhancement | Browser hỗ trợ thì hoạt động, không hỗ trợ nhập tay | Không đảm bảo đồng nhất browser |
| ADR-007 | Một contract lead thống nhất | 3 điểm nhận lead có thể xuất chung một CSV | Cần kiểm thử field mapping/Netlify form detection |

## 3. Ngoài phạm vi
- Hệ thống điều phối xe thật/real-time availability.
- Đăng nhập, role-based CRM, nhân sự, kho, đơn hàng, theo dõi GPS, thanh toán.
- AI speech cloud, audio processing server, live chat, các tích hợp đối tác chưa duyệt.
- Website đa ngôn ngữ, blog/CMS quản trị; **Figma mobile riêng chưa được cung cấp** nhưng **responsive mobile vẫn trong phạm vi Phase 1** (theo `docs/11-MOBILE-RESPONSIVE-SPEC.md`).
- Native XLSX export trong website public; dashboard của bên tiếp nhận xuất CSV là đủ cho nhu cầu mở bằng Excel ban đầu. Nếu bắt buộc .xlsx tự động thì phải duyệt yêu cầu mới.

## 4. Hai phase
- **Phase 1 — UI Ready:** 8 routes, fidelity desktop 1280 và responsive **mobile-first bắt buộc** (proposal + duyệt mobile/tablet), reusable components, content tĩnh, kiểm tra SEO/a11y, tương tác accordion/nav/form validation/demo; voice có thể triển khai phía browser như capability không phụ thuộc backend nếu được duyệt.
- **Phase 2 — Integration Ready:** activate Netlify Forms, dữ liệu thật, chống spam, thông báo, test export CSV, privacy, voice production compatibility, nghiệm thu vận hành.

## 5. Definition of success
- Giai đoạn UI: người dùng đi đủ 8 routes ở **320–1440 CSS px**, trải nghiệm tương tác hợp lý, menu/form/voice fallback sử dụng được trên mobile; screenshot desktop so Figma và mobile/tablet proposal được duyệt theo `docs/11-MOBILE-RESPONSIVE-SPEC.md`.
- Giai đoạn production: tất cả lead được ghi nhận hoặc báo lỗi rõ ràng; nhân viên có quyền truy cập dashboard; export CSV thực tế; restore bản deploy; trang 404 không trống; giọng nói fallback an toàn.
- 2026–2031: duy trì tài khoản domain/hosting, kiểm tra form, tình trạng phụ thuộc, và định kỳ diễn tập khôi phục. **Không hứa "zero maintenance".**


---

<!-- Source: docs/02-ARCHITECTURE.md -->

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


---

<!-- Source: docs/03-FIGMA-PAGE-MAP.md -->

# 03 — Figma to Pages / Sections Mapping

**Figma fileKey:** `EDp0z0ghKDZUdexTUjJfpL`  
**Figma link:** https://www.figma.com/design/EDp0z0ghKDZUdexTUjJfpL/NAM-H%C3%82N-LOGISTICS?node-id=0-1  
**Page:** `0:1` (`Page 1`)  
**Desktop artboards:** 1280px; mobile frames chưa quan sát được trong file. **Mobile/tablet vẫn là yêu cầu triển khai bắt buộc** với bản đề xuất tại `docs/11-MOBILE-RESPONSIVE-SPEC.md`, không coi mobile Figma artboard là có sẵn.  
**Độ chính xác:** node IDs/section labels đọc trực tiếp từ Figma ngày 25/10/2026. Slugs là đề xuất kỹ thuật; có thể khác với URL sau khi duyệt SEO.

| Route (proposed) | Frame ID | Design size | Page specification |
|---|---|---|---|
| `/` | `44:1195` | 1280 × 3702 | MainHeader `44:1554`; hero `44:1456`; overview & năng lực `44:1197`; GreenLogistics `44:1261`; testimonials `44:1310`; news `44:1513`; footer `44:1363`. |
| `/ve-nam-han/` | `92:731` | 1280 × 6880 | Hero `92:734`; about us `92:790`; statistics `92:846`; facilities `92:900`; people `92:978`; network `92:1032`; capabilities `92:1133`; industries `92:1213`; values `92:1287`; CTA `92:1327`. |
| `/dich-vu/` | `51:575` | 1280 × 2428 | Hero `51:603`; 4 service cards grid `51:639`; bottom CTA `51:724`; header `102:3214`; service module switcher `51:587` **cần xác nhận không phải navigation production**. |
| `/dich-vu/van-tai-duong-bo/` | `84:409` | 1280 × 4160 | Breadcrumb `84:412`; hero `84:427`; overview `84:484`; vehicle section `84:534`; transport options `84:624`; routes Bắc–Trung–Nam `84:683`; timeline `84:797`; stats `84:867`; CTA `84:911`. |
| `/dich-vu/boc-xep-ho-tro-van-tai/` | `84:1080` | 1280 × 4435 | Breadcrumb `84:1083`; hero `84:1103`; overview `84:1178`; support activities `84:1235`; timeline `84:1327`; partner section `84:1403`; **quick quote form `84:1470`**; CTA `84:1516`. |
| `/dich-vu/logistics-giao-nhan/` | `84:1720` | 1280 × 3954 | Hero `84:1738`; intro `84:1806`; activities `84:1864`; timeline `84:1953`; customer value `84:2028`; **route inquiry strip `84:2074`**; CTA `84:2113`. |
| `/dich-vu/giai-phap-van-tai/` | `84:2283` | 1280 × 2584 | Breadcrumb `84:2286`; hero `84:2305`; tailored solutions `84:2346`; criteria `84:2383`; consult process `84:2436`; modes `84:2476`; CTA `84:2532`. |
| `/lien-he/` | `101:1816` | 1280 × 1988 | Hero `101:1823`; **full shipping form `101:1859`**; quick-contact sidebar `101:1955`; FAQ `98:1253` with 4 items; header `101:2140`; footer `98:1386`. |

## Cross-page objects
- `MainFooter` standalone frame `102:3354` (1280 × 295), nhiều instance trong pages, so sánh bản nào mới nhất trước khi implement shared Footer.
- `Html → Body` frame `121:2` chứa Header/Footer; cần xác nhận là spec tham khảo hay component mới hơn, **không tự hiển thị thành trang thứ 9**.
- Các `MainHeader` xuất hiện lặp lại ở các page nodes; cần xây **một** `SiteHeader.astro`, menu desktop/mobile consistent.
- Service overview có các card tới 4 trang con; breadcrumbs và CTA phải điều hướng route thật.

## Nội dung cần doanh nghiệp duyệt
- Trang chủ có số liệu như `73+ xe`, `2 bãi xe`, `32 giờ`…; phải xác minh tính chính xác và cập nhật trước production.
- Trang chủ có 3 bài `Tin nổi bật` và nút `Xem tất cả` nhưng trong 8 frames **không có** trang blog/article độc lập. Trong Phase 1: không tạo trang thật giả; quyết định ẩn CTA, chuyển tới anchor, hoặc bổ sung phạm vi sau duyệt.
- Testimonials/tên khách hàng/đối tác/chứng nhận: kiểm tra quyền công bố trước production.
- Footer có links Sitemap, Chính sách bảo mật, Điều khoản sử dụng và các anchor/đường dẫn dịch vụ: phải xác định link/đích tới từng mục trước nghiệm thu.

## Định nghĩa 3 điểm nhận yêu cầu
1. **Main contact form**, `101:1859`: Cá nhân/Doanh nghiệp, tên công ty/họ tên, điểm đi, điểm đến, hàng hóa, khối lượng, SĐT/Zalo, voice UI.
2. **Handling quick quote**, `84:1470`: tên doanh nghiệp/người gửi, số điện thoại, địa điểm bốc xếp/tập kết, loại hàng & quy cách, nhu cầu cơ giới.
3. **Route inquiry**, `84:2074`: điểm nhận và điểm giao, CTA `Kiểm tra xe có sẵn`. Không có live dispatch backend; bản production phải xác nhận wording/flow (lead request không phải trả kết quả inventory).

## Quy trình mỗi trang cho ANti
- Load node parent bằng Figma MCP, screenshot và metadata; kiểm tra từng nested section trước khi code.
- Tạo component map, export asset gốc, giữ nguyên text/visual states có trong Figma.
- Render ở desktop 1280 và so với reference. Kế đến phát triển tablet/mobile và xin duyệt.
- Cập nhật checklist acceptance cho chính route đó rồi mới triển khai route khác.

## Responsive acceptance mapping

- Tất cả 8 route trong bảng phải có screenshot và kiểm thử mobile/tablet theo `docs/11-MOBILE-RESPONSIVE-SPEC.md` mục E và F.
- Node IDs bên trên là **desktop reference**; không gán chúng cho giao diện mobile như thể Figma đã phê duyệt.
- Đối với trang dài như `Về Nam Hân`, kiểm tra top/middle/bottom, thứ tự nội dung/CTA và performance mobile, không chỉ hero.


---

<!-- Source: docs/04-DESIGN-UI-SPEC.md -->

# 04 — UI / Design System / Responsive Specification

## 1. Design foundation
**Verified in Figma reference code (đặc biệt trang Liên hệ):** font Inter; màu navy `#0B2545`, cam `#F95016`; nền sáng thường dùng `#F8FAFC`, màu chữ phụ `#475569`, border `#E2E8F0`; `#2563EB` xuất hiện trong voice/radio. Đây là **seed tokens**, phải tiếp tục audit với Figma ở tất cả routes, không áp đặt làm palette duy nhất.

```css
:root {
  --color-brand-navy: #0b2545;
  --color-brand-orange: #f95016;
  --color-text-secondary: #475569;
  --color-border: #e2e8f0;
  --color-bg-muted: #f8fafc;
  --color-action-blue: #2563eb;
  --font-sans: 'Inter', system-ui, sans-serif;
}
```
Thiết kế ghi nhận radius lớn tại form contact (`24px` card, `16px` CTA, `12px` input); dùng token variants nếu lặp lại. **Không** lấy những con số này làm quy luật tất cả component trước khi audit.

## 2. Primitive & composition
- Layout: `SiteLayout`, `SiteHeader`, `SiteFooter`, `Container`, `Breadcrumb`, `SectionHeading`.
- Shared UI: `PrimaryCTA`, `SecondaryCTA`, `ServiceCard`, `IconFeatureCard`, `StatCard`, `TimelineStep`, `FAQAccordion`, `InputField`, `TextAreaField`, `RadioGroup`, `FormMessage`.
- Sections theo route: `HomeHero`, `HomeOverview`, `GreenLogistics`, `Testimonials`, `LatestNews`; `CompanyHero`, `Facilities`, `People`, `Network`, `CoreValues`; `ServiceHero`, `ServiceFeatureGrid`, `ServiceProcessTimeline`, `ContactCTA`.
- Chỉ trích xuất reusable component khi layout và chức năng trùng nhau; giữ section-specific styles tại nơi dùng.

## 3. Responsive design policy [REQUIRED in Phase 1, layout proposal pending approval]
- Figma hiện có frame desktop rộng **1280px** cho 8 màn hình. Không có mobile artboard độc lập được xác minh. **Mobile/tablet UI bắt buộc phải build ngay Phase 1**; chi tiết triển khai xem `docs/11-MOBILE-RESPONSIVE-SPEC.md` (nguồn chuẩn cho responsive).
- Xây CSS mobile-first, breakpoint đề xuất **<=767px mobile**, **768–1023px tablet**, **>=1024px desktop**; sau kiểm tra với content thực tế có thể điều chỉnh (đây không phải số liệu từ Figma).
- Desktop tối ưu fidelity 1280px; tại 1440/1920 không kéo giãn container vô hạn; section full bleed vẫn responsive.
- Tablet: 2-column có thể chuyển 1 column khi nội dung quá chật; cards 4-wide -> 2-wide; timeline horizontal có thể chuyển vertical.
- Mobile: header hamburger keyboard-accessible, menu focus management, images correct aspect ratios, all forms stack 1 column, CTA có target >=44×44 CSS px, không overflow ngang ở 320–390px.
- Typography fluid khi có lợi ích, không đặt cố định height cho khối chứa text tiếng Việt.
- Không đòi hỏi pixel-perfect mobile nếu doanh nghiệp chưa duyệt thiết kế responsive suy diễn. Deliver screenshots xin phê duyệt. **Không được bỏ qua các tính năng trên mobile chỉ vì chưa có Figma mobile frame.**

### Mobile delivery checklist (required)
- Bắt đầu kiểm tra layout tại **375px** rồi 320/360/390/430; chốt ở 768/1024/1280/1440 để tránh sửa cuối dự án.
- Header hamburger/menu keyboard-accessible, đủ link; hero cropping/lớp chữ đúng; cards/timeline đọc đúng thứ tự; footer không biến mất.
- 3 điểm tiếp nhận yêu cầu trên mobile: form 1 cột, input >=16px, tap target product goal >=44px, keyboard không che CTA, không báo thành công giả.
- Trạng thái mobile UX **PROPOSED** đến khi business/design owner duyệt screenshot; xem `docs/11-MOBILE-RESPONSIVE-SPEC.md`.

## 4. Assets & performance
- Xuất logo/ảnh/SVG gốc từ Figma; **không** dùng screenshot nguyên frame như background thay thế UI.
- Ưu tiên Astro `<Image/>` hoặc `<Picture/>` cho ảnh local, giữ ảnh logo và icon vector ở định dạng thích hợp.
- Hero image priority cao, đặt `width/height` hoặc `aspect-ratio` tránh CLS; ảnh dưới fold lazy-load.
- Các ảnh về dịch vụ/đội xe/kho và chân dung cần alt có nghĩa nếu informative; ảnh trang trí `alt=""`.
- Giữ font Inter theo license phù hợp, có fallback; có thể self-host bản WOFF2 được cấp phép.
- Không thêm slider library nếu component native CSS/JS nhỏ giải quyết được.

## 5. Interaction rules
- Header/nav: các link route thật, dropdown trên mobile/desktop điều khiển bằng keyboard, Escape đóng, focus visible.
- CTA: trỏ đúng `/lien-he/` hoặc section hợp lệ; không `href="#"` production.
- FAQ: `details/summary` native hoặc button với `aria-expanded`, `aria-controls`, support keyboard.
- Quote form: validate có thông báo rõ và bằng tiếng Việt; hiển thị trạng thái chưa tích hợp khi demo.
- Voice banner: component tương tác thật khi browser hỗ trợ và được duyệt, không chỉ ảnh; fallback text nhập tay.
- Timeline, gallery: thông tin có ý nghĩa đọc được khi JS off, animation không bắt buộc.
- News: thẻ bài có link hợp lệ sau duyệt, tránh 404/CTA vô dụng.
- Motion: nhẹ, có `prefers-reduced-motion` fallback, không tự thêm hiệu ứng làm thay đổi UI Figma.

## 6. Accessibility / SEO
- `html lang="vi"`, một H1/page, heading H2/H3 theo thứ tự; landmarks header/nav/main/footer.
- Contrast theo WCAG 2.2 AA; orange text nhỏ trên trắng phải đo contrast, không mặc định đạt.
- Mọi form có label semantic, error chỉ ra field, focus hướng tới lỗi; nút mic có tên/trạng thái accessible.
- SEO: title và description riêng cho 8 trang, canonical production URL, OG tags, sitemap, robots, URLs thân thiện, structured data Organization nếu thông tin doanh nghiệp được xác nhận.
- Các trang preview/staging chưa duyệt phải `noindex` và không dùng canonical domain giả.

## 7. Asset / content audit checklist
- File asset gốc có tên, định dạng, giấy phép sử dụng, alt (nếu cần), Figma node source, kích thước.
- Nội dung doanh nghiệp được xác minh: số liệu, ngày tin tức, trích dẫn, địa chỉ, điện thoại, email, giờ làm việc, cam kết thời gian phản hồi.
- Không để ảnh stock/sai logo tự ý thay thế asset còn thiếu. Nếu chưa có asset: đánh dấu block và báo người duyệt.


---

<!-- Source: docs/05-FORMS-DATA.md -->

# 05 — Forms, Lead Data Contract & Excel Export

## 1. Mục tiêu
Website **không cần** database riêng / PHP server. Sau Phase 2, doanh nghiệp nhận dữ liệu thật của 3 hình thức liên hệ và xuất về **một bộ dữ liệu bảng** phục vụ Excel. Dịch vụ đề xuất: **Netlify Forms**. Netlify dashboard export **CSV**; mở/lưu thành XLSX trong Excel nếu muốn. Không tuyên bố Netlify tạo `.xlsx` trực tiếp.

## 2. Các hình thức biểu mẫu xác minh từ Figma
| `request_type` | Figma ID | Fields nhìn thấy trong thiết kế | CTA |
|---|---|---|---|
| `shipment_quote` | `101:1859` | customer type, company/name, origin, destination, cargo description, quantity, phone/Zalo, voice control | Gửi yêu cầu vận chuyển |
| `handling_quote` | `84:1470` | sender name, phone, location, cargo/type, machine need | Gửi yêu cầu điều phối |
| `route_inquiry` | `84:2074` | pickup, delivery | Kiểm tra xe có sẵn — **cần đổi/cần xác nhận** khi không có live availability |

**Lưu ý bắt buộc:** route_inquiry đang thiếu SĐT/Zalo trong Figma. Không thể phản hồi khách chỉ từ điểm đi/đến. Bắt buộc doanh nghiệp duyệt: thêm số điện thoại hoặc chuyển CTA đến form Liên hệ đã điền sẵn điểm nhận/điểm giao. Không thu thập lead thật cho luồng này trước khi giải quyết.

## 3. Canonical normalized lead schema (proposed for Phase 2)
| Field | Type | Required | Mapping |
|---|---|---|---|
| `request_type` | enum | Yes | 3 types ở trên |
| `customer_type` | `individual` / `business` / empty | Theo form | main contact radio |
| `contact_name` | string (<= 150) | Yes | company/name or sender |
| `phone_zalo` | string (<= 30) | Yes trước production | all flows: route inquiry needs change |
| `origin` | string (<= 200) | theo form | main contact, route inquiry |
| `destination` | string (<= 200) | theo form | main contact, route inquiry |
| `cargo_description` | string (<= 1500) | theo form | main contact / handling cargo |
| `cargo_volume` | string (<= 200) | No | main contact |
| `handling_location` | string (<= 200) | theo form | handling form |
| `equipment_need` | string (<= 200) | No | handling form |
| `source_page` | known route | Yes | UI origin |
| `consent` | `yes` | Yes, sau khi privacy notice duyệt | user permission |
| `submitted_at` | provider timestamp | provider | không tin timestamp client |

Schema này là thiết kế dữ liệu **đề xuất**, field required/business rules phải được duyệt. Không khai báo email là required vì Figma hiện không có email trong form chính.

## 4. One CSV dataset, not three fragmented exports
- Dùng **một tên form chuẩn** `lead_request` và `request_type` để phân loại.
- Tạo **một static HTML detection blueprint** duy nhất với **superset field names**. Netlify phải thấy form này trong output `dist` lúc deploy. Tất cả 3 UI variants map về cùng canonical names.
- Adapter chuẩn hoá từng variant trước khi POST. Validate dữ liệu từng request_type; không tự gán giá trị giả.
- Netlify form detection phải được kích hoạt trong dashboard; sau deploy phải có `lead_request` trong Forms tab.
- Nếu dùng JS fetch, send `application/x-www-form-urlencoded` cùng `form-name=lead_request` và đúng các field đã đăng ký. Netlify Forms HTML detection không nhận form chỉ xuất hiện client-side; phải test trên bản deploy Netlify thật.
- Ưu tiên HTML POST không JS ở production cho form chính để progressive enhancement; AJAX chỉ thêm nếu có ích UX.
- Demo Phase 1: chỉ validate/hiển thị UI thử nghiệm; không POST hoặc ghi nhận khách thật. **Không mô phỏng thành công giả**.

## 4a. Mobile form requirements (Phase 1 and Phase 2)
- Cả `shipment_quote`, `handling_quote`, `route_inquiry` dùng chung schema; mobile chỉ thay layout, **không làm mất field**.
- Form chính `/lien-he/`: group radio lớn và dễ bấm; tên, điểm đi, điểm đến, mô tả, khối lượng, SĐT/Zalo xếp **một cột** theo thứ tự đọc. Sidebar hướng dẫn đưa xuống sau form.
- Quote nhanh và route inquiry: fields stack, error dưới đúng input, CTA không bị browser keyboard che; không tự thông báo “có xe” nếu không có điều phối thật.
- `font-size` input >=16px; CTA/touch target theo `docs/11-MOBILE-RESPONSIVE-SPEC.md`; thử trên iOS Safari và Android Chrome thật.
- Khi có validation error / lỗi network: dữ liệu đang nhập giữ nguyên, error nhận biết được bằng screen reader, focus chỉ tới trường cần sửa.

## 5. States & validation
| State | Hành vi |
|---|---|
| `idle` | UI bình thường; nút gửi khả dụng nếu đã approve |
| `invalid` | Ngăn gửi, focus trường lỗi, mô tả lỗi dễ hiểu, không mất dữ liệu |
| `submitting` | Disable duplicate submit, trạng thái loading/aria-busy |
| `success` | Chỉ hiển thị khi provider xác nhận nhận submission; confirmation rõ không báo thời gian phản hồi nếu chưa được duyệt |
| `error` | Không xoá input; gợi ý thử lại/liên hệ hotline; không show stack trace |
| `demo-not-connected` | Preview Phase 1: “Đây là bản demo giao diện, chưa gửi dữ liệu tới Nam Hân.” |

- Required validation server/provider vẫn cần; client validation không đủ chống spam.
- Khi voice đã chuyển thành chữ, text nằm trong trường `cargo_description` như input thường; **không upload raw audio** theo baseline.
- Throttling/anti-bot: bật Netlify spam handling, honeypot, cân nhắc CAPTCHA theo chất lượng lead; test false positive và trải nghiệm mobile.

## 6. Excel & CSV
- Nhân sự đăng nhập **dashboard Netlify do doanh nghiệp sở hữu**, Forms -> `lead_request` -> Download as CSV.
- CSV phải có cột nhất quán và Unicode tiếng Việt được đọc đúng khi mở Excel; hướng dẫn Import/UTF-8 nếu bị lỗi encoding.
- Có thể `Save As .xlsx` từ Microsoft Excel; nếu doanh nghiệp yêu cầu download `.xlsx` ngay trên website, đó là thay đổi scope.
- **CSV injection risk:** trường khách nhập có thể bắt đầu bằng `=`, `+`, `-`, `@`. Không tự tin vào CSV thô khi double-click Excel; hướng dẫn mở qua Power Query/import as text hoặc xử lý escape khi xuất sang hệ thống khác. Không mở CSV không rõ nguồn với macro.
- Không xuất dữ liệu PII trực tiếp ở frontend public. Không đặt CSV trong `public/` hoặc CDN.

## 7. Security, ownership & privacy
- Tài khoản Netlify và repository do doanh nghiệp sở hữu; ít nhất 2 người quản trị, 2FA.
- Các trường chứa dữ liệu cá nhân phải có privacy notice/consent do doanh nghiệp hoặc tư vấn pháp lý duyệt; policy retention và quyền xoá dữ liệu được chốt trước go-live.
- Quy trình phân quyền truy cập submissions; không share dashboard bằng tài khoản cá nhân chung.
- Không log raw request body, không gửi PII sang analytics.
- Kiểm tra plan/quota/giá/form retention và thông báo trước khi ký bàn giao; giới hạn nhà cung cấp có thể thay đổi.
- Thử submit thật trước go-live, đối chiếu dashboard, notification và CSV; test spam và failure modes.

## 8. Exit strategy
- Khi chuyển khỏi Netlify, static `dist/` có thể chuyển host khác, nhưng **phải thay form adapter/provider**, chuyển dữ liệu submission theo CSV export và kiểm tra permissions.
- Lưu hợp đồng field schema + migration guide; không thiết kế UI phụ thuộc endpoint proprietary.

Reference:
- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/submissions/
- https://docs.netlify.com/manage/forms/spam-filters/


---

<!-- Source: docs/06-VOICE-INPUT.md -->

# 06 — Voice Input (Nói thay vì nhập)

## 1. Figma reference
Trang Liên hệ `101:1816`, voice banner node **`101:1937`**, trong form `101:1859`. Text hiển thị:
- “Nói thay vì nhập”
- “Nhấn để ghi âm mô tả yêu cầu vận chuyển của bạn”

Người dùng xác nhận **phải hoạt động thật**. Tuy nhiên, giao tiếp cuối cùng với dữ liệu chưa được xác nhận: speech-to-text hay đính kèm file ghi âm. Để phù hợp chủ trương không backend, baseline proposal là **Speech-to-text tiếng Việt**, không lưu audio. Cần doanh nghiệp duyệt trước production; nếu yêu cầu gửi audio thì mở ADR.

## 2. UX state machine — phase 1 có thể xây trước khi kết nối form
1. `unsupported`: API không có / browser không hỗ trợ; ẩn/disable nút mic với giải thích và giữ textarea nhập tay.
2. `idle`: nút "Bắt đầu nói"; không xin microphone permission tự động.
3. `requesting_permission`: khi người dùng chủ động bấm; giải thích quyền microphone, UI busy.
4. `listening`: nút chuyển "Dừng" và hiện aria-live trạng thái đang nghe; không khẳng định ghi file.
5. `transcribing`: khi nhận kết quả, đưa text vào textarea `cargo_description` (có thể append sau khi người dùng chọn).
6. `complete`: người dùng kiểm tra/sửa lại text trước khi gửi.
7. `permission_denied` / `no_speech` / `network_error` / `aborted`: message rõ, fallback nhập tay; không mất nội dung trước đó.

## 3. Interface boundary
```ts
interface VoiceTranscriber {
  isSupported(): boolean;
  start(options: { language: 'vi-VN' }): void;
  stop(): void;
  onTranscript(callback: (text: string, isFinal: boolean) => void): void;
  onError(callback: (code: string) => void): void;
}
```
- Chọn Web Speech API (`SpeechRecognition` hoặc `webkitSpeechRecognition`) khi feature-detected; `lang='vi-VN'`.
- Không thêm thư viện speech hoặc secret client-side. Không tự thu MediaRecorder và upload file.
- Không ghi audio vào localStorage/analytics/log. Cần notice phù hợp vì một số browser sử dụng speech service bên ngoài.
- Cho phép edit thủ công; không tự submit khi hoàn thành nhận diện.
- Nếu voice thất bại, toàn bộ website và form vẫn phải dùng được.

## 3a. Mobile-specific UX contract
- Nút mic nằm trong flow form contact có nhãn nhìn thấy; phải bấm/chạm rõ và thao tác được khi keyboard đang mở hoặc sau khi đóng keyboard.
- Khi bật chế độ nghe: thể hiện trạng thái và nút `Dừng`; không chiếm toàn màn hình trừ khi được duyệt.
- Khi xoay điện thoại, viewport thay đổi hoặc đóng/mở keyboard, không mất transcript hay dữ liệu nhập.
- Nếu mic denied/unsupported hoặc tab bị background, dừng/quản lý trạng thái an toàn; textarea vẫn nhập tay được và submit không phụ thuộc mic.
- Trước nghiệm thu voice mobile phải kiểm thử **thiết bị thật** iOS Safari và Android Chrome trong phạm vi hỗ trợ, không chỉ desktop hoặc emulation. Xem `docs/11-MOBILE-RESPONSIVE-SPEC.md`.

## 4. Browser support (không được overpromise)
- SpeechRecognition **không phải Baseline**: khả năng hỗ trợ browser/device khác nhau. Test Chrome desktop, Edge desktop, Android Chrome, Safari iOS; trên browser unsupported hiển thị fallback rõ.
- Chỉ kiểm tra feature detection không đủ: thử mic permission, tiếng Việt, network error, deny và cancel thực tế.
- Việc speech phải hoạt động trên tất cả browser có thể buộc chuyển sang speech service khác (phát sinh chi phí/backend privacy); cần quyết định mới.
- Voice không thay thế validation field; sử dụng như một tùy chọn nhập liệu.

## 5. Acceptance
- API supported: user click mic -> browser asks permission -> user speaks tiếng Việt -> thấy transcript -> edit -> submit qua form (khi Phase 2 active).
- Browser unsupported / permission denied: form text entry vẫn đầy đủ; thông báo có thể truy cập bằng keyboard/screen reader.
- Không có auto recording/background mic access hoặc lưu audio khi không được duyệt.
- Không cần reimplement layout chung khi thay speech adapter.

Reference: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition


---

<!-- Source: docs/07-QA-ACCEPTANCE.md -->

# 07 — QA, Test Matrix & Acceptance Criteria

## 1. Acceptance gates
### Gate 1: Architecture
- [ ] `astro.config.*` explicit `output: 'static'`; no SSR adapter / PHP / database / hidden Node server.
- [ ] `package-lock.json` committed; `npm ci`, `npm run check`, `npm run build` pass on pinned Node.
- [ ] `dist/` generated and 8 expected routes exist; no secrets/tokens or PII in built JS/HTML.
- [ ] All components in layers; no design screenshots as sections, no Figma temporary image URLs.

### Gate 2: Figma UI
- [ ] Desktop 1280px screenshot comparison for **all eight routes** to Figma parent nodes.
- [ ] Header/Footer consistency across routes; typography, colors, layout, images and CTA checked.
- [ ] **Tất cả 8 routes** được chạy responsive screenshot matrix **320/360/375/390/430/768/1024/1280/1440** và thử 1920; đề xuất mobile/tablet được duyệt; không horizontal document scroll 320+, không cắt chữ/CTA.
- [ ] Asset audit: every visible image/svg has correct source/ratio/alt and no broken assets.
- [ ] Text/numbers/contact info and testimonials review signed off by business.

### Gate 3: Interaction + Accessibility
- [ ] Menu keyboard/screen reader; Escape closes; focus can return to trigger.
- [ ] FAQ accordion keyboard; aria state correct.
- [ ] 100% internal links have valid destinations, no `href="#"`, no 404.
- [ ] Main contact form validation (even demo); inaccessible/inert CTA count = 0.
- [ ] Voice feature detects support, handles permission denied/error, preserves typed text; no unwanted mic startup. **Có test iOS Safari và Android Chrome thiết bị thật trước khi bật production voice.**
- [ ] Reduced motion, contrast, semantic landmarks, labels/errors and focus visible. WCAG 2.2 AA target.

### Gate 4: Performance & SEO
- [ ] Each page: distinct title/H1/meta description/canonical for final domain.
- [ ] robots/sitemap configured; staging noindex; legal/marketing claims approved.
- [ ] Critical mobile performance goal in production: Core Web Vitals at 75th percentile LCP <=2.5s, CLS <=0.1, INP <=200ms when measurable; verify with real-user field data when available, not just one Lighthouse run.
- [ ] Lighthouse lab target for mobile baseline >=90 Performance and >=90 Accessibility, subject to recorded network/device/profile; fix significant issues rather than promise unconditional score.
- [ ] Images below fold lazy-load; hero/LCP properly prioritized, no excess JS.

### Gate 5: Form Integration (only Phase 2)
- [ ] All 3 inquiry UIs follow same canonical field schema and single `lead_request` dataset.
- [ ] Real Netlify deployment detects form; verified submission visible in dashboard.
- [ ] Valid submit -> true confirmed success; invalid/error -> retains data + actionable message.
- [ ] CSV downloaded, UTF-8 Vietnamese correct, columns align, sample 3 request_types and source_page.
- [ ] Anti-spam honeypot live and tested; no accidental collection of unapproved PII.
- [ ] Test real phone/voice integration on required browser matrix, fallback supported.
- [ ] Business account access, notification, retention, privacy text accepted and documented.

### Gate 2a: Mobile-first functional acceptance (REQUIRED, not a stretch goal)
- [ ] Menu mobile: touch/keyboard hoạt động, mở/đóng/ESC/focus đúng, dropdown dịch vụ truy cập được.
- [ ] Các grid 2x2, section hai cột và 4-step timeline đổi sang một cột/dọc khi cần; giữ thứ tự nội dung và CTA.
- [ ] Form trong cả **3 điểm nhập yêu cầu** stack 1 cột ở mobile; label/error đọc được; input font >=16px; chạm target >=44px theo product target.
- [ ] iPhone Safari và Android Chrome kiểm tra mobile browser keyboard, permission microphone, overflow, focus và form data preservation.
- [ ] 200% zoom / enlarged text, portrait/landscape, reduced motion; CTA/form/footer không bị mất hoặc che khuất.
- [ ] Desktop 1280 so Figma; mobile/tablet **không được gắn nhãn Figma-approved** khi chưa có bản ký duyệt của reviewer; lưu review record mẫu tại `docs/11-MOBILE-RESPONSIVE-SPEC.md`.

## 2. Test matrix
| Device/browser | Visual | Navigation | Forms | Voice |
|---|---|---|---|---|
| Chrome desktop (Windows) | Must | Must | Must | Test supported behavior |
| Edge desktop (Windows) | Must | Must | Must | Test supported behavior |
| Firefox desktop | Must | Must | Must | May be unsupported; graceful fallback |
| Safari desktop (macOS) | Must | Must | Must | Test supported behavior |
| Chrome Android | Must | Must | Must | Test device support |
| Safari iOS | Must | Must | Must | Test device support |
| 320px mobile viewport | Must | Must | Must | N/A API depending browser |

## 2a. Required mobile test cases

```text
MOB-NAV-001: At 320px, menu opens/closes on tap, keyboard and Escape; all routes accessible, focus not lost.
MOB-FORM-001: On mobile with keyboard open, all contact fields usable, Submit visible/reachable, errors announced, draft preserved.
MOB-VOICE-001: On real iOS Safari and Android Chrome, test supported/denied/unsupported microphone states; manual input always works.
MOB-LAYOUT-001: At 320/375/390/430/768/1024, each of 8 routes has no document horizontal overflow and critical sections present.
MOB-A11Y-001: At 200% zoom/enlarged text, all 8 routes remain readable and touch-operable; focus remains visible.
```

## 3. Test case format agent phải dùng
```
ID: UI-CONTACT-001
Route: /lien-he/
Figma node: 101:1859
Given: user opens contact form
When: submit with missing phone
Then: no submission; error visually shown and announced; all other entered data retained
Automation: Playwright E2E or documented manual verification
Evidence: screenshot + pass/fail + browser
```

## 4. UAT sign-off
- UI/design lead phê duyệt desktop + mobile proposal.
- Đại diện doanh nghiệp phê duyệt nội dung/số liệu/đường dẫn và những trạng thái demo.
- Giai đoạn production: đại diện doanh nghiệp nghiệm thu sample submission/export và quy trình tiếp nhận yêu cầu.
- Bất kỳ pending critical item nào đều chặn go-live.


---

<!-- Source: docs/08-OPERATIONS-5Y.md -->

# 08 — Deployment, Handover & 4–5 Year Low-Maintenance Plan

## 1. Phân biệt web tĩnh và dịch vụ sống
HTML/CSS/JS đã build **không tự hỏng** chỉ vì Astro có bản mới. Tuy nhiên các yếu tố bên ngoài vẫn thay đổi: domain/DNS, TLS, Netlify pricing/quota, form processing, browser compatibility voice, chính sách bảo mật, pháp lý. Không hứa tuyệt đối "làm một lần không bảo trì 5 năm".

## 2. Production topology
- Hosting: Netlify static hosting (đề xuất do dùng Netlify Forms).
- Git: GitHub repo doanh nghiệp, branch protected `main`, PR review cho mọi thay đổi; giữ ít nhất 1 copy offline export.
- Build: `npm ci && npm run check && npm run build`; publish `dist`.
- Domain: doanh nghiệp sở hữu, auto-renew + backup admin, DNS/tên miền có invoice; one canonical `www` or apex và redirect 301 nhất quán.
- TLS: managed HTTPS và verify renewal/chứng chỉ; force HTTPS.
- Headers: X-Content-Type-Options, Referrer-Policy, permissions restrictions (microphone only where needed), conservative CSP sau khi test voice/form/asset; tránh đặt CSP sai làm gãy feature.
- Preview: noindex, không có dữ liệu khách thật. Production chỉ deploy từ release đã duyệt.

## 3. Version policy
- Khi bootstrap, xác nhận bản Astro stable và phiên bản Node LTS hỗ trợ, rồi ghi `.nvmrc`, `engines`, lockfile; không tự động đổi major.
- `npm ci` để tái lập dependency tree. Nhớ rằng lockfile không đóng băng hạ tầng CDN/toolchain nhà cung cấp, nên lưu bản `dist/` và metadata release.
- Đến cuối hỗ trợ Node, cần chuyển build environment sang bản LTS khác nếu phải rebuild. Theo thông báo lịch Node ngày 25/10/2026, Node 26 LTS dự kiến EOL tháng 04/2029. Cập nhật trước mốc đó nếu chọn Node 26.
- Không auto-merge dependency/security upgrades thẳng production. Review PR, build, tests rồi deploy; theo dõi advisories có tác động đến build/tooling.
- Ít nhất **mỗi năm thử clean-room rebuild** trên môi trường được hỗ trợ để không phụ thuộc máy lập trình viên cũ.

## 4. Routine runbook (đề xuất trách nhiệm doanh nghiệp)
| Cadence | Kiểm tra | Owner |
|---|---|---|
| Hằng tuần hoặc ít nhất hằng tháng | Gửi một yêu cầu form thử, xác nhận dashboard nhận, thông báo, dữ liệu CSV; xoá dữ liệu test | Nhân viên được giao |
| Hằng tháng | Kiểm tra site/home/contact, HTTPS, 404, giá/quota, hạn domain, log availability | Owner vận hành |
| Hằng quý | Export/backup lead theo retention policy, kiểm soát quyền, audit link, mobile browser phổ biến | Owner vận hành |
| Mỗi 6 tháng | Test voice, form, **iOS Safari + Android Chrome** và các browser được hỗ trợ; review vendor changes và bảo mật | Technical owner |
| Hằng năm | Thử build sạch và redeploy preview, kiểm thử rollback, soát dependency và Node LTS | Technical owner |
| Trước khi runtime hết hỗ trợ | Upgrade Node/Astro có kiểm thử nếu cần rebuild, không nâng bừa | Technical owner |

Tần suất có thể giảm theo SLA hợp đồng nhưng **không loại bỏ hoàn toàn** kiểm tra form: vì đây là kênh kinh doanh chính của website.

## 5. Backups & disaster recovery
Bàn giao và lưu ở tài khoản doanh nghiệp:
- Git repo và release tag (`v1.0.0`), commit hash.
- Khoá phiên bản Node, `package-lock.json`, `package.json`, CI config, `netlify.toml`.
- `dist/` bản deploy cuối cùng dưới dạng archive có checksum SHA-256.
- Figma link, danh sách ảnh/giấy phép sử dụng, nội dung được duyệt, **responsive screenshots/review records của đủ 8 trang và device QA results**.
- Domain registrar + DNS record inventory + hướng dẫn bật lại DNS.
- Netlify site/team owner, Forms admin access, form name và dữ liệu export theo chính sách.
- Tài liệu restore: deploy archived `dist` lên static hosting -> test 8 routes -> cấu hình domain/HTTPS -> nếu chuyển provider, cấu hình lại form adapter -> test submission/export.

**RPO/RTO:** chưa chốt; không đưa con số vô căn cứ. Cần hỏi doanh nghiệp mức chấp nhận mất dữ liệu và thời gian khôi phục. Nội dung static có thể restore từ archive; lead data phải backup/export riêng.

## 6. Owner & account policy
- Không dùng tài khoản Netlify, Figma, domain hoặc GitHub cá nhân của developer làm owner duy nhất.
- Ít nhất 2 tài khoản quản trị được phê duyệt, 2FA, recovery codes offline.
- Hướng dẫn doanh nghiệp: cập nhật nội dung tĩnh cần developer/build mới; form dashboard không phải CMS.
- Không lưu mật khẩu/secret trong repo hoặc file bàn giao công khai.

## 7. Sự cố thường gặp và xử lý
| Triệu chứng | Kiểm tra | Khắc phục |
|---|---|---|
| Website không mở | domain expiry, DNS, Netlify outage, TLS | theo domain/DNS inventory, revert DNS nếu có thủ tục |
| Form không nhận | Netlify form detection, form-name, quota, spam tab | test site deploy, check blueprint HTML, redeploy |
| Có khách nhập nhưng không email | notification setting, email spam, dashboard submissions | dashboard là source of truth; sửa notification, không mất lead nếu đã lưu |
| Excel lỗi tiếng Việt | import encoding | Import CSV với UTF-8 trong Excel |
| Voice không chạy | permission/browser/device/HTTPS | fallback nhập tay; review compatibility, không chặn form |
| Build từ source lỗi sau vài năm | Node EOL/dependencies/toolchain | dùng archived `dist` để phục vụ site; tái lập env và nâng version có test |

## 8. Budget/plan policy
- Không mặc định gói Netlify Forms miễn phí đáp ứng số lượng leads/traffic; kiểm tra giá/quota và retention tại ngày hợp đồng.
- Bảo trì ở mức thấp **không có nghĩa zero-cost hoặc zero-responsibility**.

Reference:
- https://docs.astro.build/en/guides/deploy/netlify/
- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/submissions/
- https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule


---

<!-- Source: docs/09-PHASES-AND-TASKS.md -->

# 09 — Implementation Plan / Agent backlog

## Phase 0: Handover baseline, không code UI vội
**Outputs:** Figma inventory, routes, design tokens audit, asset map, dependency baseline, approved responsive direction, content/legal issues list.
- P0.1 đọc `AGENTS.md`, đủ spec, audit repository rỗng/đang có.
- P0.2 xác nhận Figma đúng file key / 8 frames.
- P0.3 xuất assets gốc, font, logo, toàn bộ token seed.
- P0.4 **đọc `docs/11-MOBILE-RESPONSIVE-SPEC.md`**, dựng mobile-first layout proposal từ desktop 1280, chụp 375/768/1280 cho Header, Hero, Form, Footer và gửi duyệt; **không chờ có Figma mobile mới build mobile**.
- P0.5 chốt slug route và cách xử lý các links thiếu trang (Tin nổi bật, legal, sitemap).
- P0.6 ghi Node LTS được hỗ trợ, commit lockfile, setup CI.

## Phase 1A: Design System, layout
**Deliver:** SiteLayout, Header, Footer, breadcrumb, button/section primitives, tokens CSS, metadata component, responsive grid, no third-party UI framework.
**Acceptance:** 1280px header/footer compare Figma; mobile menu ở 320/375/390 accessible (touch, keyboard, ESC); typography, max-width, safe areas, CTA trong view; build clean.

## Phase 1B: Core pages
1. `/` frame `44:1195`; 2. `/ve-nam-han/` frame `92:731`; 3. `/dich-vu/` frame `51:575`.
**Acceptance:** Figma 1280 match + screenshot mobile 320/375/390/430, tablet 768/1024; links và content source map; responsive, alt, touch target, no overflow review.

## Phase 1C: Four service pages
- Road transport `84:409`.
- Handling support `84:1080` with quick quote UI.
- Logistics delivery `84:1720` with route inquiry UI.
- Transport solutions `84:2283`.
**Acceptance:** Reuse known shared components; cards 1-col mobile và timeline vertical; no dead CTA or fake availability; all quote/inquiry fields usable on mobile; no unintended duplicate headers/footers.

## Phase 1D: Contact, voice-ready UI
- `/lien-he/` frame `101:1816`: contact form controls/validation, FAQ accordion, sidebar, mobile.
- `DemoLeadSubmissionPort`: no network POST, visible demo status; no fake success.
- Browser voice adapter if feature approved; graceful fallback, no audio upload.
- Internal link integrity + 404; performance optimization + pre-UAT screenshots.

## Phase 1 Exit / UI UAT
- Checklist in `07-QA-ACCEPTANCE.md` Gates 1–4 complete.
- Demo hosted preview with `noindex` and no real customer submissions.
- Export annotated screenshots of all 8 pages: 320/360/375/390/430 mobile, 768/1024 tablet, 1280 Figma desktop, 1440 wide desktop; dùng review record trong `docs/11-MOBILE-RESPONSIVE-SPEC.md`.
- Business/design-owner sign-off on **responsive proposal của 8 routes**, navigation, words, assets, color, contact details, voice behavior desired.

## Phase 2A: Business contract
- Approve routes, policy/consent, fields, contact/notification owners, retention, quota, domain, voice support/browser matrix.
- Especially resolve form route inquiry currently missing contact details and promise “15 phút”.

## Phase 2B: Production lead integration
- Implement `lead_request` canonical contract, Netlify static detection blueprint, spam/honeypot, true success/error states.
- Add notification/owner, test real submissions and CSV output for 3 request types.
- Confirm privacy and secure admin procedures.

## Phase 2C: Go-live & handover
- Canonical domain, HTTPS, robots/sitemap, analytics only if approved.
- Run production smoke + lead submission + voice regression.
- Capture release `dist` archive, hash, release docs; train owner in Netlify and Excel import.
- Monitor initial go-live issues; handoff support + backup/maintenance calendar.

## Standard agent response after each task
```
Task ID / route / Figma node
Implemented components and changed files
Visual/functional verification completed (screenshots)
Build/test output
Known pending business decisions
Risks and exact next task
```

## Definition of Done for a single page
- Matches approved Figma desktop, **mobile/tablet proposal screenshots và test matrix hoàn thành**, interactions functioning, metadata unique, copy and links audited, no broken images, no JS errors, CI passes; responsive review approval.


---

<!-- Source: docs/10-PENDING-APPROVALS.md -->

# 10 — Pending Decisions for Business Review

**Không để AI tự phán đoán những mục này.** Kiến trúc Astro đã chốt, nhưng các mục sau có thể ảnh hưởng UX, pháp lý, form data và go-live.

| ID | Mức độ | Câu hỏi cần giải trình | Default an toàn trong Phase 1 |
|---|---|---|---|
| DEC-01 | HIGH | 3 form có được phép gộp thành một bảng lead chung? | Thiết kế chung field contract, chưa POST |
| DEC-02 | BLOCKER | Trong khối “Kiểm tra xe có sẵn”, có API/dữ liệu điều phối thật không? Nếu không, có đồng ý đổi thành "Gửi yêu cầu kiểm tra" và xin số liên hệ? | Không hiển thị kết quả xe thật, demo rõ |
| DEC-03 | HIGH | Voice: chỉ Speech-to-Text hay bắt buộc gửi bản ghi âm? Browser nào phải hỗ trợ? | Propose STT vi-VN có fallback |
| DEC-04 | BLOCKER | Form dữ liệu về email/tài khoản Netlify doanh nghiệp nào; ai có quyền xuất CSV? | Không tự chọn tài khoản cá nhân |
| DEC-05 | BLOCKER | Privacy notice, thời hạn lưu lead, cho phép gửi dữ liệu, quyền xoá/truy cập? | Không thu thập PII thật |
| DEC-06 | HIGH | Ai sẽ duyệt **bản mobile/tablet đã xây từ `docs/11-MOBILE-RESPONSIVE-SPEC.md`** (menu, thứ tự section, crop ảnh, form, CTA) khi chưa có Figma mobile? | **Mobile-first implementation bắt buộc ngay Phase 1**, giữ trạng thái `PROPOSED`; chỉ chặn UAT/go-live khi chưa được duyệt |
| DEC-07 | HIGH | Slugs và cấu trúc URLs có khớp chiến lược SEO doanh nghiệp? | Slugs chỉ là đề xuất |
| DEC-08 | HIGH | 3 bài tin nổi bật liên kết đi đâu; có trang blog/bài viết không? | Không tạo link 404 |
| DEC-09 | HIGH | Các link footer: legal, sitemap, chứng nhận và anchors trỏ đến đâu? | Kiểm kê link thiếu |
| DEC-10 | HIGH | Số liệu đội xe/năng lực, testimonies/ảnh, cam kết "15 phút" đã được duyệt công bố? | Đánh dấu content review |
| DEC-11 | MEDIUM | Email/SĐT địa chỉ cần cập nhật so với Figma không? | Đúng bản Figma, báo chờ xác nhận |
| DEC-12 | MEDIUM | Domain www hay root, ai giữ registrar/DNS? | Chưa gắn domain production |
| DEC-13 | MEDIUM | Có cần nhân viên tự sửa tin tức thường xuyên, dẫn đến CMS? | Static content, cập nhật qua PR |
| DEC-14 | MEDIUM | Khi xuất Excel, CSV là đủ hay bắt buộc file `.xlsx` native / định kỳ? | CSV mở trong Excel |
| DEC-15 | MEDIUM | Expected monthly leads/traffic và ngân sách Netlify Forms có phù hợp quota/retention? | Kiểm tra plan trước ký |
| DEC-16 | MEDIUM | SLA bảo trì, ai kiểm tra hàng tháng, RPO/RTO khi mất lead? | Lịch kiểm tra tối thiểu ở runbook |

## Biểu mẫu ký duyệt
```
Decision ID:
Selected option:
Business approver and role:
Approval date:
Reason and impact:
UX/Figma updates needed:
Implementation phase:
```

## Những gì có thể build ngay
- Hệ thống layout/component của 8 trang **desktop + mobile + tablet**, content hiện có với cờ review, responsive proposal từ `docs/11-MOBILE-RESPONSIVE-SPEC.md`, navigation hợp lệ, trạng thái form demo, SEO stubs, voice browser capability behind flag.
- Chưa build/enable live data submissions, quảng bá cam kết về thời gian phản hồi, tự tạo legal text chính thức, hay bảo đảm real-time dispatch.


---

<!-- Source: docs/11-MOBILE-RESPONSIVE-SPEC.md -->

# 11 — Mobile-first Responsive UI Specification (NAM HÂN LOGISTICS)

**Status:** REQUIRED for Phase 1 UI implementation. Responsive behavior is part of the product scope, not a later enhancement.  
**Design baseline:** Figma contains eight confirmed desktop frames at **1280px width**. No separate mobile/tablet frame has been verified. Therefore **desktop visual details are Figma-verified**, while mobile/tablet arrangements below are **PROPOSED RESPONSIVE RULES** pending visual approval by the project/design/business owner.  
**Authority:** Do not infer or advertise mobile screens as approved Figma designs. Build a coherent mobile implementation now, capture evidence, and request approval before marking UAT passed.

## A. Objectives and non-negotiable rules

1. The exact same eight site routes and approved company content must work on mobile, tablet, and desktop. No mobile-only duplicate website, route, HTML content source or redirect.
2. **Mobile-first CSS.** Default styles target narrow screens; add `@media (min-width: ...)` enhancements driven by content. Use **CSS Grid/Flexbox, relative units, `minmax(0, 1fr)`, `clamp()`, `min()`, `max()`** when useful; avoid rebuilding desktop Figma with absolute coordinates.
3. Preserve information hierarchy, accessible navigation, usable CTA and form. Never hide a critical service, pricing caveat, company detail or essential CTA merely to make mobile shorter.
4. **Zero horizontal document scrolling from 320 CSS px upwards**; horizontal scroll may be intentionally limited to an accessible contained component only if approved, labeled, keyboard usable, and does not trap focus.
5. Text remains usable at 200% zoom / mobile enlarged text without clipping, overlap, hidden buttons, or loss of form data. Never use fixed pixel heights on multiline text sections.
6. Respect safe areas and device cutouts for any fixed/sticky controls: `env(safe-area-inset-*)`, no CTA hidden under system UI or mobile keyboard. Prefer regular in-flow CTAs over floating sticky controls unless explicitly approved.
7. All text, service data, images and alt descriptions come from the same content models as desktop. Avoid viewport-width JavaScript branches for rendering; prefer CSS responsive layout.
8. No React/UI slider libraries or bulky runtime solely to build mobile layout. No additional server processes or dependencies for responsive UI.

## B. Viewports & breakpoint policy

Breakpoints below are **proposed engineering defaults**, not values read from Figma. Adjust for real content collisions and record any deviation in `docs/11-MOBILE-RESPONSIVE-SPEC.md` / pull request.

| Profile | Proposed width | Expected layout |
|---|---|---|
| Compact mobile | 320–359 CSS px | One column; smallest spacing; no clipped Vietnamese labels; menu/FAQ/forms usable |
| Mobile | 360–767 CSS px | One column; readable fluid typography; accessible header/menu and full-width form |
| Tablet portrait | 768–1023 CSS px | Selective 2-column cards where room permits; collapsible nav if needed |
| Tablet landscape / small desktop | 1024–1279 CSS px | Desktop-like layout only when it fits; preserve readability |
| Desktop Figma target | 1280 CSS px | High-fidelity comparison to approved frame |
| Large desktop | 1440+ CSS px | Max-width centered content; full-bleed backgrounds where designed |

Suggested media-query starts: `48rem` (768px) and `64rem` (1024px) **assuming default 16px root**, plus component-specific query when necessary. Breakpoints are not devices and must not be based on UA sniffing.

**Mandatory screenshot and behavior matrix:** 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 CSS px; smoke at 1920. Test at least one **real iPhone Safari** and one **real Android Chrome** when accessible (simulator/emulation is insufficient for voice/microphone behavior). Test both device orientation states where possible.

## C. Proposed design tokens (audit and fine-tune with Figma)

Create `src/styles/tokens.css` and express tokens as custom properties. The values here are **starter targets, not verified Figma measurements**:

```css
:root {
  --content-max: 75.5rem; /* approx 1208px Figma inner width; confirm */
  --page-gutter: clamp(1rem, 4vw, 2.25rem);
  --section-space: clamp(3rem, 6vw, 5rem);
  --stack-space: clamp(1rem, 2vw, 2rem);
  --touch-target-min: 44px; /* product UX target */
  --font-body: clamp(1rem, 0.95rem + 0.15vw, 1.0625rem);
  --font-h1: clamp(1.875rem, 1.35rem + 2.4vw, 3rem);
}

.container { width: min(100% - (2 * var(--page-gutter)), var(--content-max)); margin-inline: auto; }
img, svg, video { max-width: 100%; }
img { height: auto; }
*, *::before, *::after { box-sizing: border-box; }
```

Important: verify that `--page-gutter` and width arithmetic do not create nested double padding. For `background: full bleed`, apply color/image to section and content width to inner `.container`. `overflow-x: hidden` is **not** a permitted fix for real overflow defects. Minimum primary text baseline 16px; smaller secondary text only after contrast/readability review.

## D. Shared components — behavior by viewport

### Header & navigation
- Desktop: preserve Figma header hierarchy/logo, four principal destinations and quote/contact CTA; dropdown only if existing interaction/content calls for it.
- Mobile: replace desktop horizontal nav with **menu trigger** labeled `Mở menu` / `Đóng menu`, `aria-expanded`, `aria-controls`; panel lists all eight routes via grouped services. Keep brand logo visible and `Trang liên hệ / Yêu cầu báo giá` reachable without hunting.
- Menu must work via touch + keyboard, close on selection and Escape, restore focus when Escape closes, maintain logical tab order, and prevent background interactive focus while modal. If menu is a simple non-modal disclosure, keep page available and avoid unnecessary focus trapping.
- Ensure anchor navigation and any sticky header do not obscure target headings (`scroll-margin-top`). Do not require hover for service dropdowns.

### Cards, grids and timeline
- 4-column desktop card layouts -> 1 column on mobile, 2 columns tablet if each card remains readable; desktop 2x2 -> mobile 1x4. Card order follows reading order of Figma (left-to-right, top-to-bottom).
- Statistics stay as semantic text; may become 2x2 on mid-size mobile if each cell fits, or 1 column at 320px.
- Horizontal four-step timeline -> vertical ordered step list on mobile, maintain numbering, progress semantics and captions; do not horizontally scroll essential steps.
- Image/text two-column sections -> one column, **image and textual order chosen intentionally** per section; do not silently reverse meaning. Hero/CTA emphasis preserved.
- Testimonials and news -> stacked cards by default. If introducing carousel, it requires keyboard/touch/a11y/test plan and approval; do not invent autoplay.

### Media & typography
- Use approved original Figma assets; build suitable responsive `srcset`/`sizes` or Astro `<Picture>` / `<Image>`. Use `object-position` and independent mobile crop rules where subject would be cut off. Never distort logos/vehicles/people.
- Only prioritize the actual LCP hero media. Set intrinsic dimensions/aspect-ratio. Lazy-load below-the-fold assets, do not lazy-load first visible hero.
- Use relative line-height, `overflow-wrap: anywhere` only for problematic long tokens/URLs, preserve natural Vietnamese wrapping. No globally applied `white-space: nowrap` to headings/buttons.
- All icons need accessible labels if actionable, decorative icons `aria-hidden="true"`.

### Contact/quote forms
- Mobile default **single column** with labels above inputs; avoid desktop 7/5 column contact/sidebar grid at narrow widths. Sidebar process/contact cards render after main form unless a better accessible sequence is approved.
- Inputs and buttons have product target height/tap area **>=44 CSS px**; text input font **>=16px** to avoid mobile zoom issues; focus ring visible.
- Use `type="tel"`, `autocomplete="tel"`, `inputmode="tel"` as appropriate for SĐT/Zalo; do not use `type="number"` for phone; origin/destination use text, cargo description multiline textarea. Correct `name`, `label`, `id`, hint and error association (`aria-describedby`).
- `Cá nhân/Doanh nghiệp` radios are one accessible group; large tap labels. `Điểm đi/Điểm đến` become stacked. Description textarea and contact phone show in logical order.
- Keep form entries on validation error; announce field and summary errors. In Phase 1 every submit CTA clearly says demo/no live submission; **never claim success**.
- Mobile keyboard must not obscure submit, error or popover. Avoid fixed/sticky confirmation bars in keyboard-open state.
- Privacy link/consent (after business approval) must remain readable and usable on 320px.

### Voice input (“Nói thay vì nhập”)
- The microphone action on `/lien-he/` must remain accessible at 320px with a descriptive visible label, status, Stop action and editable text field.
- No microphone permission prompt until explicit tap. Browser support and `vi-VN` transcription are feature-detected; transcription **never auto-submits**.
- On unsupported or denied permission, show text fallback without blocking form. Distinguish transcription from audio recording/upload; voice semantics pending business approval.
- Mobile browser and OS permissions are different from desktop; real-device tests required before calling mobile voice production-ready.

### Footer, links and FAQ
- Footer desktop columns -> stacked semantic groups/mobile accordion **only if approved and implemented accessibly**. Keep actual company contact information and all needed navigation/legal links visible/reachable.
- FAQ on contact page: vertical cards, no hover-only affordance, keyboard-operable expansion (`<details>` preferred if visually viable), `aria` states when custom.
- No dead internal links, tiny icon-only buttons or clickable text lacking touch area.

## E. Route-by-route mobile adaptation matrix (PROPOSED)

| Route / Figma root | Desktop sections verified | Mobile behavior / priority |
|---|---|---|
| `/` `44:1195` | Hero `44:1456`, overview `44:1197`, green logistics `44:1261`, testimonials `44:1310`, news `44:1513` | Hero text readable atop/beside appropriately cropped image, prominent contact CTA; overview image mosaic simplifies into ordered media grid, stats and trust content readable; 3 testimonials and news cards stacked |
| `/ve-nam-han/` `92:731` | Hero `92:734`, company `92:790`, stats `92:846`, facilities `92:900`, people `92:978`, network `92:1032`, capabilities `92:1133`, industries `92:1213`, values `92:1287`, CTA `92:1327` | Preserve ten-section story and hierarchy; facility grid -> 1 column; large process/network graphics get legible responsive alternative without inventing business data; long page performance/lazy-load critical |
| `/dich-vu/` `51:575` | Hero `51:603`, four services `51:639`, CTA `51:724` | 2×2 service cards -> 1×4, each entire card/link usable on touch; remove design-only `VIEW SWITCHER BUTTONS` if confirmed editor navigation aid rather than public web UI |
| `/dich-vu/van-tai-duong-bo/` `84:409` | Hero `84:427`, vehicles `84:534`, options `84:624`, geographic routes `84:683`, 4-step timeline `84:797`, stats `84:867`, CTA `84:911` | Hero stacks; vehicle visual ratios maintained; shipping options stack; regional maps remain readable; timeline becomes vertical list |
| `/dich-vu/boc-xep-ho-tro-van-tai/` `84:1080` | Hero `84:1103`, 4 support cards `84:1235`, timeline `84:1327`, quick quote form `84:1470`, CTA `84:1516` | Cards stack, timeline vertical; all fields of quick quote form are one column with usable select/options; no fake send |
| `/dich-vu/logistics-giao-nhan/` `84:1720` | Hero `84:1738`, support cards `84:1864`, process `84:1953`, route inquiry `84:2074`, CTA `84:2113` | Content cards/timeline stack; pickup/delivery route inquiry stacked. “Kiểm tra xe có sẵn” must not imply real-time lookup; request collection/business wording pending approval |
| `/dich-vu/giai-phap-van-tai/` `84:2283` | Hero `84:2305`, options `84:2383`, process `84:2436`, transport choices `84:2476`, CTA `84:2532` | Transport options cards stack; steps and long copy maintain reading order; contact CTA visible after explanatory content |
| `/lien-he/` `101:1816` | Hero `101:1823`, form+sidebar `101:1851`, voice `101:1937`, FAQ `98:1253` | Main form full width before sidebar, radios/paired fields stack, microphone retains full behavior and fallback, 2×2 FAQ -> single column |

## F. Acceptance criteria and evidence (blocking)

**Visual checks per each of 8 routes**:
- Screenshots at **320, 375, 390, 768, 1024, 1280, 1440**, plus at least one 430 mobile variant; record viewport, browser, time/commit.
- Mobile screenshots show header closed and open, form error states, footer/CTA; long pages additionally capture top/middle/bottom and any overflow risk.
- Desktop at 1280 compared with the corresponding Figma node; mobile compared with this spec's approved proposed layout, **not a nonexistent mobile Figma frame**.
- Verify touch targets, readable text and predictable heading hierarchy. No disappearing critical service content.

**Interaction checks**:
- Menu via touch, keyboard, Escape, orientation change; no background scroll bug.
- Navigation and CTA links from every route; FAQ expand/collapse; form required/invalid/valid demo; 3 lead entry points.
- Voice supported/denied/unsupported cases on selected real mobile browsers; no loss of typed draft.
- Emulated slow mobile network (e.g. throttled 4G), reduced-motion and 200% zoom / larger system font. Avoid layout shift with images and fonts.

**Performance targets (goals, not guarantees):** verify mobile LCP <=2.5s, CLS <=0.1, INP <=200ms at 75th percentile when field data is available. Lighthouse lab >=90 Performance and Accessibility as a target, under documented test environment; do not report lab numbers as field results. Audit image weights and JS size by page; do not invent universal KB budgets without measuring design assets.

**Blocking issues:** horizontal document overflow at 320; menu cannot be opened/closed; form hidden under keyboard; invisible focus; broken tap targets; any P0 interactive flow untestable; duplicate mobile-only site; missing original hero/service images; unsupported voice crashes form; fake form/vehicle success; unexplained difference from approved mobile proposal.

## G. Review record template (one per page)

```md
Route:
Figma desktop node:
Mobile layout status: PROPOSED / APPROVED / NEEDS CHANGES
Screenshots: 320 / 375 / 390 / 768 / 1024 / 1280 / 1440
Mobile navigation/menu/CTA evidence:
Images/crops and typography issues:
Form/voice evidence if relevant:
Accessibility/performance observations:
Deviations from Figma desktop or this proposal:
Reviewer + date:
```

**Authoritative rule:** Implementation should proceed mobile-first with clearly documented proposed choices; do not block development just because no mobile Figma frame exists. **Do block final UI approval and production release** until the designated reviewer approves the responsive visual results.


---

<!-- Source: CHANGELOG.md -->

# Changelog — Architecture Specification

## v1.1.0 — 25/10/2026 — Mobile-first UI delivery
- **Phạm vi Phase 1 bắt buộc gồm desktop + tablet + mobile** cho toàn bộ 8 trang Astro SSG; không dời mobile sang Phase 2.
- Bổ sung `docs/11-MOBILE-RESPONSIVE-SPEC.md`: breakpoint/viewport matrix, layout từng trang, header mobile, typography/media, forms, voice, a11y, performance, UAT.
- Đồng bộ `AGENTS.md`, scope, architecture, Figma map, UI spec, forms, voice, QA, operations, implementation phases và pending approvals.
- Giữ nguyên ranh giới: desktop 1280 lấy từ Figma, **mobile/tablet là proposed engineering layout**, bắt buộc có screenshot và reviewer approval trước UI UAT.
- Không thay đổi kiến trúc Astro static, chính sách không PHP/SSR/backend, hoặc luồng form Phase 2.

## v1.0.0 — 25/10/2026
- Architecture baseline Astro SSG + TypeScript + scoped CSS; 8 routes theo Figma; 3 điểm nhận lead, Netlify Forms proposal, voice progressive enhancement.
