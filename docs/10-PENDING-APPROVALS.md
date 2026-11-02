# 10 — Pending Decisions for Business Review

**Không để AI tự phán đoán những mục này.** Kiến trúc Astro đã chốt, nhưng các mục sau có thể ảnh hưởng UX, pháp lý, form data và go-live.

| ID | Mức độ | Câu hỏi cần giải trình | Default an toàn trong Phase 1 |
|---|---|---|---|
| DEC-01 | HIGH | 3 form có được phép gộp thành một bảng lead chung? | Thiết kế chung field contract, chưa POST |
| DEC-02 | BLOCKER | Trong khối “Kiểm tra xe có sẵn”, có API/dữ liệu điều phối thật không? Nếu không, có đồng ý đổi thành "Gửi yêu cầu kiểm tra" và xin số liên hệ? | Không hiển thị kết quả xe thật, demo rõ |
| DEC-03 | HIGH | Voice: chỉ Speech-to-Text hay bắt buộc gửi bản ghi âm? Browser nào phải hỗ trợ? | Propose STT vi-VN có fallback |
| DEC-04 | BLOCKER | Form dữ liệu về email/tài khoản Netlify doanh nghiệp nào; ai có quyền xuất CSV? | Không tự chọn tài khoản cá nhân |
| DEC-05 | BLOCKER | Privacy notice, thời hạn lưu lead, cho phép gửi dữ liệu, quyền xoá/truy cập? | Không thu thập PII thật |
| DEC-06 | HIGH | Ai sẽ duyệt **bản mobile/tablet đã xây từ `docs/11-MOBILE-RESPONSIVE-SPEC.md`** (menu, thứ tự section, crop ảnh, form, CTA) khi chưa có Figma mobile? | **Mobile-first implementation bắt buộc ngay Phase 1**, giữ trạng thái `PROPOSED`; chỉ chặn UAT/go-live khi chưa được duyệt |
| DEC-07 | HIGH | Slugs và cấu trúc URLs có khớp chiến lược SEO doanh nghiệp? | Slugs chỉ là đề xuất |
| DEC-08 | HIGH | 3 bài tin nổi bật liên kết đi đâu; có trang blog/bài viết không? | Không tạo link 404 |
| DEC-09 | HIGH | Các link footer: legal, sitemap, chứng nhận và anchors trỏ đến đâu? | Kiểm kê link thiếu |
| DEC-10 | HIGH | Số liệu đội xe/năng lực, testimonies/ảnh, cam kết "15 phút" đã được duyệt công bố? | Đánh dấu content review |
| DEC-11 | MEDIUM | Email/SĐT địa chỉ cần cập nhật so với Figma không? | Đúng bản Figma, báo chờ xác nhận |
| DEC-12 | MEDIUM | Domain www hay root, ai giữ registrar/DNS? | Chưa gắn domain production |
| DEC-13 | MEDIUM | Có cần nhân viên tự sửa tin tức thường xuyên, dẫn đến CMS? | Static content, cập nhật qua PR |
| DEC-14 | MEDIUM | Khi xuất Excel, CSV là đủ hay bắt buộc file `.xlsx` native / định kỳ? | CSV mở trong Excel |
| DEC-15 | MEDIUM | Expected monthly leads/traffic và ngân sách Netlify Forms có phù hợp quota/retention? | Kiểm tra plan trước ký |
| DEC-16 | MEDIUM | SLA bảo trì, ai kiểm tra hàng tháng, RPO/RTO khi mất lead? | Lịch kiểm tra tối thiểu ở runbook |

## Biểu mẫu ký duyệt
```
Decision ID:
Selected option:
Business approver and role:
Approval date:
Reason and impact:
UX/Figma updates needed:
Implementation phase:
```

## Những gì có thể build ngay
- Hệ thống layout/component của 8 trang **desktop + mobile + tablet**, content hiện có với cờ review, responsive proposal từ `docs/11-MOBILE-RESPONSIVE-SPEC.md`, navigation hợp lệ, trạng thái form demo, SEO stubs, voice browser capability behind flag.
- Chưa build/enable live data submissions, quảng bá cam kết về thời gian phản hồi, tự tạo legal text chính thức, hay bảo đảm real-time dispatch.
