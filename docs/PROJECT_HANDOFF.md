# TÀI LIỆU BÀN GIAO DỰ ÁN (PROJECT HANDOFF)
**Dự án:** Website CÔNG TY TNHH NAM HÂN LOGISTICS  
**Ngày lập báo cáo:** 01/11/2026  
**Phiên bản hiện tại:** v1.1.0 (Hoàn thiện giao diện Phase 1 — Đề xuất Responsive Đa thiết bị)  
**Tài liệu tham chiếu gốc:** `AGENTS.md`, `MASTER_SPEC.md`, `README.md`, `CHANGELOG.md`, `docs/01` – `docs/12`  
**Figma nguồn:** `https://www.figma.com/design/EDp0z0ghKDZUdexTUjJfpL/NAM-H%C3%82N-LOGISTICS` (FileKey: `EDp0z0ghKDZUdexTUjJfpL`, Page: `0:1`)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Mục tiêu và bối cảnh
- Xây dựng website thương mại và giới thiệu năng lực cho **CÔNG TY TNHH NAM HÂN LOGISTICS** — doanh nghiệp vận tải hàng hóa đường bộ nội địa kết nối Bắc – Trung – Nam.
- Thiết lập kênh tiếp nhận nhu cầu vận chuyển trực tuyến, phục vụ khách hàng doanh nghiệp (B2B) và khách hàng cá nhân (B2C), hướng tới giải pháp vận hành bền vững trong giai đoạn 2026–2031 với chi phí bảo trì tối thiểu.
- Dự án được phân kỳ làm 2 giai đoạn rõ rệt:
  - **Phase 1 (Hiện tại):** Xây dựng hoàn chỉnh toàn bộ giao diện người dùng (UI) cho 8 tuyến trang trên cả Desktop, Tablet và Mobile; tích hợp tương tác giao diện, validation biểu mẫu ở chế độ xem trước kỹ thuật (Demo Preview), đảm bảo chuẩn tiếp cận và SEO cơ bản.
  - **Phase 2 (Kế tiếp):** Đấu nối hạ tầng nhận lead thật qua Netlify Forms, quy trình bảo vệ chống spam, cơ chế xuất dữ liệu phục vụ báo cáo Excel (CSV), thông báo email và chính sách quyền riêng tư được duyệt.

### 1.2. Đối tượng sử dụng
- **Khách hàng ngoài:** Chủ hàng, doanh nghiệp sản xuất, sàn thương mại điện tử, đại lý giao nhận cần tìm xe vận tải nguyên chuyến (FTL), gửi hàng ghép/hàng lẻ (LTL), dịch vụ bốc xếp cơ giới hoặc giải pháp logistics tích hợp.
- **Khách hàng nội bộ:** Đội ngũ kinh doanh và điều vận Nam Hân Logistics tiếp nhận thông tin yêu cầu vận chuyển từ website để tư vấn lộ trình và báo giá.

### 1.3. Phân định yêu cầu có tài liệu xác nhận vs. Suy luận kỹ thuật

| Nội dung | Phân loại | Căn cứ tài liệu / Bằng chứng thực tế |
| :--- | :--- | :--- |
| **8 routes giao diện Desktop 1280px** | ĐÃ XÁC NHẬN | File Figma `EDp0z0ghKDZUdexTUjJfpL` (8 artboard desktop) và `docs/03-FIGMA-PAGE-MAP.md`. |
| **Stack Astro Static (SSG) + Pure CSS** | ĐÃ XÁC NHẬN | `AGENTS.md` (Mục 1), `docs/01-SCOPE-DECISIONS.md` (ADR-001, ADR-002, ADR-003). |
| **Không dùng backend/database/CMS** | ĐÃ XÁC NHẬN | `AGENTS.md`, `docs/01-SCOPE-DECISIONS.md`, `docs/02-ARCHITECTURE.md`. |
| **Giao diện Responsive Mobile/Tablet** | SUY LUẬN KỸ THUẬT (ĐỀ XUẤT) | Figma gốc **chỉ có bản desktop 1280px**, chưa có frame mobile riêng. Cấu trúc mobile/tablet được xây dựng theo đề xuất kỹ thuật tại `docs/11-MOBILE-RESPONSIVE-SPEC.md` và gắn cờ `PROPOSED RESPONSIVE` chờ nghiệm thu chính thức. |
| **Cơ chế thu thập lead hợp nhất** | SUY LUẬN KỸ THUẬT (ĐỀ XUẤT) | Đề xuất gộp 3 luồng biểu mẫu thành một contract dữ liệu chuẩn `lead_request` (`docs/05-FORMS-DATA.md`). Chưa được doanh nghiệp ký duyệt chính thức (DEC-01). |
| **Chức năng "Nói thay vì nhập"** | ĐÃ XÁC NHẬN PHẠM VI / SUY LUẬN KỸ THUẬT TRIỂN KHAI | Người dùng yêu cầu phải hoạt động thật; đề xuất kỹ thuật dùng Web Speech API (`vi-VN`) phía trình duyệt, không lưu trữ audio (`docs/06-VOICE-INPUT.md`). |
| **Khả năng xuất Excel** | ĐÃ XÁC NHẬN MỤC TIÊU / SUY LUẬN HẠ TẦNG | Doanh nghiệp cần dữ liệu để xử lý trên Excel; hạ tầng kỹ thuật đề xuất tải CSV từ dashboard Netlify Forms và mở bằng Excel, website không tạo file `.xlsx` động client-side (`docs/05-FORMS-DATA.md`). |

---

## 2. CÔNG NGHỆ VÀ HƯỚNG DẪN VẬN HÀNH MÃ NGUỒN

### 2.1. Bảng công nghệ và phụ thuộc (Dependencies)
- **Framework lõi:** `astro` phiên bản `^7.4.4` (khai báo trong `package.json`).
- **Ngôn ngữ:** TypeScript `^5.8.2` (cấu hình `strictNullChecks: true`, `noUncheckedIndexedAccess: true`).
- **Công cụ kiểm tra kiểu:** `@astrojs/check` `^0.9.12`.
- **CSS Architecture:** Scoped CSS component + CSS Custom Properties toàn cục (`src/styles/tokens.css`, `src/styles/global.css`). **Tuyệt đối không sử dụng Tailwind CSS, SCSS, UI framework bên thứ ba (React, Vue, Svelte, Bootstrap)** theo ràng buộc cứng tại `AGENTS.md`.
- **Môi trường thực thi (Engine):**
  - Khai báo tại `package.json`: `node: ">=22.12.0"`.
  - Khóa phiên bản tại `.nvmrc`: `v24.15.0`.
  - Quản lý gói: `npm` với khóa phụ thuộc tại `package-lock.json`.

### 2.2. Các lệnh thực thi (Commands)

| Lệnh | Chức năng thực hiện | Ghi chú vận hành |
| :--- | :--- | :--- |
| `npm run dev` | Khởi chạy máy chủ phát triển cục bộ (`astro dev`) tại cổng mặc định `4321`. | Hỗ trợ hot-reload khi chỉnh sửa file trong `src/`. |
| `npm run check` | Chạy bộ kiểm tra kiểu tĩnh của Astro và TypeScript (`astro check`). | Kết quả hiện tại: **80 files, 0 errors, 0 warnings, 0 hints**. |
| `npm run build` | Thực hiện kiểm tra kiểu và biên dịch tĩnh toàn bộ dự án (`astro check && astro build`). | Sản phẩm biên dịch xuất vào thư mục `dist/` (9 routes tĩnh dạng `.html`). |
| `npm run preview` | Khởi chạy máy chủ cục bộ phục vụ các file tĩnh trong thư mục `dist/` để kiểm tra trước triển khai. | Đảm bảo tính nhất quán với môi trường production. |

> **Lưu ý trên môi trường Windows:** Nếu PowerShell chặn thực thi script (`.ps1`), hãy gọi lệnh thông qua command prompt: `cmd /c "npm run ..."` hoặc thiết lập lại ExecutionPolicy của phiên làm việc.

### 2.3. Cơ chế Triển khai (Deployment)
- **Cấu hình Astro (`astro.config.mjs`):**
  ```javascript
  import { defineConfig } from 'astro/config';
  export default defineConfig({
    output: 'static',
    build: { format: 'directory' }
  });
  ```
- **Cấu hình Netlify (`netlify.toml`):**
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"
  ```
- **Nguyên lý:** Triển khai tĩnh thuần túy (Static Hosting). Không sử dụng Node.js server runtime, SSR adapter hay Edge Functions. Khi deploy lên Netlify, bản build sẽ xuất ra các thư mục tương ứng với từng đường dẫn (ví dụ: `dist/lien-he/index.html`).

---

## 3. BẢN ĐỒ DỰ ÁN (PROJECT SITEMAP & ARCHITECTURE MAP)

### 3.1. Cây thư mục chính và vai trò

```
SP_MinhNgoc/
├── AGENTS.md                  # Ràng buộc bắt buộc cho Coding Agent (Stack cứng, Figma truth, Rule Phase)
├── MASTER_SPEC.md             # Bản đặc tả kỹ thuật tổng hợp toàn dự án
├── README.md                  # Hướng dẫn tổng quát và mục lục tài liệu
├── CHANGELOG.md               # Lịch sử thay đổi tài liệu kiến trúc (v1.0.0 -> v1.1.0)
├── astro.config.mjs           # Cấu hình đóng gói Astro (output: 'static', build: directory)
├── tsconfig.json              # Cấu hình TypeScript strict & path alias (@/* -> src/*)
├── package.json               # Khai báo dependency, scripts và node engine
├── package-lock.json          # Khóa chính xác phiên bản phụ thuộc npm
├── netlify.toml               # Cấu hình build & publish cho Netlify
├── .nvmrc                     # Phiên bản Node.js LTS xác thực (v24.15.0)
├── .gitignore                 # Loại trừ dist, .astro, node_modules, logs
│
├── docs/                      # 12 tài liệu đặc tả nghiệp vụ, kiến trúc, kiểm thử & vận hành
│   ├── 01-SCOPE-DECISIONS.md  # Quyết định phạm vi và 7 ADR nền tảng
│   ├── 02-ARCHITECTURE.md     # Cấu trúc mã nguồn, layout, component contracts
│   ├── 03-FIGMA-PAGE-MAP.md   # Ánh xạ 8 trang tới Node ID Figma và section specs
│   ├── 04-DESIGN-UI-SPEC.md   # Design tokens, màu sắc, typography, a11y
│   ├── 05-FORMS-DATA.md       # Chuẩn hóa dữ liệu lead, cơ chế Netlify Forms & Excel CSV
│   ├── 06-VOICE-INPUT.md      # Quy chuẩn tương tác giọng nói Web Speech API và fallback
│   ├── 07-QA-ACCEPTANCE.md    # Tiêu chí nghiệm thu 4 cổng kiểm thử
│   ├── 08-OPERATIONS-5Y.md    # Kế hoạch vận hành, sao lưu, phục hồi trong 5 năm (2026-2031)
│   ├── 09-PHASES-AND-TASKS.md # Kế hoạch triển khai chi tiết từng Phase
│   ├── 10-PENDING-APPROVALS.md# 16 câu hỏi chờ doanh nghiệp ký duyệt (DEC-01 -> DEC-16)
│   ├── 11-MOBILE-RESPONSIVE-SPEC.md # Đặc tả bắt buộc cho UI Mobile & Tablet đa thiết bị
│   └── 12-ASSET-MANIFEST.md   # Bảng kiểm kê và ánh xạ 44 hình ảnh WebP
│
├── design-reference/          # Ảnh chụp màn hình chuẩn của 8 trang Desktop từ Figma (1280px)
│   └── desktop/               # 01-home.png đến 08-lien-he.png
│
├── NAM HÂN LOGISTICS/         # [TÀI NGUYÊN NGUỒN] 44 assets raw xuất từ Figma bằng tiếng Việt
│                              # ĐÂY LÀ THƯ MỤC LƯU TRỮ GỐC, KHÔNG PHẢI MÃ NGUỒN CHẠY TRỰC TIẾP.
│
├── public/                    # Tài nguyên tĩnh phục vụ trực tiếp cho web public
│   ├── favicon.svg            # Favicon chính thức
│   ├── robots.txt             # Quy định lập chỉ mục tìm kiếm
│   └── images/                # 44 hình ảnh đã tối ưu WebP, tên file chuẩn kebab-case
│       ├── logo-nam-han.webp  # Logo thương hiệu
│       ├── home/              # Ảnh phục vụ trang chủ (14 ảnh)
│       ├── about/             # Ảnh phục vụ trang Về Nam Hân (6 ảnh)
│       ├── services/          # Ảnh dịch vụ tổng quan và 4 chuyên trang con
│       │   ├── road/          # Ảnh dịch vụ vận tải đường bộ
│       │   ├── handling/      # Ảnh dịch vụ bốc xếp
│       │   ├── logistics/     # Ảnh dịch vụ logistics
│       │   └── solutions/     # Ảnh dịch vụ giải pháp
│       └── contact/           # Ảnh banner trang liên hệ (đã qua inpainting xóa ghost text)
│
├── src/                       # MÃ NGUỒN CHÍNH CỦA ỨNG DỤNG ASTRO
│   ├── layouts/
│   │   └── SiteLayout.astro   # Layout khung xương duy nhất (Header, Footer, Meta, a11y skip-link)
│   ├── pages/                 # 8 routes tĩnh + 1 route 404
│   │   ├── index.astro        # Trang chủ (Route: /)
│   │   ├── ve-nam-han.astro   # Trang Về Nam Hân (Route: /ve-nam-han/)
│   │   ├── dich-vu/
│   │   │   ├── index.astro    # Trang Tổng quan dịch vụ (Route: /dich-vu/)
│   │   │   ├── van-tai-duong-bo.astro        # Dịch vụ Vận tải đường bộ
│   │   │   ├── boc-xep-ho-tro-van-tai.astro   # Dịch vụ Bốc xếp & Hỗ trợ vận tải
│   │   │   ├── logistics-giao-nhan.astro      # Dịch vụ Logistics & Giao nhận
│   │   │   └── giai-phap-van-tai.astro       # Dịch vụ Giải pháp vận tải
│   │   ├── lien-he.astro      # Trang Liên hệ & Báo giá (Route: /lien-he/)
│   │   └── 404.astro          # Trang báo lỗi 404 tùy biến
│   ├── components/
│   │   ├── layout/            # SiteHeader.astro, SiteFooter.astro
│   │   ├── ui/                # ImageSlot.astro
│   │   ├── home/              # 7 components section trang chủ
│   │   ├── about/             # 10 components section trang giới thiệu
│   │   ├── services/          # Các components dịch vụ chung và 4 thư mục dịch vụ con
│   │   └── contact/           # ContactHero, ContactForm, ContactSidebar, ContactFaq
│   ├── content/               # Dữ liệu nội dung dạng Typed TS (company, navigation, asset lists)
│   ├── lib/                   # Định nghĩa Route, Type definitions, helpers
│   └── styles/
│       ├── tokens.css         # Design tokens chuẩn (Color, Space, Font, Radius, Breakpoints)
│       └── global.css         # CSS reset, typographic scale, utility nền tảng
│
├── templates/
│   └── netlify.toml.example   # File mẫu cấu hình Netlify dự phòng
│
└── scratch/                   # Thư mục chứa script kiểm tra nội bộ, screenshots và so sánh visual diff
```

### 3.2. Vai trò của thư mục `NAM HÂN LOGISTICS`
- **Mục đích:** Là thư mục bàn giao gốc chứa toàn bộ các ảnh asset thô được xuất trực tiếp từ các Frame của file thiết kế Figma ban đầu. Tên thư mục và tên file đặt bằng tiếng Việt có dấu và khoảng trắng (ví dụ: `Trang chủ/Hàng nguyên xe _ FTL.webp`, `Liên hệ/HeroSection.webp`).
- **Quan hệ với mã nguồn đang chạy:** **Thư mục này KHÔNG tham gia vào quá trình build hay runtime của Astro.**
- **Xử lý kỹ thuật:** Toàn bộ ảnh đã được rà soát, đổi tên chuẩn kebab-case không dấu, xử lý kích thước/tỷ lệ hiển thị và chuyển sang `public/images/`. Mọi component trong `src/` chỉ tham chiếu tới đường dẫn chuẩn `/images/...`.

---

## 4. HIỆN TRẠNG TỪNG TRANG VÀ CHỨC NĂNG

| Trang / Chức năng | File liên quan | Đã triển khai (Phase 1) | Còn thiếu hoặc chưa xác minh (Chờ Phase 2 / Duyệt) |
| :--- | :--- | :--- | :--- |
| **1. Trang chủ (`/`)** | `src/pages/index.astro`<br>`src/components/home/*` | • Đã triển khai đầy đủ 7 sections: Hero, Tổng quan & Năng lực, 4 Dịch vụ chính, Vận tải xanh, Đánh giá đối tác, Tin tức nổi bật, CTA cuối trang.<br>• Header & Hero đã được tinh chỉnh khớp 1:1 với Figma.<br>• Responsive mobile/tablet hoạt động mượt mà, menu mobile mở trượt accessible. | • Nút "Xem tất cả" tại phần Tin tức chưa có trang blog/tin tức thực tế để trỏ tới (đang gắn `#`). Cần quyết định của doanh nghiệp (DEC-08).<br>• Quyền công bố tên khách hàng và ảnh đối tác trong Testimonials cần xác nhận trước go-live (DEC-10). |
| **2. Về Nam Hân (`/ve-nam-han/`)** | `src/pages/ve-nam-han.astro`<br>`src/components/about/*` | • Đã triển khai đầy đủ 10 sections: Hero, Giới thiệu chung, Số liệu thống kê, Cơ sở kho bãi, Đội ngũ, Bản đồ mạng lưới Bắc – Trung – Nam, Năng lực vận hành, Ngành hàng phục vụ, Giá trị cốt lõi, CTA.<br>• Section "Mạng lưới vận chuyển" (`AboutNetwork.astro`) đã được tái thiết kế chuẩn xác theo sơ đồ tuyến hành lang và bãi xe trong ảnh Figma gốc, đạt 0 overflow ở 320px. | • Số liệu năng lực (73+ xe, 10 xe/ngày, 2 bãi xe) cần doanh nghiệp xác thực tính pháp lý và thời điểm cập nhật mới nhất (DEC-10). |
| **3. Tổng quan Dịch vụ (`/dich-vu/`)** | `src/pages/dich-vu/index.astro`<br>`src/components/services/*` | • Hero banner, lưới 4 thẻ dịch vụ lớn dẫn tới 4 chuyên trang con, CTA nhận báo giá.<br>• Cấu trúc grid responsive co giãn từ 1 cột (mobile) sang 2 cột (tablet/desktop). | • Module switcher phụ (`51:587` trong Figma) được xác định là component trình bày Figma, đã loại trừ khỏi thanh điều hướng production. |
| **4. Vận tải đường bộ (`/dich-vu/van-tai-duong-bo/`)** | `src/pages/dich-vu/van-tai-duong-bo.astro`<br>`src/components/services/road/*` | • Breadcrumbs, Hero, Tổng quan đội xe, 4 nhóm phương tiện (Đầu kéo, Container, Tải thùng, Xe ben), Các tuyến vận chuyển Bắc - Trung - Nam, Quy trình vận tải 5 bước, Thống kê năng lực, CTA. | • Không có logic dispatch xe thời gian thực (nội dung tĩnh phục vụ giới thiệu năng lực). |
| **5. Bốc xếp & Hỗ trợ vận tải (`/dich-vu/boc-xep-ho-tro-van-tai/`)** | `src/pages/dich-vu/boc-xep-ho-tro-van-tai.astro`<br>`src/components/services/handling/*` | • Hoàn thiện các section giới thiệu hoạt động bốc xếp, hạ tầng cơ giới (xe nâng, cẩu).<br>• **Lead Point 2 (`HandlingQuoteForm.astro`):** Biểu mẫu yêu cầu báo giá bốc xếp (Tên, SĐT, Địa điểm, Loại hàng, Nhu cầu cơ giới). Có client-side validation và banner thông báo chế độ xem trước (Demo). | • Chưa kết nối gửi dữ liệu thật về Netlify Forms.<br>• Banner demo hiện đang hardcode số Hotline `1900 6868` (lệch với số `0856 699 111` của công ty). |
| **6. Logistics & Giao nhận (`/dich-vu/logistics-giao-nhan/`)** | `src/pages/dich-vu/logistics-giao-nhan.astro`<br>`src/components/services/logistics/*` | • Hoàn thiện các section quy trình chuỗi cung ứng, kho bãi trung chuyển.<br>• **Lead Point 3 (`LogisticsRouteInquiry.astro`):** Thanh tra cứu lộ trình với 2 ô Điểm gửi và Điểm nhận. Validation client-side hoàn chỉnh, thông báo trạng thái demo. | • **Thiếu trường SĐT/Zalo** theo đúng bản vẽ Figma `84:2074`. Cần phê duyệt của doanh nghiệp để bổ sung trường liên hệ hoặc điều hướng sang trang Liên hệ (DEC-02).<br>• Hotline demo banner đang ghi `1900 6868`. |
| **7. Giải pháp vận tải (`/dich-vu/giai-phap-van-tai/`)** | `src/pages/dich-vu/giai-phap-van-tai.astro`<br>`src/components/services/solutions/*` | • Hoàn thiện giới thiệu giải pháp vận chuyển trọn gói may đo theo yêu cầu, 3 hình thức (LTL, Ghép chuyến, FTL), tiêu chí lựa chọn, quy trình tư vấn giải pháp. | • Nội dung đã đầy đủ theo Figma, không phát sinh biểu mẫu riêng. |
| **8. Liên hệ & Báo giá (`/lien-he/`)** | `src/pages/lien-he.astro`<br>`src/components/contact/*` | • **Hero Banner:** Đã inpainting xóa sạch ghost text trên ảnh xe tải, áp white gradient fade giúp văn bản sắc nét trên nền trắng tinh khiết.<br>• **Lead Point 1 (`ContactForm.astro`):** Biểu mẫu nhận báo giá chuẩn 1:1 Figma (Cá nhân/Doanh nghiệp toggle, Họ tên, Điểm đi, Điểm đến, Mô tả hàng, Khối lượng, SĐT/Zalo). Đã bỏ dấu sao đỏ visual, giữ a11y.<br>• **Chức năng giọng nói:** Banner "Nói thay vì nhập" tích hợp Web Speech API tiếng Việt (`vi-VN`), có fallback thông báo nhập tay trên trình duyệt không hỗ trợ.<br>• **Sidebar (`ContactSidebar.astro`):** Quy trình 4 bước tiếp nhận căn chỉnh mũi tên nằm giữa các số, 3 nút liên hệ nhanh (`Zalo`, `Hotline`, `Email`) nằm trên 1 hàng ngang.<br>• **FAQ (`ContactFaq.astro`):** 4 câu hỏi accordion thẻ trắng viền nhẹ, icon `+` thanh mảnh. | • Biểu mẫu vận hành ở chế độ Demo Preview (chặn submit, thông báo Hotline/Zalo trực tiếp, không gửi network request).<br>• Chưa kích hoạt endpoint nhận lead thực tế của Netlify Forms (Phase 2). |
| **9. Trang lỗi 404 (`/404`)** | `src/pages/404.astro` | • Trang thông báo lỗi 404 chỉ dẫn thân thiện, điều hướng quay lại trang chủ hoặc gọi hotline hỗ trợ. | • Đã sẵn sàng. |
| **Xuất Excel / Báo cáo** | `docs/05-FORMS-DATA.md` | • Đã định nghĩa canonical schema hợp nhất cho 3 form để xuất ra 1 file CSV. | • Chưa tích hợp vì đang ở Phase 1. Website công cộng sẽ không có nút download `.xlsx` trực tiếp; quy trình xuất CSV sẽ thực hiện từ dashboard Netlify của quản trị viên (Phase 2). |

---

## 5. KIẾN TRÚC VÀ LUỒNG DỮ LIỆU

### 5.1. Cơ chế kết xuất giao diện (Rendering Mechanism)
- Website áp dụng kiến trúc **Static Site Generation (SSG)** với Astro:
  - Khi chạy `npm run build`, Astro duyệt qua toàn bộ các file `.astro` trong thư mục `src/pages/` để biên dịch thành các trang HTML, CSS, và JS đóng gói độc lập.
  - Mã nguồn xuất xưởng không chứa code server-side (Node.js hay PHP). Các trang được tải trực tiếp từ CDN với độ trễ cực thấp và khả năng chịu tải cao.
- **Tiến trình tăng cường (Progressive Enhancement):** Mọi nội dung thông tin, bảng biểu, danh sách năng lực đều hiển thị nguyên vẹn ngay cả khi người dùng tắt JavaScript. JavaScript chỉ can thiệp vào các tương tác: đóng/mở menu mobile, accordion câu hỏi thường gặp, validation biểu mẫu và nhận diện giọng nói.

### 5.2. Nguồn dữ liệu nội dung
- Hiện tại toàn bộ dữ liệu công ty (địa chỉ, số điện thoại, email, thông số năng lực) và menu điều hướng được lưu trữ tập trung tại các file TypeScript có cấu trúc kiểu chặt chẽ trong `src/content/`:
  - `src/content/company.ts`: Thông tin pháp lý công ty, địa chỉ trụ sở chính (Bỉm Sơn, Thanh Hóa) và chi nhánh 2 (TP. HCM), hotline (`0856 699 111`), email (`thu@nhlvn.com`).
  - `src/content/navigation.ts`: Cây menu chính và footer links.
  - `src/content/*-assets.ts`: Danh mục khóa hình ảnh và metadata alt-text cho từng trang.
- Website không kết nối với cơ sở dữ liệu (Database) hay headless CMS nào trong giai đoạn này.

### 5.3. Luồng xử lý biểu mẫu (Form Submission Flow)

```
[Khách hàng nhập biểu mẫu]
          │
          ▼
[Client-side Validation (JS)] ──(Dữ liệu không hợp lệ)──► [Hiển thị lỗi tại trường nhập liệu]
          │
      (Hợp lệ)
          │
   ┌──────┴──────────────────────────────────────────────────────┐
   │                                                             │
[HIỆN TẠI: Phase 1 Preview Mode]                [TƯƠNG LAI: Phase 2 Production Mode]
   │                                                             │
   ▼                                                             ▼
Chặn submit mặc định (e.preventDefault())         Gửi HTTP POST (application/x-www-form-urlencoded)
Hiển thị Banner thông báo: "Ghi nhận thông tin    Đích đến: Endpoint form detection Netlify
Bản xem trước kỹ thuật Phase 1 - Để xếp chuyến    Form name: "lead_request" (chứa request_type)
ngay, vui lòng gọi Hotline 0856 699 111"                         │
                                                                 ▼
                                                  Hạ tầng Netlify Forms ghi nhận:
                                                  • Kiểm tra Honeypot / Spam filter
                                                  • Bắn email thông báo cho điều vận
                                                  • Lưu trữ bản ghi vào Dashboard bảo mật
                                                                 │
                                                                 ▼
                                                  Quản trị viên tải file CSV về máy
                                                  Mở và quản lý trực tiếp bằng Microsoft Excel
```

### 5.4. Dịch vụ bên ngoài và Biến môi trường
- **Dịch vụ bên ngoài:** Hiện tại **KHÔNG CÓ** bất kỳ dịch vụ ngoài (3rd party API, CDN bên ngoài, font trả phí, cloud speech server) nào được nhúng vào website. Web font Inter được preconnect từ Google Fonts qua CDN công cộng, hình ảnh được phục vụ trực tiếp nội bộ.
- **Biến môi trường (Environment Variables):** Không sử dụng bất kỳ file `.env` hay secret token nào trong client bundle, tuân thủ nghiêm ngặt nguyên tắc bảo mật thông tin và dữ liệu doanh nghiệp tại `AGENTS.md`.

---

## 6. QUYẾT ĐỊNH VÀ RÀNG BUỘC ĐÃ GHI NHẬN

### 6.1. Các quyết định kiến trúc đã thông qua (Approved ADRs)
Căn cứ tài liệu `docs/01-SCOPE-DECISIONS.md`:
1. **ADR-001 (Astro SSG Static):** Sử dụng Astro tạo HTML tĩnh, loại bỏ hoàn toàn chi phí bảo trì server backend.
2. **ADR-002 (TypeScript strict & Scoped CSS):** Chuẩn hóa mã nguồn nội bộ, CSS độc lập theo component giúp ngăn ngừa xung đột giao diện khi dự án phát triển lâu dài.
3. **ADR-003 (Không dùng UI Framework nặng):** Loại trừ React/Vue/Tailwind để giữ trang web siêu nhẹ, tốc độ tải trang cao, không phụ thuộc vào chu kỳ nâng cấp của thư viện bên thứ ba.
4. **ADR-004 (Typed Static Content):** Quản lý nội dung bằng TypeScript models thay vì cài đặt CMS phức tạp, giảm bề mặt tấn công bảo mật.
5. **ADR-005 (Đề xuất Netlify Forms cho Phase 2):** Giải pháp không máy chủ (serverless form handling) có sẵn dashboard quản trị và tính năng xuất CSV.
6. **ADR-006 (Voice Progressive Enhancement):** Chỉ sử dụng Web Speech API có sẵn trên trình duyệt của người dùng; nếu không được hỗ trợ, giao diện tự động duy trì ô nhập liệu văn bản thông thường.
7. **ADR-007 (Hợp đồng dữ liệu Lead duy nhất):** 3 biểu mẫu trên web đều quy về một cấu trúc dữ liệu chuẩn để khi tải về chỉ có 1 file tổng hợp duy nhất.

### 6.2. Các ràng buộc bắt buộc (Hard Constraints)
Căn cứ `AGENTS.md` và `docs/11-MOBILE-RESPONSIVE-SPEC.md`:
- **Desktop 1280px là nguồn sự thật (Figma Single Source of Truth):** Mọi kích thước font chữ, khoảng cách, màu sắc, vị trí ảnh trên desktop 1280px phải khớp với bản vẽ Figma.
- **Mobile-first không được trì hoãn:** Giao diện mobile và tablet là phạm vi bắt buộc ngay trong Phase 1. Tất cả 8 trang phải vượt qua kiểm tra cuộn ngang (Zero horizontal scrollbar) tại độ phân giải nhỏ nhất **320px**.
- **Không giả lập thành công:** Biểu mẫu chưa đấu nối thật tuyệt đối không hiển thị thông báo "Gửi thành công" như thể đã tiếp nhận đơn hàng.
- **Bảo vệ quyền riêng tư (PII):** Không ghi log số điện thoại, tên khách hàng vào console hay lưu trữ không mã hóa trên client.

---

## 7. CÁC THAY ĐỔI GẦN ĐÂY VÀ CÔNG VIỆC DANG DỞ

### 7.1. Tình trạng Git Version Control
- **Hiện trạng:** Thư mục hiện tại `D:\FPT_Learning2026\SP_MinhNgoc\` **chưa được khởi tạo Git repository cục bộ** (`fatal: not a git repository`).
- **Ý nghĩa:** Toàn bộ lịch sử các bước làm việc trước đó được ghi nhận qua file log hệ thống và các tài liệu artifact so sánh. Mã nguồn hiện tại đang ở trạng thái làm việc trực tiếp (working directory sạch, không có commit dang dở bị conflict).

### 7.2. Tóm tắt các đợt cập nhật giao diện vừa qua
Dựa trên lịch sử yêu cầu của người dùng và các đợt kiểm thử so sánh trực quan (visual diffs):
1. **Trang chủ (`/`):**
   - Đợt 1: Căn chỉnh lại Header và Hero section theo đúng ảnh thực tế người dùng cung cấp (`media_1793521630431_db2bfae8.jpg`).
   - Đợt 2: Căn chỉnh lại Section Tổng quan & Năng lực (`OverviewSection.astro`) và Lưới 4 dịch vụ (`ServicesSection.astro`) theo ảnh đính kèm (`media_1793521896512_6f934c54.jpg`).
2. **Trang Về Nam Hân (`/ve-nam-han/`):**
   - Đợt 3: Tái thiết kế Section "Mạng lưới vận chuyển" (`AboutNetwork.astro`) khớp 1:1 với sơ đồ hành lang Bắc – Trung – Nam, vị trí các điểm nút Bỉm Sơn, Bình Dương, Q12 TP.HCM theo ảnh đính kèm (`media_1793524876738_80dc0554.png`), đạt chuẩn không tràn viền ở 320px.
3. **Trang Liên hệ (`/lien-he/`):**
   - Đợt 4 (Vừa hoàn tất): Xử lý triệt để phản ánh "Phần tab liên hệ chưa giống lắm" (`media_1793542553181_84ad9563.jpg`):
     - Xử lý inpainting trên file ảnh `contact-hero-bg.webp` để xóa hoàn toàn chữ bóng mờ (ghost text) bị dính trên thân xe tải; bổ sung CSS linear-gradient white fade để khối chữ H1 và đoạn văn nằm trên nền trắng tinh khiết.
     - Ẩn toàn bộ dấu sao đỏ `*` visual trên form theo đúng Figma.
     - Căn chỉnh thanh "Nói thay vì nhập" có chữ phụ màu xanh, icon micro tròn nền xanh.
     - Căn chỉnh hàng số 4 bước tiếp nhận `1 → 2 → 3 → 4` có mũi tên nằm ngang giữa các số, bước 1 xanh đậm, bước 2-4 xanh nhạt.
     - Xếp 3 nút liên hệ nhanh (`Zalo`, `Hotline`, `Email`) nằm trên một hàng ngang cân đối.
     - Thay đổi icon mở FAQ thành dấu `+` xám thanh mảnh không có vòng tròn bao quanh.

### 7.3. Công việc dang dở cần chuyển giao
- Toàn bộ giao diện 8 trang đã được xây dựng và kiểm thử build thành công, tuy nhiên trạng thái responsive mobile/tablet hiện đang ở mức **`PROPOSED RESPONSIVE`** và cần được người dùng/doanh nghiệp rà soát nghiệm thu trực quan (UI UAT).
- Các câu hỏi nghiệp vụ trong `docs/10-PENDING-APPROVALS.md` cần được thảo luận để chốt quyết định trước khi bắt đầu Phase 2.

---

## 8. DANH MỤC KIỂM TRA VÀ CÁC VẤN ĐỀ CẦN GIẢI QUYẾT (ISSUES & RISKS)

Bảng tổng hợp các vấn đề phát hiện từ mã nguồn thực tế, phân loại theo mức độ ưu tiên để AI kế tiếp cùng người dùng thảo luận:

| STT | Vấn đề / Rủi ro phát hiện | Đường dẫn file liên quan | Phân tích tác động | Mức độ ưu tiên | Hành động khuyến nghị |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | **Hotline không đồng nhất trong Demo Banner** | • `src/components/services/handling/HandlingQuoteForm.astro` (dòng 118)<br>• `src/components/services/logistics/LogisticsRouteInquiry.astro` (dòng 95) | Banner demo ở 2 form này đang ghi hotline mẫu `1900 6868`, trong khi hotline chính thức của Nam Hân là `0856 699 111` (như ở `companyInfo` và trang Liên hệ). Gây nhầm lẫn cho người dùng thử nghiệm. | **HIGH** | Cập nhật số điện thoại trong 2 file trên thành biến động `{companyInfo.hotline}` hoặc sửa text thành `0856 699 111`. |
| **2** | **Thư mục chưa có Git Version Control** | Thư mục gốc dự án (`D:\FPT_Learning2026\SP_MinhNgoc\`) | Không có lịch sử git cục bộ. Nguy cơ mất mát mã nguồn nếu có thao tác ghi đè nhầm hoặc không theo dõi được diff chi tiết giữa các phiên. | **HIGH** | Thảo luận với người dùng để chạy `git init`, thêm commit gốc ban đầu cho Phase 1 UI. |
| **3** | **Biểu mẫu Tra cứu lộ trình thiếu số liên hệ** | `src/components/services/logistics/LogisticsRouteInquiry.astro` | Bản vẽ Figma gốc `84:2074` chỉ vẽ 2 ô "Điểm nhận" và "Điểm giao" cùng nút "Kiểm tra xe có sẵn", hoàn toàn không có ô nhập SĐT/Email. Khi sang Phase 2, nếu khách bấm gửi thì công ty không có cách nào liên hệ lại. | **HIGH (DEC-02)** | Thảo luận với doanh nghiệp: Thêm 1 trường `Số điện thoại / Zalo` vào form này, HOẶC khi bấm nút sẽ chuyển hướng sang trang `/lien-he/` kèm query parameters điểm đi/đến. |
| **4** | **Nút "Xem tất cả" Tin tức chưa có trang đích** | `src/components/home/NewsSection.astro` (dòng 23) | Nút dẫn tới `href="#"` vì thiết kế Figma 8 trang không có trang danh sách bài viết/blog. | **MEDIUM (DEC-08)** | Quyết định: Ẩn nút "Xem tất cả", HOẶC cuộn tới section thông tin công ty, HOẶC bổ sung route blog vào phạm vi sau này. |
| **5** | **Các liên kết Footer chưa có trang chính thức** | `src/components/layout/SiteFooter.astro` | Các liên kết pháp lý (Chính sách bảo mật, Điều khoản sử dụng, Sitemap) đang tạm trỏ về `/lien-he/` hoặc `#`. | **MEDIUM (DEC-09)** | Cần doanh nghiệp cung cấp nội dung văn bản pháp lý chính thức trước khi go-live Phase 2. |
| **6** | **Tương thích Web Speech API trên Mobile thực tế** | `src/components/contact/ContactForm.astro` (dòng 747-852) | Web Speech API phụ thuộc vào trình duyệt thiết bị (hoạt động tốt trên Chrome desktop/Android, nhưng Safari iOS có thể đòi hỏi quyền nghiêm ngặt hoặc không hỗ trợ cờ SpeechRecognition chuẩn). | **MEDIUM (DEC-03)** | Cần kiểm thử thực tế trên thiết bị iOS Safari thật. Đảm bảo fallback hiển thị rõ ràng và người dùng luôn nhập tay bình thường được. |
| **7** | **Xác nhận số liệu năng lực và nhân sự** | `src/components/home/OverviewSection.astro`<br>`src/components/about/AboutStats.astro` | Các thông số như "73+ xe tải", "2 bãi xe", "32 giờ vận chuyển", "10 xe/ngày" lấy theo bản vẽ Figma mẫu. | **LOW (DEC-10)** | Doanh nghiệp rà soát lại tính xác thực trước khi chạy quảng bá chính thức. |

---

## 9. ĐỀ XUẤT BƯỚC TRIỂN KHAI TIẾP THEO

Khi thảo luận với người dùng, AI kế tiếp nên gợi ý các bước đi tiếp theo theo thứ tự logic:

1. **Bước 1 (Duyệt UI & Khởi tạo Git):**
   - Trình bày toàn bộ giao diện 8 trang đã hoàn thành trong Phase 1 (đặc biệt là 4 trang vừa được tinh chỉnh: Trang chủ, Về Nam Hân, Dịch vụ, Liên hệ).
   - Đề xuất người dùng cho phép khởi tạo Git repository cục bộ và commit snapshot đầu tiên cho Phase 1 hoàn chỉnh.
2. **Bước 2 (Thống nhất quyết định nghiệp vụ Phase 2):**
   - Giải quyết 3 vấn đề nóng:
     - Sửa hotline `1900 6868` thành `0856 699 111` trên các form dịch vụ.
     - Phương án cho form Tra cứu lộ trình (Thêm ô SĐT hay chuyển trang).
     - Quyết định về tài khoản Netlify của doanh nghiệp dùng để nhận dữ liệu lead và tải CSV/Excel.
3. **Bước 3 (Bắt đầu Phase 2 — Kết nối dữ liệu):**
   - Cấu hình Netlify Forms với form template ẩn `lead_request` trong file layout.
   - Thêm trường honeypot chống bot tự động.
   - Đấu nối chuyển từ chế độ Demo Preview sang trạng thái gửi dữ liệu thật và kiểm thử tải file CSV từ bảng điều khiển Netlify để mở trên Microsoft Excel.

