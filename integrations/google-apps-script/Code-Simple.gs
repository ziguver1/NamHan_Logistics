/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT SIÊU RÚT GỌN (CHO BÊN THỨ 3 / THIẾT LẬP NHANH 1 PHÚT)
 * ==============================================================================
 * Cách dùng:
 * 1. Mở bất kỳ Google Sheet nào -> Tiện ích mở rộng (Extensions) -> Apps Script.
 * 2. Dán đoạn code này vào -> Bấm "Triển khai" (Deploy) -> "Triển khai mới" (New deployment).
 * 3. Loại: "Ứng dụng web" (Web app).
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone).
 * 4. Bấm "Triển khai" -> Copy link Web App kết thúc bằng "/exec".
 * 5. Thêm vào .env hoặc Vercel:
 *    GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
 *
 * Xong! Web tự động ghi dữ liệu vào Sheet mà không cần cấu hình gì thêm.
 * ==============================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Nếu bảng chưa có dòng tiêu đề, tự tạo tiêu đề cột ở dòng 1
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Thời gian',
        'Mã yêu cầu',
        'Loại khách',
        'Tên công ty / Họ tên',
        'Số điện thoại / Zalo',
        'Điểm đi',
        'Điểm đến',
        'Mô tả hàng hóa',
        'Khối lượng / Số lượng',
        'Ghi chú',
        'Nguồn gửi'
      ]);
      // Định dạng dòng tiêu đề
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setBackground('#0B2545');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Nếu web gửi lệnh ping kiểm tra kết nối
    if (data.action === 'ping') {
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        code: 'PONG',
        message: 'Kết nối Google Sheets thành công!'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ghi 1 dòng dữ liệu mới
    sheet.appendRow([
      data.createdAt || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      data.requestId || '',
      data.customerType === 'business' ? 'Doanh nghiệp' : 'Cá nhân',
      data.clientName || '',
      data.contactPhone || '',
      data.pickupLocation || '',
      data.deliveryLocation || '',
      data.cargoDescription || '',
      data.cargoWeight || '',
      data.notes || '',
      data.sourceUrl || '/lien-he/'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      ok: true,
      message: 'Đã nhận yêu cầu thành công'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      ok: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
