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
