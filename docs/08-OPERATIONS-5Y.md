# 08 — Deployment, Handover & 4–5 Year Low-Maintenance Plan

## 1. Phân biệt web tĩnh và dịch vụ sống
HTML/CSS/JS đã build **không tự hỏng** chỉ vì Astro có bản mới. Tuy nhiên các yếu tố bên ngoài vẫn thay đổi: domain/DNS, TLS, Netlify pricing/quota, form processing, browser compatibility voice, chính sách bảo mật, pháp lý. Không hứa tuyệt đối "làm một lần không bảo trì 5 năm".

## 2. Production topology
- Hosting: Netlify static hosting (đề xuất do dùng Netlify Forms).
- Git: GitHub repo doanh nghiệp, branch protected `main`, PR review cho mọi thay đổi; giữ ít nhất 1 copy offline export.
- Build: `npm ci && npm run check && npm run build`; publish `dist`.
- Domain: doanh nghiệp sở hữu, auto-renew + backup admin, DNS/tên miền có invoice; one canonical `www` or apex và redirect 301 nhất quán.
- TLS: managed HTTPS và verify renewal/chứng chỉ; force HTTPS.
- Headers: X-Content-Type-Options, Referrer-Policy, permissions restrictions (microphone only where needed), conservative CSP sau khi test voice/form/asset; tránh đặt CSP sai làm gãy feature.
- Preview: noindex, không có dữ liệu khách thật. Production chỉ deploy từ release đã duyệt.

## 3. Version policy
- Khi bootstrap, xác nhận bản Astro stable và phiên bản Node LTS hỗ trợ, rồi ghi `.nvmrc`, `engines`, lockfile; không tự động đổi major.
- `npm ci` để tái lập dependency tree. Nhớ rằng lockfile không đóng băng hạ tầng CDN/toolchain nhà cung cấp, nên lưu bản `dist/` và metadata release.
- Đến cuối hỗ trợ Node, cần chuyển build environment sang bản LTS khác nếu phải rebuild. Theo thông báo lịch Node ngày 25/10/2026, Node 26 LTS dự kiến EOL tháng 04/2029. Cập nhật trước mốc đó nếu chọn Node 26.
- Không auto-merge dependency/security upgrades thẳng production. Review PR, build, tests rồi deploy; theo dõi advisories có tác động đến build/tooling.
- Ít nhất **mỗi năm thử clean-room rebuild** trên môi trường được hỗ trợ để không phụ thuộc máy lập trình viên cũ.

## 4. Routine runbook (đề xuất trách nhiệm doanh nghiệp)
| Cadence | Kiểm tra | Owner |
|---|---|---|
| Hằng tuần hoặc ít nhất hằng tháng | Gửi một yêu cầu form thử, xác nhận dashboard nhận, thông báo, dữ liệu CSV; xoá dữ liệu test | Nhân viên được giao |
| Hằng tháng | Kiểm tra site/home/contact, HTTPS, 404, giá/quota, hạn domain, log availability | Owner vận hành |
| Hằng quý | Export/backup lead theo retention policy, kiểm soát quyền, audit link, mobile browser phổ biến | Owner vận hành |
| Mỗi 6 tháng | Test voice, form, **iOS Safari + Android Chrome** và các browser được hỗ trợ; review vendor changes và bảo mật | Technical owner |
| Hằng năm | Thử build sạch và redeploy preview, kiểm thử rollback, soát dependency và Node LTS | Technical owner |
| Trước khi runtime hết hỗ trợ | Upgrade Node/Astro có kiểm thử nếu cần rebuild, không nâng bừa | Technical owner |

Tần suất có thể giảm theo SLA hợp đồng nhưng **không loại bỏ hoàn toàn** kiểm tra form: vì đây là kênh kinh doanh chính của website.

## 5. Backups & disaster recovery
Bàn giao và lưu ở tài khoản doanh nghiệp:
- Git repo và release tag (`v1.0.0`), commit hash.
- Khoá phiên bản Node, `package-lock.json`, `package.json`, CI config, `netlify.toml`.
- `dist/` bản deploy cuối cùng dưới dạng archive có checksum SHA-256.
- Figma link, danh sách ảnh/giấy phép sử dụng, nội dung được duyệt, **responsive screenshots/review records của đủ 8 trang và device QA results**.
- Domain registrar + DNS record inventory + hướng dẫn bật lại DNS.
- Netlify site/team owner, Forms admin access, form name và dữ liệu export theo chính sách.
- Tài liệu restore: deploy archived `dist` lên static hosting -> test 8 routes -> cấu hình domain/HTTPS -> nếu chuyển provider, cấu hình lại form adapter -> test submission/export.

**RPO/RTO:** chưa chốt; không đưa con số vô căn cứ. Cần hỏi doanh nghiệp mức chấp nhận mất dữ liệu và thời gian khôi phục. Nội dung static có thể restore từ archive; lead data phải backup/export riêng.

## 6. Owner & account policy
- Không dùng tài khoản Netlify, Figma, domain hoặc GitHub cá nhân của developer làm owner duy nhất.
- Ít nhất 2 tài khoản quản trị được phê duyệt, 2FA, recovery codes offline.
- Hướng dẫn doanh nghiệp: cập nhật nội dung tĩnh cần developer/build mới; form dashboard không phải CMS.
- Không lưu mật khẩu/secret trong repo hoặc file bàn giao công khai.

## 7. Sự cố thường gặp và xử lý
| Triệu chứng | Kiểm tra | Khắc phục |
|---|---|---|
| Website không mở | domain expiry, DNS, Netlify outage, TLS | theo domain/DNS inventory, revert DNS nếu có thủ tục |
| Form không nhận | Netlify form detection, form-name, quota, spam tab | test site deploy, check blueprint HTML, redeploy |
| Có khách nhập nhưng không email | notification setting, email spam, dashboard submissions | dashboard là source of truth; sửa notification, không mất lead nếu đã lưu |
| Excel lỗi tiếng Việt | import encoding | Import CSV với UTF-8 trong Excel |
| Voice không chạy | permission/browser/device/HTTPS | fallback nhập tay; review compatibility, không chặn form |
| Build từ source lỗi sau vài năm | Node EOL/dependencies/toolchain | dùng archived `dist` để phục vụ site; tái lập env và nâng version có test |

## 8. Budget/plan policy
- Không mặc định gói Netlify Forms miễn phí đáp ứng số lượng leads/traffic; kiểm tra giá/quota và retention tại ngày hợp đồng.
- Bảo trì ở mức thấp **không có nghĩa zero-cost hoặc zero-responsibility**.

Reference:
- https://docs.astro.build/en/guides/deploy/netlify/
- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/submissions/
- https://nodejs.org/en/blog/announcements/evolving-the-nodejs-release-schedule
