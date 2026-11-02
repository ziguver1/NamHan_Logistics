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
| ADR-008 | Google Sheets Integration (Thay đổi phạm vi được duyệt) | Tự động tạo và ghi dòng vào bảng "Khách hàng Nam Hân" qua Google OAuth + Sheets API v4 serverless; thay thế luồng export CSV thủ công | Phụ thuộc Google Cloud API & tài khoản quản trị |
| ADR-009 | Bảng tin Doanh nghiệp & Quản trị nội bộ (Thay đổi phạm vi được duyệt) | Kênh thông báo chính thức lưu trữ bền vững qua Netlify Blobs (fallback local dev), quản lý bài viết qua giao diện `/admin/` hợp nhất với Google Sheets, hỗ trợ soạn thảo trực quan chống XSS, kiểm soát xung đột phiên bản, đính kèm PDF & ảnh bảo mật; render động tức thì (SSR) mà không cần deploy lại. | Phụ thuộc Netlify Blobs quota cho media |

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
