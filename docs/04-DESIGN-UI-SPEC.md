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
