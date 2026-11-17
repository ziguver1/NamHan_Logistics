# Xóa thương hiệu Nam Hân trong ảnh — 06/11/2026

## Phạm vi được người dùng xác nhận

Xóa chữ, biểu tượng và bảng hiệu Nam Hân nằm trong ảnh xe, kho, đồng phục và hàng hóa. Giữ logo riêng ở đầu/cuối trang. Không thay đổi nội dung doanh nghiệp, route, HTML hoặc CSS.

## Kết quả

- Rà 50 tệp ảnh nội dung, tương ứng 45 ảnh khác nhau; không tính ba tệp logo riêng.
- Chỉnh 32 ảnh khác nhau và cập nhật đủ các bản trùng: tổng cộng 36 tệp trong `public/images/`.
- Giữ nguyên 14 tệp không có thương hiệu Nam Hân nhận diện được và ba tệp logo riêng.
- Dùng công cụ `image_gen` tích hợp để xóa thương hiệu. Chỉ ghép vùng đã chỉnh vào ảnh gốc, cân màu vùng ghép và xuất WebP; giữ nguyên kích thước, tỷ lệ và kênh alpha gốc, kể cả hai ảnh nền có độ trong suốt.
- Giữ bản gốc tại `tmp/imagegen/nam-han-removal/originals/` (thư mục local, được git ignore). Bản gốc của hero trang chủ là tệp đang có trong workspace khi bắt đầu, bao gồm thay đổi chưa commit trước đó.
- Logo `public/images/logo-nam-han.webp` đã có thay đổi từ trước; lần xử lý này không sửa ba tệp logo riêng.

Danh sách từng tệp, kích thước, SHA-256 trước/sau và prompt nền: [manifest](assets/nam-han-photo-cleanup.json). Các ảnh đã chỉnh còn được xuất riêng tại `output/imagegen/nam-han-removal/`.

## Prompt và xử lý ảnh

Mode: **built-in `image_gen`**, không dùng CLI/API key.

Prompt nền yêu cầu xóa mọi biến thể `Nam Hân / Nam Han / NamHan`, biểu tượng N/NH và chữ LOGISTICS đi kèm trên xe, bảng hiệu, áo, mũ và kiện hàng; tái tạo bề mặt trơn phù hợp chất liệu, phối cảnh và ánh sáng; không thêm logo/chữ mới. Mỗi ảnh bổ sung vị trí cần xử lý. Giữ bố cục, người, khuôn mặt, xe, màu sắc và nội dung không liên quan. Prompt nền nguyên văn nằm trong manifest.

Riêng ảnh `home/service-ltl.webp`, lượt cuối yêu cầu xóa toàn bộ nhóm chữ vàng trên sàn có tên Nam Hân, để lại nền bê tông trơn và giữ vạch phân khu; không thêm chữ thay thế như “STAGING”. Chỉ vùng sàn từ lượt này được ghép vào bản cuối.

## Mapping thiết kế và kiểm tra

Các nhóm ảnh thuộc các frame đã có trong `docs/03-FIGMA-PAGE-MAP.md`: trang chủ `44:1195`, giới thiệu `92:731`, dịch vụ `51:575`, đường bộ `84:409`, bốc xếp `84:1080`, giao nhận `84:1720`, giải pháp `84:2283`. Đây là thay đổi ảnh theo yêu cầu người dùng, không dựng section hay thay đổi bố cục Figma.

- Đã xem ảnh gốc, ảnh sau chỉnh và bảng đối chiếu; sửa lại các vùng còn sót và lỗi ghép alpha trong lúc kiểm tra.
- Kiểm tra tự động đủ 36 tệp giữ kích thước và kênh alpha như bản gốc; các bản dùng chung được cập nhật đồng nhất.
- Kiểm tra build, tham chiếu tài nguyên và gói ảnh được ghi nhận sau khi hoàn tất ở cuối tài liệu.
- Không thay đổi trạng thái duyệt responsive/UAT của dự án; không coi kiểm tra tệp ảnh là nghiệm thu giao diện hoặc giọng nói trên thiết bị thật.

Ảnh đã qua tái tạo vùng logo nên bề mặt tại vùng chỉnh có thể khác ảnh gốc. Cần xem bản preview trước khi công bố ảnh đại diện cơ sở/đội xe.

## Kết quả kiểm tra cuối

- `npm run check`: pass, không có lỗi TypeScript/Astro. Có các hint deprecated API sẵn có trong trình biên tập admin.
- `npm run build`: pass. Build vẫn dùng Netlify adapter và các route SSR đã có từ trước; lần xử lý ảnh này không sửa kiến trúc hoặc runtime.
- Kiểm tra 51 tham chiếu ảnh trong mã nguồn: không thiếu tệp.
- Kiểm tra 340 liên kết/tài nguyên nội bộ trong 8 tệp HTML đã build: không thiếu đích theo output và route nguồn hiện có.
- SHA-256 của cả 53 ảnh/logo trong `dist/images/` khớp `public/images/`.
- Gói `output/nam-han-images-cleaned.zip`: 53 ảnh/logo và một manifest; đã đọc lại và xác minh SHA-256 đủ 53 tệp.
- Preview trước/sau: `output/nam-han-brand-cleanup-preview.webp`.
- Không cài thêm dependency, không thay đổi markup/CSS, không deploy.
