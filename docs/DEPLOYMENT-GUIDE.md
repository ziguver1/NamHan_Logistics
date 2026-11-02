# HƯỚNG DẪN TRIỂN KHAI PRODUCTION LÊN NETLIFY
## DỰ ÁN NAM HÂN LOGISTICS (ASTRO 5 + NETLIFY BLOBS + GOOGLE APPS SCRIPT)

---

### I. TỔNG QUAN KIẾN TRÚC TRIỂN KHAI

* **Framework:** Astro 5 (`output: 'static'` kết hợp On-Demand SSR via `@astrojs/netlify`).
* **Nền tảng Hosting:** Netlify.
* **Lưu trữ dữ liệu động (Bảng tin & Cấu hình):** Netlify Blobs (tự động tích hợp trong runtime Netlify).
* **Tiếp nhận đơn hàng / Form liên hệ:** Google Apps Script Web App (ghi trực tiếp vào Google Sheets theo thời gian thực).
* **Bảo mật:** Mã hóa khóa kết nối AES-256-GCM, bảo vệ chống brute force và tấn công CSRF.

---

### II. CHUẨN BỊ BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Khi tạo site trên Netlify, bạn **chỉ cần thêm 2 biến môi trường bắt buộc**:

| Tên biến | Bắt buộc | Mô tả & Giá trị mẫu |
| :--- | :---: | :--- |
| `ADMIN_PASSWORD` | **Có** | Mật khẩu đăng nhập vào khu vực Quản trị (`/admin/`). Ví dụ: `NamHan@Logistics2026!` |
| `ADMIN_SECRET` | **Có** | Khóa bí mật dùng để mã hóa AES-256 các khóa kết nối và ký cookie phiên làm việc. Chuỗi ngẫu nhiên $\ge 32$ ký tự. Ví dụ: `namhan_prod_secret_8f9e2b1c4a7d6e5f0a3b2c1d` |

> [!NOTE]
> Không cần thêm `GOOGLE_CLIENT_ID` hay `GOOGLE_CLIENT_SECRET` vì hệ thống hiện đã sử dụng phương án Google Apps Script Web App (toàn bộ URL và Khóa bí mật được quản lý và lưu trực tiếp qua trang quản trị `/admin/google-sheets/`).

---

### III. CÁC BƯỚC TRIỂN KHAI

#### CÁCH 1: TRIỂN KHAI QUA GITHUB (KHUYÊN DÙNG — TỰ ĐỘNG BUILD MỖI KHI PUSH CODE)

1. **Đẩy mã nguồn lên kho chứa GitHub:**
   ```bash
   git add .
   git commit -m "feat: ready for netlify production deployment"
   git push origin main
   ```

2. **Kết nối kho chứa trên Netlify:**
   * Đăng nhập vào [Netlify Dashboard](https://app.netlify.com/).
   * Bấm **Add new site** &rarr; Chọn **Import an existing project**.
   * Chọn **GitHub** và cấp quyền truy cập vào repo `SP_MinhNgoc`.

3. **Cấu hình thông số Build:**
   * Netlify sẽ tự động nhận diện từ tệp `netlify.toml`:
     * **Build command:** `npm run build`
     * **Publish directory:** `dist`
     * **Functions directory:** `.netlify/v1/functions` (tự động)

4. **Thêm biến môi trường:**
   * Tại màn hình cài đặt trước khi deploy (hoặc vào **Site configuration &rarr; Environment variables**):
   * Thêm `ADMIN_PASSWORD` và `ADMIN_SECRET`.

5. **Bấm "Deploy site":**
   * Netlify sẽ tự động tải các gói phụ thuộc (`npm ci`), kiểm tra type (`astro check`), biên dịch website (`astro build`) và kích hoạt link chạy chính thức (ví dụ: `https://namhan-logistics.netlify.app`).

---

#### CÁCH 2: TRIỂN KHAI TRỰC TIẾP TỪ DÒNG LỆNH (NETLIFY CLI)

Nếu bạn không muốn liên kết qua GitHub hoặc cần deploy thủ công nhanh:

1. **Cài đặt Netlify CLI (nếu chưa có):**
   ```bash
   npm install -g netlify-cli
   ```

2. **Đăng nhập vào tài khoản Netlify:**
   ```bash
   netlify login
   ```

3. **Biên dịch dự án:**
   ```bash
   npm run build
   ```

4. **Triển khai Production:**
   ```bash
   netlify deploy --prod
   ```
   * Làm theo hướng dẫn trên terminal để chọn tạo Site mới (Create & configure a new site) hoặc liên kết vào site có sẵn.

---

### IV. KIỂM TRA & NGHIỆM THU SAU KHI TRIỂN KHAI

Ngay sau khi trang web được phát hành thành công:

1. **Kiểm tra Trang chủ & Dịch vụ:**
   * Truy cập domain Netlify được cấp (hoặc tên miền riêng của Nam Hân).
   * Kiểm tra giao diện desktop, máy tính bảng và điện thoại (đảm bảo không bị vỡ layout).
2. **Đăng nhập Quản trị (`/admin/`):**
   * Dùng mật khẩu đã khai báo trong `ADMIN_PASSWORD`.
   * Kiểm tra tab **Bảng tin**: Xem danh sách 3 bài viết mẫu ban đầu.
3. **Cấu hình tiếp nhận Google Sheets (`/admin/google-sheets/`):**
   * Điền **URL Web App** và **Khóa kết nối** từ Google Sheet đã chuẩn bị.
   * Bấm nút **"Kiểm tra kết nối"** &rarr; Báo xanh thành công &rarr; Bấm **"Lưu & Kích hoạt"**.
4. **Kiểm tra gửi form thực tế (`/lien-he/`):**
   * Điền thông tin yêu cầu vận chuyển thử nghiệm kèm ghi chú.
   * Bấm gửi đơn &rarr; Mở Google Sheet kiểm tra dòng mới xuất hiện với đầy đủ 13 cột, đúng định dạng và chiều cao dòng 42px thông thoáng.

