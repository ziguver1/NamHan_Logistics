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
