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
