# Changelog — Architecture Specification

## v1.1.0 — 25/10/2026 — Mobile-first UI delivery
- **Phạm vi Phase 1 bắt buộc gồm desktop + tablet + mobile** cho toàn bộ 8 trang Astro SSG; không dời mobile sang Phase 2.
- Bổ sung `docs/11-MOBILE-RESPONSIVE-SPEC.md`: breakpoint/viewport matrix, layout từng trang, header mobile, typography/media, forms, voice, a11y, performance, UAT.
- Đồng bộ `AGENTS.md`, scope, architecture, Figma map, UI spec, forms, voice, QA, operations, implementation phases và pending approvals.
- Giữ nguyên ranh giới: desktop 1280 lấy từ Figma, **mobile/tablet là proposed engineering layout**, bắt buộc có screenshot và reviewer approval trước UI UAT.
- Không thay đổi kiến trúc Astro static, chính sách không PHP/SSR/backend, hoặc luồng form Phase 2.

## v1.0.0 — 25/10/2026
- Architecture baseline Astro SSG + TypeScript + scoped CSS; 8 routes theo Figma; 3 điểm nhận lead, Netlify Forms proposal, voice progressive enhancement.
