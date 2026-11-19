# HƯỚNG DẪN TRIỂN KHAI PRODUCTION (VERCEL & NETLIFY)
## DỰ ÁN NAM HÂN LOGISTICS (ASTRO 5 + UPSTASH REDIS / VERCEL + GOOGLE APPS SCRIPT)

---

### I. TỔNG QUAN KIẾN TRÚC TRIỂN KHAI

* **Framework:** Astro 5 (`output: 'static'` kết hợp On-Demand SSR via `@astrojs/vercel` hoặc `@astrojs/netlify`).
* **Nền tảng Hosting chính:** **Vercel** (Miễn phí băng thông lớn, tốc độ CDN cao).
* **Lưu trữ dữ liệu động (Bảng tin & Cấu hình):** **Upstash Redis** (Serverless Redis REST API, miễn phí 10.000 lệnh/ngày) hoặc Netlify Blobs (nếu chạy Netlify).
* **Tiếp nhận đơn hàng / Form liên hệ:** Google Apps Script Web App (ghi trực tiếp vào Google Sheets doanh nghiệp theo thời gian thực).
* **Bảo mật:** Mã hóa khóa kết nối AES-256-GCM, bảo vệ chống brute force và tấn công CSRF.

---

### II. CHUẨN BỊ BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Khi tạo dự án trên Vercel (hoặc Netlify), bạn thêm các biến môi trường sau:

| Tên biến | Bắt buộc | Mô tả & Giá trị mẫu |
| :--- | :---: | :--- |
| `ADMIN_PASSWORD` | **Bắt buộc** | Mật khẩu đăng nhập vào khu vực Quản trị (`/admin/`). Ví dụ: `NamHan@Logistics2026!` |
| `ADMIN_SECRET` | **Bắt buộc** | Khóa bí mật dùng để mã hóa AES-256 các khóa kết nối và ký cookie phiên làm việc. Chuỗi ngẫu nhiên $\ge 32$ ký tự. Ví dụ: `namhan_prod_secret_8f9e2b1c4a7d6e5f0a3b2c1d` |
| `UPSTASH_REDIS_REST_URL` | **Khuyên dùng** | URL kết nối cơ sở dữ liệu Upstash Redis (lấy từ [console.upstash.com](https://console.upstash.com/)). |
| `UPSTASH_REDIS_REST_TOKEN` | **Khuyên dùng** | Token xác thực Upstash Redis. |

> [!NOTE]
> Không cần thêm `GOOGLE_CLIENT_ID` hay `GOOGLE_CLIENT_SECRET` vì hệ thống hiện đã sử dụng phương án Google Apps Script Web App (toàn bộ URL và Khóa bí mật được quản lý và lưu trực tiếp qua trang quản trị `/admin/google-sheets/`).

---

### III. CÁC BƯỚC TRIỂN KHAI LÊN VERCEL (CHÍNH THỨC)

1. **Đẩy mã nguồn lên kho chứa GitHub:**
   ```bash
   git add .
   git commit -m "feat: ready for vercel production deployment"
   git push origin main
   ```

2. **Tạo Database Upstash Redis miễn phí (100% Free):**
   * Truy cập [console.upstash.com](https://console.upstash.com/) và đăng nhập.
   * Bấm **Create Database** &rarr; đặt tên `namhan-db` &rarr; chọn region `Singapore (ap-southeast-1)` &rarr; bấm **Create**.
   * Cuộn xuống phần **REST API**, chọn tab **.env** để lấy `UPSTASH_REDIS_REST_URL` và `UPSTASH_REDIS_REST_TOKEN`.

3. **Kết nối kho chứa trên Vercel:**
   * Đăng nhập vào [Vercel Dashboard](https://vercel.com/).
   * Bấm **Add New...** &rarr; Chọn **Project**.
   * Chọn repo `SP_MinhNgoc` (hoặc `NamHan_Logistics`) từ GitHub.
   * Framework Preset: Chọn **Astro** (Vercel tự động nhận diện).
   * Tại mục **Environment Variables**, thêm 4 biến: `ADMIN_PASSWORD`, `ADMIN_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
   * Bấm **Deploy**.

4. **Kết quả:**
   * Vercel tự động build và cấp tên miền (ví dụ: `https://nam-han-logistics.vercel.app`).
   * Khi cần gắn tên miền riêng của doanh nghiệp: Vào **Settings** &rarr; **Domains** &rarr; Nhập tên miền (ví dụ: `namhanlogistics.com`).

---

### IV. TRIỂN KHAI DỰ PHÒNG LÊN NETLIFY (NẾU CẦN)

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

