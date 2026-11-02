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
