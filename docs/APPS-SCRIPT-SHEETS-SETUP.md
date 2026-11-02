# HƯỚNG DẪN CÀI ĐẶT & BÀN GIAO GOOGLE APPS SCRIPT CHO GOOGLE SHEETS
**Dự án:** Website Doanh nghiệp Vận tải NAM HÂN LOGISTICS  
**Mục tiêu:** Nhận dữ liệu form liên hệ tự động vào Google Sheets mà không cần tạo Google Cloud OAuth Client ID/Secret.

---

## 1. Tổng quan & So sánh phương án

| Tiêu chí | Phương án A: Google Apps Script (Mới) | Phương án B: Google Cloud OAuth 2.0 |
| :--- | :--- | :--- |
| **Yêu cầu cài đặt** | Chỉ cần tài khoản Google thông thường (Gmail/Workspace) | Phải tạo Google Cloud Project, cấu hình màn hình Consent, bật Sheets API, tạo Client ID/Secret |
| **Độ phức tạp bàn giao** | **Rất thấp**: Tạo Sheet, dán mã kịch bản, Deploy Web App là xong | Trung bình - Cao: Phải chia sẻ quyền Google Cloud Project hoặc hướng dẫn tự tạo Client ID |
| **Bảo mật** | Khóa bí mật (Connection Key) được sinh ngẫu nhiên, mã hóa AES-256 trên server | Token OAuth được làm mới tự động qua Refresh Token |
| **Định dạng bảng** | Tự động định dạng 13 cột, màu thương hiệu `#0B2545`, Dropdown trạng thái và quy tắc màu | Tự động tạo bảng qua Google Sheets API v4 |
| **Chống trùng lặp** | LockService (25s) + Kiểm tra Request ID trong cột A | Lưu trữ Request ID trên máy chủ |

> [!IMPORTANT]
> **Nguyên tắc một kênh duy nhất:** Website được lập trình để mỗi lượt khách gửi form chỉ đi qua **duy nhất một phương án** đã kích hoạt. Không bao giờ gửi song song hoặc ghi trùng lặp hai nơi.

---

## 2. Hướng dẫn cài đặt từng bước (Dành cho Kỹ thuật viên / Người nhận bàn giao)

### Bước 1: Tạo Google Sheet mới
1. Đăng nhập vào Google Drive bằng tài khoản Google sẽ dùng để lưu trữ dữ liệu (tài khoản cá nhân thử nghiệm hoặc tài khoản email công ty).
2. Tạo một Google Spreadsheet mới. Đặt tên file là: `Khách hàng Nam Hân Logistics`.

---

### Bước 2: Dán mã kịch bản Apps Script
1. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** &rarr; **Apps Script**.
2. Đổi tên dự án Apps Script ở góc trên bên trái thành: `Nam Han Form Receiver`.
3. Trong giao diện soạn thảo:
   - Mở file `Code.gs`: Xóa hết code mẫu có sẵn, mở file `integrations/google-apps-script/Code.gs` trong mã nguồn dự án và **sao chép toàn bộ nội dung dán vào**.
   - Mở **Cài đặt dự án** (biểu tượng bánh răng ⚙️ ở cột trái) &rarr; Tích chọn: **"Hiển thị tệp kê khai 'appsscript.json' trong trình chỉnh sửa"** (Show appsscript.json).
   - Quay lại Trình chỉnh sửa (biểu tượng `< >`), bấm vào file `appsscript.json`: Dán nội dung từ file `integrations/google-apps-script/appsscript.json` (đảm bảo múi giờ `Asia/Ho_Chi_Minh`).
4. Nhấn biểu tượng **Lưu (Save - Ctrl+S)**.

---

### Bước 3: Khởi tạo bảng & Cấp quyền lần đầu
1. Quay lại tab Google Sheets, nhấn phím `F5` để tải lại trang.
2. Sau khoảng 2 - 3 giây, bạn sẽ thấy xuất hiện một menu mới có tên **"🚛 Nam Hân"** trên thanh công cụ của Sheet.
3. Bấm vào menu **"🚛 Nam Hân"** &rarr; Chọn **"⚙️ Khởi tạo / Kiểm tra cấu trúc bảng"**.
4. **Cấp quyền truy cập Google (Chỉ làm 1 lần duy nhất):**
   - Google sẽ hiển thị hộp thoại *"Cần được ủy quyền"* (Authorization Required) &rarr; Bấm **Tiếp tục**.
   - Chọn tài khoản Google của bạn.
   - Nếu thấy màn hình cảnh báo *"Google chưa xác minh ứng dụng này"*, bấm vào liên kết **Nâng cao (Advanced)** ở góc dưới &rarr; Bấm **Đi tới Nam Han Form Receiver (Không an toàn)**.
   - Bấm **Cho phép (Allow)**.
5. Sau khi cấp quyền xong, bấm lại menu **"🚛 Nam Hân"** &rarr; **"⚙️ Khởi tạo / Kiểm tra cấu trúc bảng"**.
6. Hệ thống sẽ tự động:
   - Tạo tab mang tên **"Yêu cầu vận chuyển"**.
   - Thiết lập 13 cột chuẩn với tiêu đề nền màu xanh Navy (`#0B2545`), chữ trắng in đậm.
   - Thiết lập định dạng văn bản cho cột *Số điện thoại* (giữ nguyên số 0 đầu).
   - Thiết lập menu thả xuống (Dropdown) cho cột *Trạng thái xử lý* với 4 màu tự động.
   - Bật bộ lọc (Filter) và cố định hàng tiêu đề (Freeze row 1).
   - Tự động sinh ra một **Khóa kết nối bí mật (Connection Key)** và hiển thị lên màn hình.

---

### Bước 4: Triển khai Ứng dụng Web (Deploy Web App)
1. Quay lại tab Apps Script, nhìn lên góc trên bên phải, bấm vào nút **Triển khai (Deploy)** &rarr; Chọn **Bản triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng ⚙️ cạnh "Chọn loại", chọn **Ứng dụng web (Web app)**.
3. Cấu hình chính xác như sau:
   - **Mô tả:** `Nam Han Form Receiver v1`
   - **Thực thi dưới dạng (Execute as):** Chọn **Tôi (tài khoản của bạn)** (`user@gmail.com`).
   - **Ai có quyền truy cập (Who has access):** Chọn **Bất kỳ ai (Anyone)**.
     > [!WARNING]
     > **Bắt buộc chọn "Bất kỳ ai" (Anyone):** Nếu chọn "Chỉ mình tôi" hoặc "Bất kỳ ai có tài khoản Google", máy chủ website sẽ bị Google chặn lại ở màn hình đăng nhập và không thể gửi dữ liệu. Bảo mật của hệ thống đã được kiểm soát bằng **Khóa bí mật (Connection Key)** trong nội dung yêu cầu.
4. Bấm nút **Triển khai (Deploy)**.
5. Sao chép **URL ứng dụng web** (có định dạng: `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Bước 5: Điền thông tin vào trang Quản trị Website
1. Mở trang quản trị website: `http://localhost:4321/admin/google-sheets` (hoặc tên miền website thật).
2. Đăng nhập bằng mật khẩu quản trị (`ADMIN_PASSWORD`).
3. Tại tab **"Google Apps Script (Khuyên dùng)"**:
   - **URL Ứng dụng Web:** Dán URL vừa copy ở Bước 4 (kết thúc bằng `/exec`).
   - **Khóa kết nối bí mật:** Dán chuỗi khóa đã sinh ở Bước 3 (nếu quên, mở lại Sheet bấm *Nam Hân &rarr; Kiểm tra cấu hình & Khóa kết nối*).
   - **Đường dẫn Google Sheets:** Dán link của Sheet để tiện mở nhanh từ admin.
4. Bấm nút **"🔍 Kiểm tra kết nối"**:
   - Hệ thống sẽ gửi một tín hiệu kiểm tra (Ping) an toàn không ghi dữ liệu giả.
   - Nếu hiển thị thông báo màu xanh `✅ Thành công! Kết nối thành công tới Google Apps Script!` là hệ thống đã thông suốt.
5. Bấm nút **"💾 Lưu & Kích hoạt nhận dữ liệu"**:
   - Khóa kết nối sẽ được mã hóa bằng AES-256 và lưu trữ bền vững.
   - Kênh tiếp nhận biểu mẫu chính thức chuyển sang Google Apps Script.

---

### Bước 6: Kiểm thử thực tế
1. Mở trang gửi form liên hệ: `http://localhost:4321/lien-he/`.
2. Điền thông tin thử nghiệm:
   - Họ tên: `Nguyễn Văn Thử Nghiệm`
   - Số điện thoại: `0901234567` (có số 0 đầu)
   - Tuyến đường: `Hà Nội` đi `Bình Dương`
   - Hàng hóa: `10 tấn linh kiện cơ khí`
3. Bấm **"Gửi yêu cầu vận chuyển"**.
4. Mở tab Google Sheet `Khách hàng Nam Hân`:
   - Dòng dữ liệu mới lập tức xuất hiện ở tab *Yêu cầu vận chuyển*.
   - Số điện thoại hiển thị đủ `0901234567` mà không bị mất số 0.
   - Trạng thái mặc định là `Mới nhận` kèm màu xanh dịu mắt.
   - Thử gửi lại đúng yêu cầu đó: Hệ thống nhận diện đúng `Request ID`, báo thành công mà **không tạo dòng thứ 2 trùng lặp**!

---

## 3. Cập nhật mã nguồn Apps Script khi có phiên bản mới

Khi có chỉnh sửa trong file `Code.gs`:
1. Mở Apps Script, chỉnh sửa code và nhấn **Lưu (Ctrl+S)**.
2. Bấm **Triển khai (Deploy)** &rarr; **Quản lý bản triển khai (Manage deployments)**.
3. Bấm biểu tượng cây bút ✏️ (Chỉnh sửa) ở góc trên bên phải.
4. Ở dòng **Phiên bản (Version)**, chọn **Phiên bản mới (New version)**.
5. Bấm **Triển khai (Deploy)**.
> [!NOTE]
> URL Web App `/exec` sẽ **giữ nguyên không đổi**. Bạn không cần phải vào lại website admin để sửa link.

---

## 4. Chuyển đổi sang Tài khoản Google Doanh nghiệp

Khi doanh nghiệp muốn đổi sang tài khoản Google Workspace chính thức:
1. Đăng nhập tài khoản doanh nghiệp.
2. Tạo Sheet mới và thực hiện từ **Bước 1 đến Bước 5** bằng tài khoản doanh nghiệp đó.
3. Khi lưu thông tin mới vào trang Admin, hệ thống tự động ghi nhận tiếp vào bảng tính của công ty.
4. **Lưu ý:** Việc đổi tài khoản không tự động copy các dòng dữ liệu cũ trong tài khoản cá nhân sang tài khoản công ty. Nếu cần, quản trị viên chỉ cần copy-paste các dòng dữ liệu từ Sheet cũ sang Sheet mới.

---

## 5. Xử lý các lỗi thường gặp (Troubleshooting)

### 1. Lỗi: "Google yêu cầu đăng nhập" hoặc nhận được trang HTML
* **Nguyên nhân:** Khi Triển khai (Deploy), mục *"Ai có quyền truy cập"* (Who has access) chưa chọn *"Bất kỳ ai"* (Anyone).
* **Khắc phục:** Vào lại Apps Script &rarr; *Quản lý bản triển khai* &rarr; Sửa quyền thành **Bất kỳ ai (Anyone)** &rarr; Chọn *Phiên bản mới* &rarr; Lưu.

### 2. Lỗi: "Khóa kết nối không hợp lệ" (UNAUTHORIZED)
* **Nguyên nhân:** Khóa nhập trên website không khớp với khóa lưu trong `Script Properties`.
* **Khắc phục:** Trên Google Sheet, bấm menu *Nam Hân &rarr; Kiểm tra cấu hình & Khóa kết nối* để copy lại chính xác khóa.

### 3. Lỗi: "Tên miền không thuộc hệ thống Google Apps Script được phép"
* **Nguyên nhân:** Nhập nhầm link chỉnh sửa Apps Script (`script.google.com/home/projects/...`) thay vì URL Web App triển khai.
* **Khắc phục:** URL đúng bắt buộc phải kết thúc bằng chữ `/exec` (ví dụ: `https://script.google.com/macros/s/AKfycb.../exec`).

### 4. Lỗi: Quá thời gian kết nối (Timeout)
* **Nguyên nhân:** Lần gọi đầu tiên Google Apps Script có thể mất 3 - 5 giây để "khởi động lạnh" (Cold start).
* **Khắc phục:** Bấm lại nút "Kiểm tra kết nối" lần thứ 2. Các lần gọi tiếp theo sẽ phản hồi rất nhanh (dưới 1 giây).

