/**
 * ==============================================================================
 * DỰ ÁN NAM HÂN LOGISTICS — GOOGLE APPS SCRIPT WEB APP & SPREADSHEET AUTOMATION
 * ==============================================================================
 * Kịch bản tự động hóa tiếp nhận dữ liệu form liên hệ và định dạng bảng tính.
 * Đính kèm trực tiếp vào Google Sheets (Container-bound Script).
 * 
 * Tác giả: Đội ngũ Kỹ thuật Nam Hân Logistics
 * Phiên bản: 1.1.0 — UI upgrade
 * Múi giờ: Asia/Ho_Chi_Minh (UTC+7)
 * ==============================================================================
 */

// Tên trang tính mặc định tiếp nhận dữ liệu
var TARGET_SHEET_NAME = 'Yêu cầu vận chuyển';

// Danh sách 13 cột chuẩn hóa theo thiết kế hệ thống
var COLUMN_SCHEMA = [
  { name: 'Mã yêu cầu', width: 155, format: '@', wrap: false, align: 'center' },
  { name: 'Thời gian tiếp nhận', width: 160, format: '@', wrap: false, align: 'center' },
  { name: 'Loại khách hàng', width: 135, format: '@', wrap: false, align: 'center' },
  { name: 'Tên công ty / Họ tên', width: 220, format: '@', wrap: true, align: 'left' },
  { name: 'Số điện thoại / Zalo', width: 145, format: '@', wrap: false, align: 'center' },
  { name: 'Điểm đi', width: 185, format: '@', wrap: true, align: 'left' },
  { name: 'Điểm đến', width: 185, format: '@', wrap: true, align: 'left' },
  { name: 'Mô tả hàng hóa', width: 260, format: '@', wrap: true, align: 'left' },
  { name: 'Khối lượng / Số lượng', width: 145, format: '@', wrap: false, align: 'left' },
  { name: 'Nguồn form', width: 130, format: '@', wrap: false, align: 'center' },
  { name: 'Trạng thái xử lý', width: 150, format: '@', wrap: false, align: 'center', hasDropdown: true },
  { name: 'Người phụ trách', width: 140, format: '@', wrap: false, align: 'left' },
  { name: 'Ghi chú', width: 220, format: '@', wrap: true, align: 'left' }
];

// Danh sách trạng thái chuẩn hóa
var STATUS_OPTIONS = ['Mới nhận', 'Đang tư vấn', 'Đã chốt', 'Không tiếp tục'];

// Màu sắc thương hiệu theo tokens dự án Nam Hân Logistics
var BRAND_NAVY_BG = '#0B2545';
var BRAND_TEXT_WHITE = '#FFFFFF';
var BORDER_COLOR = '#CBD5E1';

/**
 * Tạo Menu 'Nam Hân' khi mở bảng tính Google Sheets.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚛 Nam Hân')
    .addItem('⚙️ Khởi tạo / Kiểm tra cấu trúc bảng', 'initializeSheetStructure')
    .addItem('✨ Tối ưu chiều cao & Làm đẹp bảng', 'refreshSheetUI')
    .addItem('🔑 Kiểm tra cấu hình & Khóa kết nối', 'checkConfiguration')
    .addSeparator()
    .addItem('📖 Xem hướng dẫn kết nối Website', 'showConnectionInstructions')
    .addToUi();
}

/**
 * Sinh chuỗi khóa kết nối ngẫu nhiên bảo mật (Cryptographic Token).
 */
function generateSecureToken(length) {
  var bytes = [];
  for (var i = 0; i < (length || 32); i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  var raw = Utilities.base64EncodeWebSafe(bytes).replace(/[^a-zA-Z0-9]/g, '');
  return 'nhl_sec_' + raw.slice(0, length || 32);
}

/**
 * 1. KHỞI TẠO VÀ ĐỊNH DẠNG BẢNG TÍNH AN TOÀN (IDEMPOTENT)
 * Không xóa dữ liệu cũ, không tạo trùng quy tắc định dạng.
 */
// UI v2 — Giữ tiêu đề hàng 1 và thứ tự A:M để tương thích endpoint cũ.
// Cài đặt: thay code trong CÙNG dự án Apps Script, lưu, tải lại Sheet,
// chọn Nam Hân → Làm đẹp bảng hiện tại. Sau đó cập nhật deployment sang phiên bản mới.
// Không đổi Script Properties, khóa kết nối hoặc URL deployment đang dùng.
function assertNhlHeaders_(sheet) {
  var headers = sheet.getRange(1, 1, 1, COLUMN_SCHEMA.length).getDisplayValues()[0];
  COLUMN_SCHEMA.forEach(function(col, i) {
    var val = headers[i] ? String(headers[i]).trim() : '';
    if (!val) {
      sheet.getRange(1, i + 1).setValue(col.name);
    }
  });
}

function initializeSheetStructure() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var sheet = ss.getSheetByName(TARGET_SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(TARGET_SHEET_NAME, 0);
    if (sheet.getLastRow() === 0 && sheet.getLastColumn() === 0) {
      if (sheet.getMaxColumns() < 13) sheet.insertColumnsAfter(sheet.getMaxColumns(), 13 - sheet.getMaxColumns());
      sheet.getRange(1, 1, 1, 13).setValues([COLUMN_SCHEMA.map(function(c) { return c.name; })]);
    }
    assertNhlHeaders_(sheet);
    var props = PropertiesService.getScriptProperties();
    var linkedId = props.getProperty('SPREADSHEET_ID');
    if (linkedId && linkedId !== ss.getId()) throw new Error('Script đang liên kết bảng khác. Không tự đổi kết nối.');
    props.setProperty('SPREADSHEET_ID', ss.getId());
    if (!props.getProperty('CONNECTION_KEY')) props.setProperty('CONNECTION_KEY', generateSecureToken(32));
    ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');
    applyNhlSheetUI_(sheet);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  SpreadsheetApp.getUi().alert('Đã khởi tạo và định dạng bảng. Dữ liệu cũ và khóa đã có được giữ nguyên. Xem menu Kiểm tra cấu hình để lấy thông tin kết nối.');
}

// Chỉ làm đẹp bảng đã có; không thay đổi giá trị, công thức hay cấu hình kết nối.
function refreshSheetUI() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var sheet = ss.getSheetByName(TARGET_SHEET_NAME);
    if (!sheet) throw new Error('Chưa có tab ' + TARGET_SHEET_NAME + '. Hãy khởi tạo trước.');
    assertNhlHeaders_(sheet);
    applyNhlSheetUI_(sheet);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  ss.toast('Đã cập nhật giao diện & nâng chiều cao các dòng; dữ liệu được giữ nguyên.', 'Nam Hân', 6);
}

function applyNhlSheetUI_(sheet) {
  // Giữ cỡ chữ đọc được, chấp nhận cuộn ngang thay vì ép 13 cột vào màn hình.
  var widths = [205, 180, 145, 245, 175, 200, 200, 310, 170, 145, 175, 180, 300];
  widths.forEach(function(width, i) { sheet.setColumnWidth(i + 1, width); });
  sheet.setHiddenGridlines(false);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
  sheet.setTabColor(BRAND_NAVY_BG);
  var header = sheet.getRange(1, 1, 1, 13);
  header.setFontFamily('Arial').setFontSize(11).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground(BRAND_NAVY_BG)
    .setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setBorder(false, false, true, false, false, false, '#38BDF8', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sheet.setRowHeight(1, 46);
  var last = Math.max(sheet.getLastRow(), 2);
  var bodyEnd = Math.min(sheet.getMaxRows(), last + 20);
  if (bodyEnd >= 2) formatNhlRows_(sheet, 2, bodyEnd - 1);
  updateNhlRules_(sheet);
  ensureNhlFilter_(sheet);
  // Đảm bảo tất cả các dòng dữ liệu có chiều cao tối thiểu 42px
  if (last >= 2) resizeNhlRows_(sheet, 2, last - 1);
}

function formatNhlRows_(sheet, startRow, count) {
  if (count < 1) return;
  var range = sheet.getRange(startRow, 1, count, 13);
  range.setFontFamily('Arial').setFontSize(10.5).setFontWeight('normal')
    .setFontColor('#24374D').setBackground('#FFFFFF')
    .setVerticalAlignment('middle').setHorizontalAlignment('left')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setBorder(null, null, true, null, false, true, '#E2E8F0', SpreadsheetApp.BorderStyle.SOLID);
  // Định dạng các cột căn giữa và số điện thoại
  sheet.getRange(startRow, 1, count, 1).setNumberFormat('@').setFontSize(10).setFontColor('#64748B').setHorizontalAlignment('center');
  sheet.getRange(startRow, 2, count, 1).setFontSize(10).setFontColor('#64748B').setHorizontalAlignment('center');
  sheet.getRange(startRow, 3, count, 1).setHorizontalAlignment('center');
  sheet.getRange(startRow, 4, count, 1).setFontWeight('bold').setFontColor('#0B2545');
  sheet.getRange(startRow, 5, count, 1).setNumberFormat('@').setFontWeight('bold').setFontColor('#0B2545').setHorizontalAlignment('center');
  sheet.getRange(startRow, 10, count, 1).setFontSize(10).setFontColor('#64748B').setHorizontalAlignment('center');
  sheet.getRange(startRow, 11, count, 1).setHorizontalAlignment('center').setFontWeight('bold')
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUS_OPTIONS, true)
      .setAllowInvalid(false).setHelpText('Chọn trạng thái xử lý yêu cầu.').build());
  // Đặt chiều cao dòng 42px
  sheet.setRowHeights(startRow, count, 42);
}

function resizeNhlRows_(sheet, startRow, count) {
  if (count < 1) return;
  SpreadsheetApp.flush();
  sheet.autoResizeRows(startRow, count);
  for (var i = startRow; i < startRow + count; i++) {
    if (sheet.getRowHeight(i) < 42) sheet.setRowHeight(i, 42);
  }
}

function updateNhlRules_(sheet) {
  var end = sheet.getMaxRows();
  if (end < 2) return;
  var statusRange = sheet.getRange(2, 11, end - 1, 1);
  // Chỉ thay rule do UI v2 sở hữu. Giữ các rule thủ công và rule v1.
  var kept = sheet.getConditionalFormatRules().filter(function(rule) {
    var condition = rule.getBooleanCondition();
    if (!condition) return true;
    return !condition.getCriteriaValues().some(function(v) { return String(v).indexOf('NHL_UI_V2:') >= 0; });
  });
  var rules = [];
  var colors = [ ['#DBEAFE', '#1D4ED8'], ['#FEF3C7', '#92400E'], ['#DCFCE7', '#166534'], ['#F1F5F9', '#64748B'] ];
  STATUS_OPTIONS.forEach(function(status, i) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($K2="' + status + '",N("NHL_UI_V2:status' + i + '")=0)')
      .setBackground(colors[i][0]).setFontColor(colors[i][1]).setBold(true).setRanges([statusRange]).build());
  });
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($A2<>"",N("NHL_UI_V2:staff")=0)')
    .setBackground('#F0FDFA').setRanges([sheet.getRange(2, 12, end - 1, 2)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($A2<>"",MOD(ROW(),2)=1,N("NHL_UI_V2:zebra")=0)')
    .setBackground('#F3F7FC').setRanges([sheet.getRange(2, 1, end - 1, 10)]).build());
  sheet.setConditionalFormatRules(rules.concat(kept));
}

function ensureNhlFilter_(sheet) {
  var filter = sheet.getFilter();
  var end = sheet.getMaxRows();
  if (filter) {
    var old = filter.getRange();
    if (old.getRow() !== 1 || old.getColumn() !== 1 || old.getNumColumns() !== 13) {
      throw new Error('Bộ lọc hiện tại khác vùng A:M. Hãy kiểm tra trước khi thay đổi.');
    }
    if (old.getNumRows() === end) return;
    // Giữ điều kiện lọc của nhân viên khi mở rộng vùng đến các dòng mới.
    var criteria = [];
    for (var c = 1; c <= 13; c++) criteria.push(filter.getColumnFilterCriteria(c));
    filter.remove();
    filter = sheet.getRange(1, 1, end, 13).createFilter();
    criteria.forEach(function(criterion, i) { if (criterion) filter.setColumnFilterCriteria(i + 1, criterion); });
  } else {
    sheet.getRange(1, 1, end, 13).createFilter();
  }
}

/**
 * 2. KIỂM TRA CẤU HÌNH & HIỂN THỊ THÔNG TIN KẾT NỐI
 */
function checkConfiguration() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var ssId = props.getProperty('SPREADSHEET_ID') || ss.getId();
  var apiKey = props.getProperty('CONNECTION_KEY');

  if (!apiKey) {
    ui.alert(
      'Chưa hoàn tất khởi tạo',
      'Bảng tính chưa được tạo khóa kết nối. Vui lòng chọn menu: "Nam Hân" -> "Khởi tạo / Kiểm tra cấu trúc bảng".',
      ui.ButtonSet.OK
    );
    return;
  }

  var msg = 'THÔNG TIN KẾT NỐI NAM HÂN LOGISTICS\n\n' +
    '• ID Bảng tính: ' + ssId + '\n' +
    '• Tên Bảng tính: ' + ss.getName() + '\n' +
    '• Khóa kết nối (API Key):\n' + apiKey + '\n\n' +
    'LƯU Ý QUAN TRỌNG KHI TRIỂN KHAI:\n' +
    '1. Vào Triển khai -> Bản triển khai mới -> Ứng dụng web (Web App).\n' +
    '2. "Thực thi dưới dạng": Chọn "Tôi" (Tài khoản của bạn).\n' +
    '3. "Ai có quyền truy cập": Chọn "Bất kỳ ai" (Anyone).\n' +
    '4. Copy URL Web App dạng .../exec và Khóa kết nối này dán vào trang Quản trị website.';

  ui.alert('Thông tin cấu hình', msg, ui.ButtonSet.OK);
}

/**
 * 3. HƯỚNG DẪN BÀN GIAO & KẾT NỐI WEBSITE
 */
function showConnectionInstructions() {
  var ui = SpreadsheetApp.getUi();
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 10px;">' +
      '<h2 style="color: #0b2545; margin-top: 0;">Hướng dẫn kết nối Google Sheets với Website</h2>' +
      '<p>Phương án Google Apps Script giúp website Nam Hân Logistics tiếp nhận form liên hệ trực tiếp mà <strong>không cần cấu hình Google Cloud Console hay OAuth Client ID</strong>.</p>' +
      '<ol style="padding-left: 20px;">' +
        '<li><strong>Bước 1:</strong> Bấm menu <em>"Nam Hân" &rarr; "Khởi tạo / Kiểm tra cấu trúc bảng"</em> để thiết lập tab, cột và sinh Khóa kết nối.</li>' +
        '<li><strong>Bước 2:</strong> Ở góc trên bên phải màn hình Apps Script, bấm <strong>Triển khai (Deploy)</strong> &rarr; <strong>Bản triển khai mới</strong>.</li>' +
        '<li><strong>Bước 3:</strong> Chọn loại <strong>Ứng dụng web (Web App)</strong>:' +
          '<ul>' +
            '<li>Mô tả: <em>Nam Hân Form Receiver v1</em></li>' +
            '<li>Thực thi dưới dạng: <strong>Tôi (Tài khoản hiện tại)</strong></li>' +
            '<li>Ai có quyền truy cập: <strong>Bất kỳ ai (Anyone)</strong> (để server website có thể gửi dữ liệu, bảo mật bằng Khóa bí mật).</li>' +
          '</ul>' +
        '</li>' +
        '<li><strong>Bước 4:</strong> Bấm <strong>Triển khai</strong> &rarr; Cấp quyền truy cập nếu Google yêu cầu &rarr; Sao chép <strong>URL ứng dụng web</strong> (kết thúc bằng <code>/exec</code>).</li>' +
        '<li><strong>Bước 5:</strong> Mở trang Quản trị website Nam Hân (<code>/admin/google-sheets</code>), nhập URL ứng dụng web và Khóa kết nối, bấm <strong>Kiểm tra kết nối</strong> và <strong>Kích hoạt</strong>.</li>' +
      '</ol>' +
      '<p style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 8px 12px; font-size: 13px;">' +
        '✅ <strong>An toàn dữ liệu:</strong> Mỗi lần bấm gửi form chỉ được lưu qua một phương án duy nhất, có cơ chế chống gửi trùng bằng Request ID và chống tấn công Formula Injection.' +
      '</p>' +
    '</div>'
  ).setWidth(520).setHeight(460);

  ui.showModalDialog(html, 'Hướng dẫn kết nối');
}

/**
 * ==============================================================================
 * 4. WEB APP ENDPOINT (doPost): TIẾP NHẬN DỮ LIỆU TỪ MÁY CHỦ WEBSITE
 * ==============================================================================
 */

/**
 * Xử lý phòng chống tấn công Formula / CSV Injection.
 * Nếu ký tự đầu là =, +, -, @ hoặc ký tự điều khiển, chèn dấu nháy đơn ' phía trước.
 */
function sanitizeCellValue(val, isPhone) {
  if (val === null || val === undefined) return '';
  var str = String(val).trim();

  if (isPhone) {
    // Luôn bắt đầu bằng dấu nháy đơn để Google Sheets hiểu là chuỗi văn bản thuần túy (giữ số 0)
    var cleanedPhone = str.replace(/[^\d+ \-().]/g, '');
    return "'" + cleanedPhone;
  }

  // Chống Formula Injection: =, +, -, @, Tab, Carriage Return
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }

  return str;
}

/**
 * Tạo phản hồi JSON chuẩn hóa.
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Hàm tiếp nhận yêu cầu POST từ máy chủ website.
 */
function doPost(e) {
  var props = PropertiesService.getScriptProperties();

  // 1. Kiểm tra payload
  if (!e || !e.postData || !e.postData.contents) {
    return createJsonResponse({
      ok: false,
      code: 'EMPTY_PAYLOAD',
      message: 'Không tìm thấy dữ liệu yêu cầu.'
    });
  }

  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return createJsonResponse({
      ok: false,
      code: 'INVALID_JSON',
      message: 'Dữ liệu yêu cầu không đúng định dạng JSON hợp lệ.'
    });
  }

  // 2. Xác thực khóa kết nối bí mật (Connection Key)
  var configuredKey = String(props.getProperty('CONNECTION_KEY') || '').trim();
  if (!configuredKey) {
    return createJsonResponse({
      ok: false,
      code: 'UNCONFIGURED',
      message: 'Google Apps Script chưa được khởi tạo. Vui lòng mở Google Sheets bấm menu "Nam Hân" -> "Khởi tạo".'
    });
  }

  var providedKey = String(payload.connectionKey || payload.apiKey || '').trim();
  if (!providedKey || providedKey !== configuredKey) {
    return createJsonResponse({
      ok: false,
      code: 'UNAUTHORIZED',
      message: 'Khóa kết nối bí mật không chính xác hoặc đã bị thay đổi.'
    });
  }

  // 3. Xử lý thao tác kiểm tra kết nối (Ping / Test Connection)
  if (payload.action === 'ping' || payload.action === 'test') {
    var ssId = props.getProperty('SPREADSHEET_ID');
    var ss = ssId ? SpreadsheetApp.openById(ssId) : SpreadsheetApp.getActiveSpreadsheet();
    return createJsonResponse({
      ok: true,
      code: 'PONG',
      message: 'Kết nối thành công tới Google Apps Script Nam Hân Logistics!',
      sheetTitle: ss.getName(),
      spreadsheetId: ss.getId(),
      targetTab: TARGET_SHEET_NAME
    });
  }

  // 4. Kiểm tra các trường dữ liệu bắt buộc (Schema Validation)
  var requestId = String(payload.requestId || '').trim();
  var clientName = String(payload.clientName || '').trim();
  var contactPhone = String(payload.contactPhone || '').trim();
  var pickupLocation = String(payload.pickupLocation || '').trim();
  var deliveryLocation = String(payload.deliveryLocation || '').trim();
  var cargoDescription = String(payload.cargoDescription || '').trim();
  var cargoWeight = String(payload.cargoWeight || '').trim();
  var notes = String(payload.notes || payload.ghiChu || '').trim();
  var customerType = payload.customerType === 'individual' ? 'Cá nhân' : 'Doanh nghiệp';
  var sourceUrl = String(payload.sourceUrl || '/lien-he/').trim();

  if (!requestId || requestId.length > 50) {
    return createJsonResponse({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Mã yêu cầu (requestId) không hợp lệ.'
    });
  }

  if (!clientName || clientName.length > 150) {
    return createJsonResponse({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Tên khách hàng / doanh nghiệp không được để trống và tối đa 150 ký tự.'
    });
  }

  var phoneDigits = contactPhone.replace(/\D/g, '');
  if (!contactPhone || phoneDigits.length < 9 || phoneDigits.length > 15) {
    return createJsonResponse({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Số điện thoại không hợp lệ (từ 9 đến 15 chữ số).'
    });
  }

  if (!pickupLocation || !deliveryLocation) {
    return createJsonResponse({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Địa điểm lấy hàng và giao hàng không được để trống.'
    });
  }

  if (!cargoDescription || cargoDescription.length > 1500) {
    return createJsonResponse({
      ok: false,
      code: 'VALIDATION_ERROR',
      message: 'Mô tả hàng hóa không được để trống và tối đa 1500 ký tự.'
    });
  }

  // 5. Khóa Concurrency (LockService) để bảo vệ chống trùng lặp dòng khi có nhiều yêu cầu đồng thời
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(25000); // Đợi tối đa 25 giây
  if (!hasLock) {
    return createJsonResponse({
      ok: false,
      code: 'LOCK_TIMEOUT',
      message: 'Hệ thống đang bận xử lý yêu cầu đồng thời. Vui lòng thử lại sau giây lát.'
    });
  }

  try {
    // Mở bảng tính theo ID cố định đã lưu trong Script Properties
    var targetSpreadsheetId = props.getProperty('SPREADSHEET_ID');
    var targetSs = targetSpreadsheetId
      ? SpreadsheetApp.openById(targetSpreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    var sheet = targetSs.getSheetByName(TARGET_SHEET_NAME);
    if (!sheet) {
      return createJsonResponse({
        ok: false,
        code: 'SHEET_NOT_FOUND',
        message: 'Không tìm thấy trang tính "' + TARGET_SHEET_NAME + '" trong Google Sheets.'
      });
    }

    assertNhlHeaders_(sheet);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    // 6. Kiểm tra xem Request ID đã tồn tại trong dữ liệu bền vững hay chưa (Deduplication)
    if (lastRow > 1) {
      var idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var r = 0; r < idValues.length; r++) {
        var existingId = String(idValues[r][0]).replace(/^['\s]+/, '').trim();
        if (existingId === requestId) {
          // Kiểm tra xem dữ liệu có khớp không để phát hiện xung đột
          var existingRowValues = sheet.getRange(r + 2, 1, 1, Math.min(lastCol, 13)).getValues()[0];
          var existingPhoneClean = String(existingRowValues[4]).replace(/['\s]/g, '');
          var newPhoneClean = contactPhone.replace(/['\s]/g, '');

          if (existingPhoneClean && newPhoneClean && existingPhoneClean !== newPhoneClean) {
            return createJsonResponse({
              ok: false,
              code: 'DUPLICATE_CONFLICT',
              message: 'Trùng mã yêu cầu nhưng dữ liệu khách hàng không khớp với bản ghi đã có.'
            });
          }

          // Trùng mã nhưng payload khớp -> Chấp nhận Idempotent (không ghi thêm dòng mới, không ghi đè)
          return createJsonResponse({
            ok: true,
            code: 'DUPLICATE_ACCEPTED',
            requestId: requestId,
            message: 'Yêu cầu của bạn đã được ghi nhận trước đó.'
          });
        }
      }
    }

    // 7. Ánh xạ vị trí cột theo Tên tiêu đề hàng 1 (Column-name mapping, không phụ thuộc mù quáng vào thứ tự)
    if (lastCol < 1) {
      return createJsonResponse({
        ok: false,
        code: 'UNINITIALIZED_SHEET',
        message: 'Trang tính chưa có hàng tiêu đề. Vui lòng bấm menu "Nam Hân" -> "Khởi tạo" trước khi tiếp nhận.'
      });
    }

    var headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var colMap = {};
    for (var h = 0; h < headerRow.length; h++) {
      var colTitle = String(headerRow[h]).trim();
      if (colTitle) {
        colMap[colTitle] = h; // Lưu chỉ số index (0-based)
      }
    }

    // Thời gian tiếp nhận chuẩn giờ Việt Nam (Asia/Ho_Chi_Minh)
    var vnTimeString = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');

    // Tạo mảng dữ liệu mới cho dòng
    var newRow = new Array(headerRow.length);
    for (var k = 0; k < newRow.length; k++) {
      newRow[k] = '';
    }

    // Gán dữ liệu với lọc chống Formula Injection
    function setMappedVal(headerName, value, isPhone) {
      if (colMap.hasOwnProperty(headerName)) {
        newRow[colMap[headerName]] = sanitizeCellValue(value, isPhone);
      }
    }

    setMappedVal('Mã yêu cầu', requestId, false);
    setMappedVal('Thời gian tiếp nhận', vnTimeString, false);
    setMappedVal('Loại khách hàng', customerType, false);
    setMappedVal('Tên công ty / Họ tên', clientName, false);
    setMappedVal('Số điện thoại / Zalo', contactPhone, true);
    setMappedVal('Điểm đi', pickupLocation, false);
    setMappedVal('Điểm đến', deliveryLocation, false);
    setMappedVal('Mô tả hàng hóa', cargoDescription, false);
    setMappedVal('Khối lượng / Số lượng', cargoWeight, false);
    setMappedVal('Nguồn form', sourceUrl, false);
    setMappedVal('Trạng thái xử lý', 'Mới nhận', false); // Hệ thống tự gán, không tin cậy dữ liệu client
    setMappedVal('Người phụ trách', '', false);          // Dành cho nhân sự Nam Hân cập nhật trong Sheet
    setMappedVal('Ghi chú', notes, false);               // Ghi chú từ khách hàng (đồng bộ từ form liên hệ)

    // 8. Ghi dòng dữ liệu mới vào bảng tính
    var nextRow = sheet.getLastRow() + 1;
    if (nextRow > sheet.getMaxRows()) {
      sheet.insertRowsAfter(sheet.getMaxRows(), 20);
      updateNhlRules_(sheet);
    }
    ensureNhlFilter_(sheet);
    // Định dạng TRƯỚC khi ghi: mọi dòng mới đều có font, wrap, dropdown.
    formatNhlRows_(sheet, nextRow, 1);
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    // Tự động nâng chiều cao dòng (tối thiểu 42px) và căn giữa theo chiều dọc
    sheet.setRowHeight(nextRow, 42);
    try { resizeNhlRows_(sheet, nextRow, 1); } catch (layoutError) {
      // Bỏ qua nếu môi trường không hỗ trợ autoResize
    }

    return createJsonResponse({
      ok: true,
      code: 'SUCCESS',
      requestId: requestId,
      message: 'Tiếp nhận yêu cầu vận chuyển và ghi dữ liệu thành công!'
    });

  } catch (err) {
    return createJsonResponse({
      ok: false,
      code: 'INTERNAL_ERROR',
      message: 'Lỗi xử lý bảng tính: ' + (err && err.message ? err.message : String(err))
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Xử lý yêu cầu GET (doGet):
 * Tuyệt đối không để lộ dữ liệu khách hàng hoặc cấu hình qua phương thức GET.
 */
function doGet(e) {
  return createJsonResponse({
    ok: false,
    code: 'METHOD_NOT_ALLOWED',
    message: 'Cổng dịch vụ này chỉ tiếp nhận các yêu cầu POST bảo mật từ máy chủ Nam Hân Logistics.'
  });
}

