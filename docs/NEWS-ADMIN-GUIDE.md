# HƯỚNG DẪN VẬN HÀNH BẢNG TIN DOANH NGHIỆP & TRANG QUẢN TRỊ
**Hệ thống Quản lý Bảng tin & Thông báo chính thức — Nam Hân Logistics**

---

## 1. TỔNG QUAN HỆ THỐNG

Tính năng **Bảng tin Doanh nghiệp** là cổng phát ngôn và truyền thông chính thức của Nam Hân Logistics, phục vụ thông báo lịch trình điều xe, biểu phí vận tải, kế hoạch vận hành cao điểm, chính sách chất lượng và an toàn hàng hóa.

### Đặc điểm thiết kế & nghiệp vụ:
- **Kênh chính thức của công ty:** Không phải blog cá nhân, không hiển thị tác giả, không có lượt thích/bình luận/lượt xem.
- **Cập nhật tức thì (Real-time SSR):** Quản trị viên đăng hoặc sửa bài, nội dung được cập nhật ngay lập tức trên trang chủ và trang bảng tin mà **không cần sửa source code hay deploy lại website**.
- **Lưu trữ bền vững (Persistent Storage):** Toàn bộ dữ liệu thông báo và tệp đính kèm được lưu trữ tại Netlify Blobs trên môi trường production, tự động lưu cục bộ tại `.data/news/` khi chạy phát triển local.
- **Hợp nhất quản trị:** Tích hợp liền mạch vào hệ thống `/admin/`, dùng chung cơ chế bảo vệ phiên làm việc với phân hệ Kết nối Google Sheets.

---

## 2. BẢN ĐỒ ROUTES & PHÂN QUYỀN

| Tuyến đường (Route) | Mục đích | Phân quyền truy cập | Cơ chế Render |
|---|---|---|---|
| `/admin/` | Trang danh sách quản lý thông báo, bộ lọc, thùng rác, sao lưu | **Chỉ Quản trị viên** (Cookie session) | SSR / Bảo vệ |
| `/admin/bang-tin/editor` | Trình soạn thảo và chỉnh sửa thông báo | **Chỉ Quản trị viên** | SSR / Bảo vệ |
| `/admin/google-sheets/` | Quản lý kết nối bảng tính Google Sheets nhận lead | **Chỉ Quản trị viên** | SSR / Bảo vệ |
| `/bang-tin/` | Danh sách thông báo công khai cho khách hàng/đối tác | **Công khai** (Ai cũng xem được) | SSR (Real-time) |
| `/bang-tin/[slug]/` | Toàn văn thông báo, ảnh đại diện và tệp PDF đính kèm | **Công khai** (Bài nháp chỉ Admin xem được) | SSR (Cache 5 phút) |
| `/api/news/*` | Các API lưu, xóa, đổi trạng thái, tải file, sao lưu | **Chỉ Quản trị viên** | API Endpoints |

---

## 3. HƯỚNG DẪN THAO TÁC QUẢN TRỊ VIÊN

### 3.1. Đăng nhập hệ thống
1. Truy cập đường dẫn: `https://<domain>/admin/` (hoặc `http://localhost:4321/admin/` trên máy tính nội bộ).
2. Nhập mật khẩu quản trị viên (được cấu hình trong biến môi trường `ADMIN_PASSWORD`).
3. Sau khi xác thực thành công, phiên làm việc được duy trì an toàn qua HttpOnly Cookie (`nhl_admin_session`).

### 3.2. Đăng thông báo mới
1. Tại trang Quản lý Bảng tin, bấm nút **"+ Tạo thông báo mới"**.
2. **Tiêu đề:** Nhập tiêu đề thông báo (tối đa 250 ký tự).
3. **Đường dẫn (Slug):** Hệ thống tự động chuyển đổi tiêu đề tiếng Việt có dấu thành đường dẫn URL thân thiện chuẩn SEO (ví dụ: `thong-bao-lich-chay-tet-2026`). Quản trị viên có thể tùy biến nếu cần.
4. **Mô tả ngắn (Summary):** Đoạn tóm tắt từ 1 - 2 câu (tối đa 500 ký tự) sẽ hiển thị ở thẻ tin trên trang chủ và danh sách bảng tin.
5. **Nội dung chi tiết (Rich Text Content):**
   - Hỗ trợ định dạng: Tiêu đề mục (Heading 2, Heading 3), In đậm, Danh sách dấu chấm/đánh số, Trích dẫn, Chèn liên kết.
   - **Chèn ảnh vào nội dung:** Bấm nút ảnh trên thanh công cụ, chọn tệp ảnh từ máy tính. Hệ thống tự động tải lên và chèn vào đúng vị trí con trỏ.
6. **Ảnh đại diện (Cover Image):**
   - Tải lên ảnh đại diện bài viết (dung lượng tối đa 5MB; định dạng: WebP, PNG, JPEG).
   - Nhập mô tả ảnh (Alt text) và chú thích ảnh (Caption).
7. **Tài liệu đính kèm (PDF Attachments):**
   - Bấm nút **"+ Tải lên tệp đính kèm"** để đính kèm các tài liệu công văn, biểu phí, quy chuẩn (dung lượng tối đa 10MB; chỉ nhận tệp PDF).
8. **Tùy chọn hiển thị:**
   - **Ghim lên đầu trang:** Đánh dấu chọn để đưa bài viết lên vị trí ưu tiên số 1 trên Trang chủ và trang Bảng tin.
   - **Lưu bản nháp:** Lưu lại để xem trước hoặc tiếp tục chỉnh sửa sau, chưa xuất hiện trên website công khai.
   - **Đăng thông báo:** Xuất bản công khai ngay lập tức lên website.

### 3.3. Xem trước bản nháp (Draft Preview)
- Khi một thông báo ở trạng thái **Bản nháp (Draft)**, người ngoài truy cập vào liên kết sẽ nhận mã phản hồi `404 Not Found`.
- Riêng Quản trị viên đã đăng nhập có thể bấm nút **"Xem trước"** trên danh sách hoặc trình soạn thảo. Trang sẽ hiển thị thanh thông báo màu hổ phách: *"Bạn đang xem trước bản nháp — Nội dung này chưa được xuất bản công khai"*.
- Hệ thống gửi tiêu đề `Cache-Control: private, no-store` để tuyệt đối không lưu cache bản nháp lên CDN hoặc proxy công cộng.

### 3.4. Quản lý trạng thái, Thùng rác và Xóa bài
- **Ghim / Bỏ ghim:** Bấm nút biểu tượng ghim để đưa bài viết lên đầu hoặc chuyển về thứ tự ngày đăng thông thường.
- **Gỡ đăng (Về nháp):** Bấm "Gỡ đăng" để rút bài viết khỏi giao diện công khai mà vẫn giữ nguyên nội dung.
- **Chuyển vào thùng rác (Soft Delete):** Xóa mềm bài viết để lưu vào tab "Thùng rác", đề phòng thao tác nhầm lẫn.
- **Khôi phục bài viết:** Truy cập tab "Thùng rác", bấm "Khôi phục" để đưa bài viết trở lại danh sách Bản nháp.
- **Xóa vĩnh viễn (Hard Delete):** Thao tác này sẽ xóa hoàn toàn bài viết và giải phóng tệp đính kèm khỏi hệ thống lưu trữ. Có hộp thoại cảnh báo xác nhận trước khi thực hiện.

---

## 4. CƠ CHẾ AN TOÀN & BẢO MẬT DỮ LIỆU

### 4.1. Khử mã độc XSS (HTML Sanitizer)
- Toàn bộ nội dung nhập từ trình soạn thảo rich-text đều được kiểm duyệt chặt chẽ ở phía máy chủ trước khi lưu vào cơ sở dữ liệu.
- Hệ thống loại bỏ hoàn toàn các thẻ nguy hiểm (`<script>`, `<iframe>`, `<object>`, `<embed>`, `<style>`, `<form>`) và các thuộc tính thực thi sự kiện (`onerror`, `onload`, `onclick`, `javascript:`).
- Chỉ chấp nhận danh mục thẻ an toàn phục vụ trình bày văn bản nghiệp vụ: `p`, `h2`, `h3`, `strong`, `em`, `ul`, `ol`, `li`, `blockquote`, `a`, `img`, `br`.

### 4.2. Kiểm soát xung đột phiên bản (Optimistic Concurrency Locking)
- Để tránh trường hợp hai người quản trị cùng mở sửa một bài viết và vô tình ghi đè mất thông tin của nhau:
- Mỗi bài viết sở hữu một trường số nguyên `version`.
- Khi lưu, trình duyệt gửi kèm số `expectedVersion`. Nếu phiên bản trên máy chủ đã thay đổi (do một người khác đã lưu trước đó), hệ thống sẽ từ chối lưu với mã lỗi `409 Conflict` và thông báo người dùng tải lại trang để đối soát nội dung mới nhất.

### 4.3. Kiểm duyệt tệp tải lên (Magic Bytes & Anti-Spoofing)
- Hệ thống **không tin cậy** phần mở rộng tệp hoặc `Content-Type` do trình duyệt gửi lên (vì có thể bị giả mạo).
- Máy chủ đọc trực tiếp các byte đầu tiên (Magic bytes) của tệp nhị phân:
  - PNG: `89 50 4E 47`
  - JPEG: `FF D8 FF`
  - WebP: `52 49 46 46 ... 57 45 42 50` (RIFF ... WEBP)
  - PDF: `25 50 44 46` (`%PDF`)
- Tuyệt đối cấm tải lên tệp SVG (nguy cơ chứa script độc), HTML, tệp thực thi EXE, ZIP, JS, v.v.

### 4.4. Bảo vệ tệp của bài nháp (Draft Media Protection)
- Tệp đính kèm và ảnh nội dung được phục vụ qua endpoint `/api/news/files/[id]`.
- Khi bài viết chứa tệp đang ở trạng thái Nháp, người dùng chưa đăng nhập sẽ nhận `404 Not Found` nếu cố tình dò quét URL tệp.

---

## 5. QUY TRÌNH SAO LƯU & PHỤC HỒI (BACKUP & RECOVERY)

Tại trang `/admin/`, góc trên bên phải thanh công cụ có phân vùng **Sao lưu dữ liệu**:

1. **Xuất tệp sao lưu (Export JSON):**
   - Bấm nút **"Xuất sao lưu JSON"**.
   - Trình duyệt sẽ tải về tệp tin dạng `nhl-news-backup-YYYY-MM-DD.json` chứa toàn bộ danh sách thông báo, nội dung toàn văn, trạng thái và ngày xuất bản.
   - Khuyến nghị: Thực hiện định kỳ hàng tháng hoặc trước khi đăng các chiến dịch thông báo lớn.

2. **Khôi phục dữ liệu (Import JSON):**
   - Bấm nút **"Phục hồi từ JSON"**, chọn tệp tin sao lưu trước đó.
   - Hệ thống sẽ nạp lại toàn bộ dữ liệu thông báo vào kho lưu trữ bền vững.

---

## 6. LƯU TRỮ VÀ DỰ PHÒNG CHI PHÍ NETLIFY BLOBS

- Hệ thống tận dụng gói **Netlify Blobs** (nằm sẵn trong tài khoản Netlify của website).
- Mức sử dụng ước tính:
  - Mỗi bài thông báo tiêu thụ ~5KB văn bản JSON.
  - 100 bài thông báo chỉ tiêu thụ ~500KB lưu trữ.
  - Quota miễn phí của Netlify cung cấp đủ dung lượng cho hàng nghìn thông báo trong nhiều năm vận hành mà không phát sinh thêm chi phí máy chủ.
- **Quy tắc bất biến khi chạy Production:** Nếu kết nối Netlify Blobs gặp sự cố, hệ thống sẽ báo lỗi rõ ràng và dừng lại, tuyệt đối không âm thầm ghi vào bộ nhớ tạm để tránh mất mát dữ liệu khi serverless function khởi động lại.

