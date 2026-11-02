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
