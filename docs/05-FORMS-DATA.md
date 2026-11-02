# 05 — Forms, Lead Data Contract & Excel Export

## 1. Mục tiêu
Website **không cần** database riêng / PHP server. 

> [!IMPORTANT]
> **Thay đổi phạm vi đã được phê duyệt:** Hệ thống tiếp nhận biểu mẫu liên hệ chính (`ContactForm.astro` tại `/lien-he/`) được kết nối tự động trực tiếp với **Google Sheets** (tự động tạo bảng tính "Khách hàng Nam Hân" và ghi dòng mới khi khách gửi form). Phương án này thay thế hoàn toàn luồng xuất CSV thủ công qua Netlify Forms cho form chính. Chi tiết hướng dẫn xem tại `docs/GOOGLE-SHEETS-SETUP.md`.
> 
> Đối với 2 form dịch vụ khác (`handling_quote` và `route_inquiry`): Vẫn duy trì giao diện demo Phase 1 và chưa đấu nối Google Sheets do chưa có quyết định phê duyệt về việc bổ sung trường số điện thoại liên hệ còn thiếu.

## 2. Các hình thức biểu mẫu xác minh từ Figma
| `request_type` | Figma ID | Fields nhìn thấy trong thiết kế | CTA |
|---|---|---|---|
| `shipment_quote` | `101:1859` | customer type, company/name, origin, destination, cargo description, quantity, phone/Zalo, voice control | Gửi yêu cầu vận chuyển |
| `handling_quote` | `84:1470` | sender name, phone, location, cargo/type, machine need | Gửi yêu cầu điều phối |
| `route_inquiry` | `84:2074` | pickup, delivery | Kiểm tra xe có sẵn — **cần đổi/cần xác nhận** khi không có live availability |

**Lưu ý bắt buộc:** route_inquiry đang thiếu SĐT/Zalo trong Figma. Không thể phản hồi khách chỉ từ điểm đi/đến. Bắt buộc doanh nghiệp duyệt: thêm số điện thoại hoặc chuyển CTA đến form Liên hệ đã điền sẵn điểm nhận/điểm giao. Không thu thập lead thật cho luồng này trước khi giải quyết.

## 3. Canonical normalized lead schema (proposed for Phase 2)
| Field | Type | Required | Mapping |
|---|---|---|---|
| `request_type` | enum | Yes | 3 types ở trên |
| `customer_type` | `individual` / `business` / empty | Theo form | main contact radio |
| `contact_name` | string (<= 150) | Yes | company/name or sender |
| `phone_zalo` | string (<= 30) | Yes trước production | all flows: route inquiry needs change |
| `origin` | string (<= 200) | theo form | main contact, route inquiry |
| `destination` | string (<= 200) | theo form | main contact, route inquiry |
| `cargo_description` | string (<= 1500) | theo form | main contact / handling cargo |
| `cargo_volume` | string (<= 200) | No | main contact |
| `handling_location` | string (<= 200) | theo form | handling form |
| `equipment_need` | string (<= 200) | No | handling form |
| `source_page` | known route | Yes | UI origin |
| `consent` | `yes` | Yes, sau khi privacy notice duyệt | user permission |
| `submitted_at` | provider timestamp | provider | không tin timestamp client |

Schema này là thiết kế dữ liệu **đề xuất**, field required/business rules phải được duyệt. Không khai báo email là required vì Figma hiện không có email trong form chính.

## 4. One CSV dataset, not three fragmented exports
- Dùng **một tên form chuẩn** `lead_request` và `request_type` để phân loại.
- Tạo **một static HTML detection blueprint** duy nhất với **superset field names**. Netlify phải thấy form này trong output `dist` lúc deploy. Tất cả 3 UI variants map về cùng canonical names.
- Adapter chuẩn hoá từng variant trước khi POST. Validate dữ liệu từng request_type; không tự gán giá trị giả.
- Netlify form detection phải được kích hoạt trong dashboard; sau deploy phải có `lead_request` trong Forms tab.
- Nếu dùng JS fetch, send `application/x-www-form-urlencoded` cùng `form-name=lead_request` và đúng các field đã đăng ký. Netlify Forms HTML detection không nhận form chỉ xuất hiện client-side; phải test trên bản deploy Netlify thật.
- Ưu tiên HTML POST không JS ở production cho form chính để progressive enhancement; AJAX chỉ thêm nếu có ích UX.
- Demo Phase 1: chỉ validate/hiển thị UI thử nghiệm; không POST hoặc ghi nhận khách thật. **Không mô phỏng thành công giả**.

## 4a. Mobile form requirements (Phase 1 and Phase 2)
- Cả `shipment_quote`, `handling_quote`, `route_inquiry` dùng chung schema; mobile chỉ thay layout, **không làm mất field**.
- Form chính `/lien-he/`: group radio lớn và dễ bấm; tên, điểm đi, điểm đến, mô tả, khối lượng, SĐT/Zalo xếp **một cột** theo thứ tự đọc. Sidebar hướng dẫn đưa xuống sau form.
- Quote nhanh và route inquiry: fields stack, error dưới đúng input, CTA không bị browser keyboard che; không tự thông báo “có xe” nếu không có điều phối thật.
- `font-size` input >=16px; CTA/touch target theo `docs/11-MOBILE-RESPONSIVE-SPEC.md`; thử trên iOS Safari và Android Chrome thật.
- Khi có validation error / lỗi network: dữ liệu đang nhập giữ nguyên, error nhận biết được bằng screen reader, focus chỉ tới trường cần sửa.

## 5. States & validation
| State | Hành vi |
|---|---|
| `idle` | UI bình thường; nút gửi khả dụng nếu đã approve |
| `invalid` | Ngăn gửi, focus trường lỗi, mô tả lỗi dễ hiểu, không mất dữ liệu |
| `submitting` | Disable duplicate submit, trạng thái loading/aria-busy |
| `success` | Chỉ hiển thị khi provider xác nhận nhận submission; confirmation rõ không báo thời gian phản hồi nếu chưa được duyệt |
| `error` | Không xoá input; gợi ý thử lại/liên hệ hotline; không show stack trace |
| `demo-not-connected` | Preview Phase 1: “Đây là bản demo giao diện, chưa gửi dữ liệu tới Nam Hân.” |

- Required validation server/provider vẫn cần; client validation không đủ chống spam.
- Khi voice đã chuyển thành chữ, text nằm trong trường `cargo_description` như input thường; **không upload raw audio** theo baseline.
- Throttling/anti-bot: bật Netlify spam handling, honeypot, cân nhắc CAPTCHA theo chất lượng lead; test false positive và trải nghiệm mobile.

## 6. Excel & CSV
- Nhân sự đăng nhập **dashboard Netlify do doanh nghiệp sở hữu**, Forms -> `lead_request` -> Download as CSV.
- CSV phải có cột nhất quán và Unicode tiếng Việt được đọc đúng khi mở Excel; hướng dẫn Import/UTF-8 nếu bị lỗi encoding.
- Có thể `Save As .xlsx` từ Microsoft Excel; nếu doanh nghiệp yêu cầu download `.xlsx` ngay trên website, đó là thay đổi scope.
- **CSV injection risk:** trường khách nhập có thể bắt đầu bằng `=`, `+`, `-`, `@`. Không tự tin vào CSV thô khi double-click Excel; hướng dẫn mở qua Power Query/import as text hoặc xử lý escape khi xuất sang hệ thống khác. Không mở CSV không rõ nguồn với macro.
- Không xuất dữ liệu PII trực tiếp ở frontend public. Không đặt CSV trong `public/` hoặc CDN.

## 7. Security, ownership & privacy
- Tài khoản Netlify và repository do doanh nghiệp sở hữu; ít nhất 2 người quản trị, 2FA.
- Các trường chứa dữ liệu cá nhân phải có privacy notice/consent do doanh nghiệp hoặc tư vấn pháp lý duyệt; policy retention và quyền xoá dữ liệu được chốt trước go-live.
- Quy trình phân quyền truy cập submissions; không share dashboard bằng tài khoản cá nhân chung.
- Không log raw request body, không gửi PII sang analytics.
- Kiểm tra plan/quota/giá/form retention và thông báo trước khi ký bàn giao; giới hạn nhà cung cấp có thể thay đổi.
- Thử submit thật trước go-live, đối chiếu dashboard, notification và CSV; test spam và failure modes.

## 8. Exit strategy
- Khi chuyển khỏi Netlify, static `dist/` có thể chuyển host khác, nhưng **phải thay form adapter/provider**, chuyển dữ liệu submission theo CSV export và kiểm tra permissions.
- Lưu hợp đồng field schema + migration guide; không thiết kế UI phụ thuộc endpoint proprietary.

Reference:
- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/submissions/
- https://docs.netlify.com/manage/forms/spam-filters/
