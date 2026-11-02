# Hướng Dẫn Thiết Lập Tích Hợp Google Sheets — Nam Hân Logistics

Tài liệu hướng dẫn quản trị viên và kỹ sư vận hành kết nối biểu mẫu gửi yêu cầu vận chuyển (`/lien-he/`) trực tiếp với Google Sheets thông qua Google OAuth 2.0 và Google Sheets API v4.

---

## 1. Tổng quan Kiến Trúc & Luồng Dữ Liệu

1. **Giao diện người dùng (`/lien-he/`):**
   - Biểu mẫu `ContactForm.astro` tiếp nhận thông tin từ khách hàng (loại khách, họ tên, điểm đi, điểm đến, mô tả hàng, khối lượng, số điện thoại/Zalo, kèm hỗ trợ nhập giọng nói).
   - Form gửi POST trực tiếp đến endpoint nội bộ `/api/contact/submit` kèm mã yêu cầu (`requestId`) và bộ lọc honeypot chống bot.

2. **Xử lý phía Serverless (`/api/contact/submit`):**
   - Kiểm tra honeypot, giới hạn kích thước gói tin (< 50KB), xác thực định dạng dữ liệu (số điện thoại 9–15 số, độ dài các trường).
   - Chống gửi trùng lặp (Idempotency): Tự động phát hiện và chặn ghi lặp nếu cùng một `requestId` được bấm gửi liên tục hoặc retry mạng.
   - Chống Formula Injection: Tự động thêm tiền tố nháy đơn `'` đối với các trường bắt đầu bằng ký tự nguy hiểm (`=`, `+`, `-`, `@`, tab, enter) và trường số điện thoại để giữ nguyên số 0 đầu (`'0856...`).
   - Lấy token hợp lệ và ghi trực tiếp một dòng mới vào bảng tính Google Sheets thông qua Google Sheets API v4.

3. **Bảng điều khiển Quản trị (`/admin/google-sheets/`):**
   - Trang bảo vệ bằng phiên quản trị (`nhl_admin_session`, cookie HTTP-only signed HMAC-SHA256).
   - Cho phép quản trị viên đăng nhập Google một chạm, hệ thống tự động tạo bảng tính **"Khách hàng Nam Hân"** trên Google Drive với 10 cột tiêu đề chuẩn hóa.
   - Hỗ trợ cơ chế **Đổi tài khoản an toàn (Staged Account Switch)**: Khi kết nối tài khoản mới, hệ thống tạo bảng mới nhưng vẫn duy trì ghi dữ liệu vào bảng cũ cho đến khi quản trị viên bấm "Xác nhận chuyển". Bảng cũ và dữ liệu cũ trên Drive không bao giờ bị xóa.

---

## 2. Thiết Lập Google Cloud Console

Để cấp quyền OAuth 2.0 và Sheets API, quản trị viên thực hiện các bước sau trên Google Cloud Console:

### Bước 1: Tạo hoặc chọn Project trên Google Cloud
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Đăng nhập bằng tài khoản Google quản trị (có thể dùng tài khoản cá nhân thử nghiệm trước, sau đó dùng tài khoản doanh nghiệp).
3. Tạo một Project mới, đặt tên: `Nam Han Logistics Web`.

### Bước 2: Kích hoạt Google APIs
Vào menu **APIs & Services > Library**, tìm kiếm và bấm **Enable** cho 2 API sau:
1. **Google Sheets API** (Để đọc, tạo bảng tính và thêm dòng dữ liệu).
2. **Google Drive API** (Để tạo file trong Drive của tài khoản kết nối).

### Bước 3: Cấu hình OAuth Consent Screen (Màn hình đồng ý)
1. Vào **APIs & Services > OAuth consent screen**.
2. Chọn **User Type**:
   - Nếu dùng Google Workspace Doanh nghiệp: Chọn **Internal** (chỉ thành viên trong công ty mới đăng nhập được).
   - Nếu dùng Gmail cá nhân để thử nghiệm: Chọn **External**.
3. Điền thông tin ứng dụng:
   - App name: `Nam Hân Logistics Web Form`
   - User support email: Email của quản trị viên.
   - Developer contact email: Email kỹ thuật.
4. **Scopes (Phạm vi truy cập tối thiểu):**
   - Bấm **Add or Remove Scopes**, thêm:
     * `https://www.googleapis.com/auth/drive.file` *(Chỉ xem, tạo và chỉnh sửa đúng các file/sheet do ứng dụng này tạo ra, hoàn toàn không xem được tài liệu cá nhân khác trên Drive)*.
     * `https://www.googleapis.com/auth/userinfo.email` *(Để hiển thị email tài khoản đang kết nối trên trang quản trị)*.
5. Nếu ở chế độ **External Testing**: Thêm email thử nghiệm vào mục **Test users** (để tài khoản đó có thể đăng nhập trong giai đoạn thử nghiệm).

### Bước 4: Tạo OAuth 2.0 Client ID
1. Vào **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
2. **Application type**: Chọn **Web application**.
3. **Name**: `Nam Han Web Client`.
4. **Authorized redirect URIs (Cực kỳ quan trọng):**
   - Cho môi trường local development:
     `http://localhost:4321/api/auth/google/callback`
   - Cho môi trường Production (sau khi gắn domain Netlify):
     `https://namhanlogistics.vn/api/auth/google/callback`
     *(hoặc domain Netlify: `https://<ten-site>.netlify.app/api/auth/google/callback`)*
5. Bấm **Create**. Google sẽ cấp:
   - **Client ID** (ví dụ: `xxxx-xxxx.apps.googleusercontent.com`)
   - **Client Secret** (ví dụ: `GOCSPX-xxxx`)

---

## 3. Danh Mục Biến Môi Trường (Environment Variables)

Cấu hình các biến sau trong file `.env` (khi chạy local) và trong **Netlify Site Configuration > Environment variables** (khi deploy production):

| Tên Biến | Bắt buộc | Mô tả & Mục đích | Ví dụ giá trị |
|---|:---:|---|---|
| `GOOGLE_CLIENT_ID` | Có | Client ID được cấp từ Google Cloud Console | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Có | Client Secret được cấp từ Google Cloud Console | `GOCSPX-abc123xyz` |
| `GOOGLE_REDIRECT_URI` | Tùy chọn | URI nhận phản hồi sau khi đăng nhập Google. Nếu không điền, hệ thống tự động suy ra từ host của request hiện hành (`/api/auth/google/callback`) | `https://namhanlogistics.vn/api/auth/google/callback` |
| `ADMIN_PASSWORD` | Có | Mật khẩu truy cập trang quản trị `/admin/google-sheets/` | Khởi tạo chuỗi bảo mật ngẫu nhiên (ví dụ: `NamHan@Logistics2026!Secure`) |
| `ADMIN_SECRET` | Có | Khóa bí mật dùng để mã hóa AES-256-GCM lưu trữ refresh token và ký session cookie HMAC-SHA256 | Chuỗi ngẫu nhiên dài từ 32 ký tự trở lên (ví dụ: `nhl_secret_key_8f9e2b1c4a7d6e5f0a3b2c1d`) |

> [!WARNING]
> Tuyệt đối không commit các giá trị bí mật (`GOOGLE_CLIENT_SECRET`, `ADMIN_PASSWORD`, `ADMIN_SECRET`) vào Git repository hoặc log công khai. Mọi secret chỉ được khai báo trong môi trường Serverless của Netlify hoặc file `.env` cục bộ đã được đưa vào `.gitignore`.

---

## 4. Hướng Dẫn Vận Hành & Sử Dụng

### 4.1. Khởi chạy thử nghiệm tại Local (`localhost:4321`)
1. Tạo file `.env` ở thư mục gốc của dự án:
   ```env
   GOOGLE_CLIENT_ID="<client-id-cua-ban>"
   GOOGLE_CLIENT_SECRET="<client-secret-cua-ban>"
   GOOGLE_REDIRECT_URI="http://localhost:4321/api/auth/google/callback"
   ADMIN_PASSWORD="admin_test_password"
   ADMIN_SECRET="random_32_chars_secret_encryption_key_here"
   ```
2. Khởi chạy server dev:
   ```bash
   npm run dev
   ```
3. Mở trình duyệt vào `http://localhost:4321/admin/google-sheets/`.
4. Nhập mật khẩu quản trị (`ADMIN_PASSWORD`).
5. Bấm nút **"Kết nối Google Sheets ngay"**.
6. Đăng nhập tài khoản Google và chấp thuận cấp quyền.
7. Hệ thống tự động chuyển hướng về trang quản trị với thông báo:
   * **🟢 Đang hoạt động**
   * Tên bảng tính: `Khách hàng Nam Hân`
   * Link mở Google Sheets: `https://docs.google.com/spreadsheets/d/.../edit`
8. Mở tab mới vào `http://localhost:4321/lien-he/`, điền thử một form và bấm "Gửi yêu cầu vận chuyển". Mở Google Sheets để thấy dòng dữ liệu xuất hiện ngay lập tức!

### 4.2. Chuyển giao sang Tài khoản Doanh nghiệp (Zero Downtime)
Khi muốn đổi nơi nhận dữ liệu sang tài khoản Google Workspace chính thức của công ty:
1. Quản trị viên đăng nhập vào `/admin/google-sheets/`.
2. Bấm **"Đổi sang tài khoản Google khác"**.
3. Đăng nhập vào tài khoản Google Doanh nghiệp và cấp quyền.
4. Sau khi hoàn tất, hệ thống tự tạo bảng tính mới trên Drive của doanh nghiệp và hiển thị khung **"CHỜ XÁC NHẬN CHUYỂN ĐỔI"**:
   - Bảng tính của tài khoản cũ vẫn tiếp tục nhận dữ liệu form bình thường trong thời gian này.
   - Quản trị viên có thể bấm vào link để kiểm tra cấu trúc bảng tính mới.
5. Quản trị viên bấm **"Xác nhận chuyển sang tài khoản này"**:
   - Toàn bộ các lượt gửi form tiếp theo sẽ được ghi vào bảng tính mới.
   - Bảng tính cũ và dữ liệu cũ trên Drive của tài khoản trước vẫn được bảo lưu 100%, không bị xóa hay can thiệp.

### 4.3. Xử lý khi Token hết hạn hoặc Cần Cấp quyền lại (Re-authentication)
- Nếu Google Account bị đổi mật khẩu hoặc ứng dụng ở chế độ Testing của Google quá 7 ngày làm refresh token hết hạn:
- Trạng thái trên trang quản trị sẽ hiển thị huy hiệu màu vàng **🟡 Cần cấp quyền lại**.
- Người dùng khi gửi form nếu gặp lỗi auth sẽ được hướng dẫn liên hệ Hotline trực tiếp để không bị lỡ đơn hàng.
- Quản trị viên chỉ cần vào `/admin/google-sheets/` và bấm nút **"Cấp quyền lại cho tài khoản"** để kích hoạt lại kết nối trong 5 giây.

---

## 5. Dữ Liệu Bảng Tính & Xử Lý Cột (Lead Data Schema)

Bảng tính **"Khách hàng Nam Hân"** (Sheet tab: `Yêu cầu vận chuyển`) có các cột sau:

| STT | Tên Cột | Định dạng dữ liệu | Ý nghĩa |
|---|---|---|---|
| A | `Mã yêu cầu` | Text (ví dụ: `NHL-20261101-ABCD`) | Mã định danh duy nhất (Idempotency Key) phục vụ tra cứu |
| B | `Thời gian` | Text (Giờ Việt Nam UTC+7) | Thời điểm khách gửi form |
| C | `Loại khách hàng` | `Doanh nghiệp` hoặc `Cá nhân` | Phân loại từ nút chọn trên form |
| D | `Tên công ty / Họ tên` | Text (tối đa 150 ký tự) | Tên khách hàng hoặc tên pháp nhân |
| E | `Số điện thoại / Zalo` | Text (bắt đầu bằng `'0...`) | Giữ nguyên số 0 đầu, không bị biến thành số |
| F | `Điểm đi` | Text (tối đa 200 ký tự) | Tỉnh/thành hoặc địa chỉ nhận hàng |
| G | `Điểm đến` | Text (tối đa 200 ký tự) | Tỉnh/thành hoặc địa chỉ giao hàng |
| H | `Mô tả hàng hóa` | Text (tối đa 1500 ký tự) | Loại hàng hóa (hỗ trợ nhập tay hoặc qua giọng nói) |
| I | `Khối lượng / Số lượng` | Text (tối đa 200 ký tự) | Số tấn, pallet, thùng hoặc quy cách đóng gói |
| J | `Nguồn form` | Text (`/lien-he/`) | Đường dẫn trang phát sinh lead |

---

## 6. Giới Hạn, Chi Phí & Bảo Mật

1. **Chi phí Google Sheets & Drive API:**
   - Hoàn toàn **miễn phí** trong hạn mức tiêu chuẩn của Google Cloud (Google cấp 300 requests/phút cho Sheets API và 20,000 requests/ngày, vượt xa nhu cầu nhận báo giá vận chuyển thông thường).
2. **Lưu trữ Persistent Storage:**
   - Trên Netlify Production: Sử dụng **Netlify Blobs** (nằm trong hạn mức gói Free của Netlify: 100,000 reads/tháng, 10,000 writes/tháng).
   - Trên Local Dev: Sử dụng file mã hóa an toàn `.data/connection_state.json` (tự động loại trừ khỏi Git).
3. **Phạm vi áp dụng:**
   - Đã đấu nối: Biểu mẫu chính `ContactForm` tại `/lien-he/`.
   - Chưa đấu nối: 2 form dịch vụ `HandlingQuoteForm` (Bốc xếp) và `LogisticsRouteInquiry` (Kiểm tra xe) do thiết kế Figma ban đầu còn thiếu trường số điện thoại liên hệ và đang chờ doanh nghiệp phê duyệt bổ sung trường.

