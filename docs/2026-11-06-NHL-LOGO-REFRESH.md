# Thay logo NHL — 06/11/2026

Người dùng cung cấp và yêu cầu thay toàn bộ logo cũ bằng mẫu NHL đỏ/xanh. Yêu cầu này thay thế mẫu logo cũ trong Figma đối với vị trí nhận diện thương hiệu; không đổi tên doanh nghiệp hoặc nội dung giới thiệu.

## Thay đổi

- Đồng bộ ba tệp `public/images/logo-nam-han.webp`, `logo-nam-han-wide.webp`, `logo-nam-han.png` từ cùng ảnh người dùng gửi. Chỉ bỏ khoảng trắng dư và chuyển định dạng; không vẽ lại hoặc sinh lại logo bằng AI.
- Hai đuôi tệp ban đầu không khớp định dạng thực (JPEG trong `.webp`, WebP trong `.png`); các bản mới đã có định dạng đúng với đuôi tệp.
- Header và footer dùng chung `src/content/brand.ts`; alt mô tả logo NHL, kích thước nội tại 991 × 392 và tỷ lệ được giữ đúng. Header hiển thị cao 44px, footer rộng 132px trong ô trắng.
- Thay favicon SVG cũ bằng phiên bản chứa đúng logo NHL và thêm PNG 64 × 64 dự phòng. Tham chiếu logo/favicon có phiên bản cache `nhl-20261106`.
- Ảnh gốc người dùng gửi được lưu local ở `tmp/logo-refresh/logo-nhl-original.jpg`.

Mapping cũ: header `44:1554`, footer `102:3354` trong `docs/03-FIGMA-PAGE-MAP.md`. Không thêm section, route hoặc dependency. Các ảnh xe/kho đã xóa thương hiệu ở lượt trước không bị sửa trong lượt này. Manifest xóa thương hiệu trước đó là bản ghi lịch sử; SHA của ba tệp logo đã được thay bởi lượt cập nhật này.

## Kiểm tra

- `npm run check`: pass, 0 lỗi, 0 warning, 3 hint deprecated API có sẵn ở admin editor.
- `npm run build`: pass; giữ cấu hình Netlify/SSR có sẵn.
- Kiểm tra logo và favicon trong cả 8 HTML được prerender; có đủ hai logo mới và liên kết favicon mới. Hash ảnh ở `dist/` khớp `public/`, định dạng tệp đúng.
- Browser kiểm tra component chung trên `/ve-nam-han/` ở 320, 360, 375, 390, 430, 768, 1024, 1280, 1440px: cả hai logo tải được và không có tràn ngang tài liệu.
- Đã xem header desktop/mobile, footer desktop/mobile; menu mở được ở 375px và đóng được bằng Escape.
- Bản build tĩnh phục vụ kiểm tra trên localhost được dùng sau khi Netlify dev preview bị treo. Không sửa cấu hình production để xử lý lỗi preview.
- Ảnh chứng cứ: `output/logo-refresh/header-*.jpg`, `mobile-footer-375.jpg`, `desktop-footer-1280.jpg`.
- Gói logo mới: `output/logo-refresh/logo-nhl-assets.zip`; manifest: `output/logo-refresh/manifest.json`.

Đây là kiểm tra thay logo, không thay đổi trạng thái duyệt responsive/UAT của toàn dự án. Chưa deploy.
