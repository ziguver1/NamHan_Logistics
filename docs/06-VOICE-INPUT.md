# 06 — Voice Input (Nói thay vì nhập)

## 1. Figma reference
Trang Liên hệ `101:1816`, voice banner node **`101:1937`**, trong form `101:1859`. Text hiển thị:
- “Nói thay vì nhập”
- “Nhấn để ghi âm mô tả yêu cầu vận chuyển của bạn”

Người dùng xác nhận **phải hoạt động thật**. Tuy nhiên, giao tiếp cuối cùng với dữ liệu chưa được xác nhận: speech-to-text hay đính kèm file ghi âm. Để phù hợp chủ trương không backend, baseline proposal là **Speech-to-text tiếng Việt**, không lưu audio. Cần doanh nghiệp duyệt trước production; nếu yêu cầu gửi audio thì mở ADR.

## 2. UX state machine — phase 1 có thể xây trước khi kết nối form
1. `unsupported`: API không có / browser không hỗ trợ; ẩn/disable nút mic với giải thích và giữ textarea nhập tay.
2. `idle`: nút "Bắt đầu nói"; không xin microphone permission tự động.
3. `requesting_permission`: khi người dùng chủ động bấm; giải thích quyền microphone, UI busy.
4. `listening`: nút chuyển "Dừng" và hiện aria-live trạng thái đang nghe; không khẳng định ghi file.
5. `transcribing`: khi nhận kết quả, đưa text vào textarea `cargo_description` (có thể append sau khi người dùng chọn).
6. `complete`: người dùng kiểm tra/sửa lại text trước khi gửi.
7. `permission_denied` / `no_speech` / `network_error` / `aborted`: message rõ, fallback nhập tay; không mất nội dung trước đó.

## 3. Interface boundary
```ts
interface VoiceTranscriber {
  isSupported(): boolean;
  start(options: { language: 'vi-VN' }): void;
  stop(): void;
  onTranscript(callback: (text: string, isFinal: boolean) => void): void;
  onError(callback: (code: string) => void): void;
}
```
- Chọn Web Speech API (`SpeechRecognition` hoặc `webkitSpeechRecognition`) khi feature-detected; `lang='vi-VN'`.
- Không thêm thư viện speech hoặc secret client-side. Không tự thu MediaRecorder và upload file.
- Không ghi audio vào localStorage/analytics/log. Cần notice phù hợp vì một số browser sử dụng speech service bên ngoài.
- Cho phép edit thủ công; không tự submit khi hoàn thành nhận diện.
- Nếu voice thất bại, toàn bộ website và form vẫn phải dùng được.

## 3a. Mobile-specific UX contract
- Nút mic nằm trong flow form contact có nhãn nhìn thấy; phải bấm/chạm rõ và thao tác được khi keyboard đang mở hoặc sau khi đóng keyboard.
- Khi bật chế độ nghe: thể hiện trạng thái và nút `Dừng`; không chiếm toàn màn hình trừ khi được duyệt.
- Khi xoay điện thoại, viewport thay đổi hoặc đóng/mở keyboard, không mất transcript hay dữ liệu nhập.
- Nếu mic denied/unsupported hoặc tab bị background, dừng/quản lý trạng thái an toàn; textarea vẫn nhập tay được và submit không phụ thuộc mic.
- Trước nghiệm thu voice mobile phải kiểm thử **thiết bị thật** iOS Safari và Android Chrome trong phạm vi hỗ trợ, không chỉ desktop hoặc emulation. Xem `docs/11-MOBILE-RESPONSIVE-SPEC.md`.

## 4. Browser support (không được overpromise)
- SpeechRecognition **không phải Baseline**: khả năng hỗ trợ browser/device khác nhau. Test Chrome desktop, Edge desktop, Android Chrome, Safari iOS; trên browser unsupported hiển thị fallback rõ.
- Chỉ kiểm tra feature detection không đủ: thử mic permission, tiếng Việt, network error, deny và cancel thực tế.
- Việc speech phải hoạt động trên tất cả browser có thể buộc chuyển sang speech service khác (phát sinh chi phí/backend privacy); cần quyết định mới.
- Voice không thay thế validation field; sử dụng như một tùy chọn nhập liệu.

## 5. Acceptance
- API supported: user click mic -> browser asks permission -> user speaks tiếng Việt -> thấy transcript -> edit -> submit qua form (khi Phase 2 active).
- Browser unsupported / permission denied: form text entry vẫn đầy đủ; thông báo có thể truy cập bằng keyboard/screen reader.
- Không có auto recording/background mic access hoặc lưu audio khi không được duyệt.
- Không cần reimplement layout chung khi thay speech adapter.

Reference: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
