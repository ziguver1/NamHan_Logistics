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
