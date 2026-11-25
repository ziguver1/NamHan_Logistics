/**
 * Vietnam Administrative Provinces & Major Logistics Hubs
 * Official 63 Provinces & Centrally-Run Cities of Vietnam (GSO Standard)
 * + Major B2B freight corridors & industrial parks
 */

export interface ProvinceItem {
  code: string;
  name: string;
  fullName: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Tây Nguyên' | 'Đông Nam Bộ' | 'Tây Nam Bộ';
  isHub?: boolean;
  aliases?: string[];
}

export interface LocationSuggestion {
  name: string;
  type: 'province' | 'hub';
  provinceName: string;
  region: string;
  badge?: string;
  isPopular?: boolean;
}

export const VIETNAM_PROVINCES: ProvinceItem[] = [
  // Miền Bắc
  { code: '01', name: 'Hà Nội', fullName: 'Thành phố Hà Nội', region: 'Miền Bắc', isHub: true, aliases: ['hn', 'ha noi', 'thu do'] },
  { code: '31', name: 'Hải Phòng', fullName: 'Thành phố Hải Phòng', region: 'Miền Bắc', isHub: true, aliases: ['hp', 'hai phong', 'cang hai phong'] },
  { code: '27', name: 'Bắc Ninh', fullName: 'Tỉnh Bắc Ninh', region: 'Miền Bắc', isHub: true, aliases: ['bn', 'bac ninh'] },
  { code: '30', name: 'Hải Dương', fullName: 'Tỉnh Hải Dương', region: 'Miền Bắc', aliases: ['hd', 'hai duong'] },
  { code: '22', name: 'Quảng Ninh', fullName: 'Tỉnh Quảng Ninh', region: 'Miền Bắc', isHub: true, aliases: ['qn', 'quang ninh', 'ha long'] },
  { code: '33', name: 'Hưng Yên', fullName: 'Tỉnh Hưng Yên', region: 'Miền Bắc', aliases: ['hy', 'hung yen'] },
  { code: '26', name: 'Vĩnh Phúc', fullName: 'Tỉnh Vĩnh Phúc', region: 'Miền Bắc', aliases: ['vp', 'vinh phuc'] },
  { code: '24', name: 'Bắc Giang', fullName: 'Tỉnh Bắc Giang', region: 'Miền Bắc', aliases: ['bg', 'bac giang'] },
  { code: '19', name: 'Thái Nguyên', fullName: 'Tỉnh Thái Nguyên', region: 'Miền Bắc', aliases: ['tn', 'thai nguyen'] },
  { code: '25', name: 'Phú Thọ', fullName: 'Tỉnh Phú Thọ', region: 'Miền Bắc', aliases: ['phu tho'] },
  { code: '34', name: 'Thái Bình', fullName: 'Tỉnh Thái Bình', region: 'Miền Bắc', aliases: ['tb', 'thai binh'] },
  { code: '35', name: 'Hà Nam', fullName: 'Tỉnh Hà Nam', region: 'Miền Bắc', aliases: ['ha nam'] },
  { code: '36', name: 'Nam Định', fullName: 'Tỉnh Nam Định', region: 'Miền Bắc', aliases: ['nd', 'nam dinh'] },
  { code: '37', name: 'Ninh Bình', fullName: 'Tỉnh Ninh Bình', region: 'Miền Bắc', aliases: ['nb', 'ninh binh'] },
  { code: '02', name: 'Hà Giang', fullName: 'Tỉnh Hà Giang', region: 'Miền Bắc', aliases: ['ha giang'] },
  { code: '04', name: 'Cao Bằng', fullName: 'Tỉnh Cao Bằng', region: 'Miền Bắc', aliases: ['cao bang'] },
  { code: '06', name: 'Bắc Kạn', fullName: 'Tỉnh Bắc Kạn', region: 'Miền Bắc', aliases: ['bac kan'] },
  { code: '08', name: 'Tuyên Quang', fullName: 'Tỉnh Tuyên Quang', region: 'Miền Bắc', aliases: ['tuyen quang'] },
  { code: '10', name: 'Lào Cai', fullName: 'Tỉnh Lào Cai', region: 'Miền Bắc', aliases: ['lao cai'] },
  { code: '11', name: 'Điện Biên', fullName: 'Tỉnh Điện Biên', region: 'Miền Bắc', aliases: ['dien bien'] },
  { code: '12', name: 'Lai Châu', fullName: 'Tỉnh Lai Châu', region: 'Miền Bắc', aliases: ['lai chau'] },
  { code: '14', name: 'Sơn La', fullName: 'Tỉnh Sơn La', region: 'Miền Bắc', aliases: ['son la'] },
  { code: '15', name: 'Yên Bái', fullName: 'Tỉnh Yên Bái', region: 'Miền Bắc', aliases: ['yen bai'] },
  { code: '17', name: 'Hòa Bình', fullName: 'Tỉnh Hòa Bình', region: 'Miền Bắc', aliases: ['hoa binh'] },
  { code: '20', name: 'Lạng Sơn', fullName: 'Tỉnh Lạng Sơn', region: 'Miền Bắc', aliases: ['lang son', 'huu nghi'] },

  // Miền Trung & Bắc Trung Bộ
  { code: '38', name: 'Thanh Hóa', fullName: 'Tỉnh Thanh Hóa', region: 'Miền Trung', isHub: true, aliases: ['th', 'thanh hoa', 'bim son', 'nghi son'] },
  { code: '40', name: 'Nghệ An', fullName: 'Tỉnh Nghệ An', region: 'Miền Trung', isHub: true, aliases: ['na', 'nghe an', 'vinh'] },
  { code: '42', name: 'Hà Tĩnh', fullName: 'Tỉnh Hà Tĩnh', region: 'Miền Trung', aliases: ['ha tinh', 'vung ang'] },
  { code: '44', name: 'Quảng Bình', fullName: 'Tỉnh Quảng Bình', region: 'Miền Trung', aliases: ['quang binh', 'dong hoi'] },
  { code: '45', name: 'Quảng Trị', fullName: 'Tỉnh Quảng Trị', region: 'Miền Trung', aliases: ['quang tri', 'dong ha'] },
  { code: '46', name: 'Thừa Thiên Huế', fullName: 'Tỉnh Thừa Thiên Huế', region: 'Miền Trung', aliases: ['hue', 'thua thien hue'] },
  { code: '48', name: 'Đà Nẵng', fullName: 'Thành phố Đà Nẵng', region: 'Miền Trung', isHub: true, aliases: ['dn', 'da nang'] },
  { code: '49', name: 'Quảng Nam', fullName: 'Tỉnh Quảng Nam', region: 'Miền Trung', aliases: ['quang nam', 'chu lai'] },
  { code: '51', name: 'Quảng Ngãi', fullName: 'Tỉnh Quảng Ngãi', region: 'Miền Trung', aliases: ['quang ngai', 'dung quat'] },
  { code: '52', name: 'Bình Định', fullName: 'Tỉnh Bình Định', region: 'Miền Trung', isHub: true, aliases: ['binh dinh', 'quy nhon'] },
  { code: '54', name: 'Phú Yên', fullName: 'Tỉnh Phú Yên', region: 'Miền Trung', aliases: ['phu yen', 'tuy hoa'] },
  { code: '56', name: 'Khánh Hòa', fullName: 'Tỉnh Khánh Hòa', region: 'Miền Trung', isHub: true, aliases: ['nha trang', 'khanh hoa', 'cam ranh'] },
  { code: '58', name: 'Ninh Thuận', fullName: 'Tỉnh Ninh Thuận', region: 'Miền Trung', aliases: ['ninh thuan', 'phan rang'] },
  { code: '60', name: 'Bình Thuận', fullName: 'Tỉnh Bình Thuận', region: 'Miền Trung', aliases: ['binh thuan', 'phan thiet'] },

  // Tây Nguyên
  { code: '62', name: 'Kon Tum', fullName: 'Tỉnh Kon Tum', region: 'Tây Nguyên', aliases: ['kon tum'] },
  { code: '64', name: 'Gia Lai', fullName: 'Tỉnh Gia Lai', region: 'Tây Nguyên', aliases: ['gia lai', 'pleiku'] },
  { code: '66', name: 'Đắk Lắk', fullName: 'Tỉnh Đắk Lắk', region: 'Tây Nguyên', isHub: true, aliases: ['dak lak', 'buon ma thuot', 'dac lac'] },
  { code: '67', name: 'Đắk Nông', fullName: 'Tỉnh Đắk Nông', region: 'Tây Nguyên', aliases: ['dak nong', 'dac nong'] },
  { code: '68', name: 'Lâm Đồng', fullName: 'Tỉnh Lâm Đồng', region: 'Tây Nguyên', aliases: ['lam dong', 'da lat', 'bao loc'] },

  // Đông Nam Bộ (Trọng điểm vận tải Nam Hân)
  { code: '79', name: 'TP. Hồ Chí Minh', fullName: 'Thành phố Hồ Chí Minh', region: 'Đông Nam Bộ', isHub: true, aliases: ['hcm', 'tphcm', 'tp hcm', 'sai gon', 'tp ho chi minh', 'cat lai'] },
  { code: '74', name: 'Bình Dương', fullName: 'Tỉnh Bình Dương', region: 'Đông Nam Bộ', isHub: true, aliases: ['bd', 'binh duong', 'song than', 'vsip', 'thu dau mot', 'di an', 'ben cat'] },
  { code: '75', name: 'Đồng Nai', fullName: 'Tỉnh Đồng Nai', region: 'Đông Nam Bộ', isHub: true, aliases: ['dn', 'dong nai', 'bien hoa', 'long thanh', 'nhon trach', 'amata'] },
  { code: '70', name: 'Bình Phước', fullName: 'Tỉnh Bình Phước', region: 'Đông Nam Bộ', isHub: true, aliases: ['bp', 'binh phuoc', 'dong xoai', 'chon thanh'] },
  { code: '72', name: 'Tây Ninh', fullName: 'Tỉnh Tây Ninh', region: 'Đông Nam Bộ', aliases: ['tay ninh', 'moc bai', 'phuoc dong'] },
  { code: '77', name: 'Bà Rịa - Vũng Tàu', fullName: 'Tỉnh Bà Rịa - Vũng Tàu', region: 'Đông Nam Bộ', isHub: true, aliases: ['vung tau', 'ba ria', 'cai mep', 'thi vai'] },

  // Tây Nam Bộ / Đồng Bằng Sông Cửu Long
  { code: '80', name: 'Long An', fullName: 'Tỉnh Long An', region: 'Tây Nam Bộ', isHub: true, aliases: ['long an', 'tan an', 'ben luc', 'duc hoa'] },
  { code: '82', name: 'Tiền Giang', fullName: 'Tỉnh Tiền Giang', region: 'Tây Nam Bộ', aliases: ['tien giang', 'my tho'] },
  { code: '83', name: 'Bến Tre', fullName: 'Tỉnh Bến Tre', region: 'Tây Nam Bộ', aliases: ['ben tre'] },
  { code: '84', name: 'Trà Vinh', fullName: 'Tỉnh Trà Vinh', region: 'Tây Nam Bộ', aliases: ['tra vinh'] },
  { code: '86', name: 'Vĩnh Long', fullName: 'Tỉnh Vĩnh Long', region: 'Tây Nam Bộ', aliases: ['vinh long'] },
  { code: '87', name: 'Đồng Tháp', fullName: 'Tỉnh Đồng Tháp', region: 'Tây Nam Bộ', aliases: ['dong thap', 'cao lanh', 'sa dec'] },
  { code: '89', name: 'An Giang', fullName: 'Tỉnh An Giang', region: 'Tây Nam Bộ', aliases: ['an giang', 'long xuyen', 'chau doc'] },
  { code: '91', name: 'Kiên Giang', fullName: 'Tỉnh Kiên Giang', region: 'Tây Nam Bộ', aliases: ['kien giang', 'rach gia', 'ha tien', 'phu quoc'] },
  { code: '92', name: 'Cần Thơ', fullName: 'Thành phố Cần Thơ', region: 'Tây Nam Bộ', isHub: true, aliases: ['can tho', 'tp can tho'] },
  { code: '93', name: 'Hậu Giang', fullName: 'Tỉnh Hậu Giang', region: 'Tây Nam Bộ', aliases: ['hau giang', 'vi thanh'] },
  { code: '94', name: 'Sóc Trăng', fullName: 'Tỉnh Sóc Trăng', region: 'Tây Nam Bộ', aliases: ['soc trang'] },
  { code: '95', name: 'Bạc Liêu', fullName: 'Tỉnh Bạc Liêu', region: 'Tây Nam Bộ', aliases: ['bac lieu'] },
  { code: '96', name: 'Cà Mau', fullName: 'Tỉnh Cà Mau', region: 'Tây Nam Bộ', aliases: ['ca mau'] },
];

export interface DepotYardItem {
  id: string;
  name: string;
  address: string;
  city: 'TP. Hồ Chí Minh' | 'Bình Dương' | 'Hà Nội';
  area: string;
  aliases?: string[];
}

export const DEPOT_YARDS: DepotYardItem[] = [
  // TP. Hồ Chí Minh
  {
    id: 'hcm-nam-bac-q12',
    name: 'Bãi xe Nam – Bắc (Quận 12)',
    address: '415 Lê Thị Riêng, P. Thới An, Quận 12, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'Quận 12',
    aliases: ['quan 12', 'q12', 'le thi rieng', 'nam bac', 'quoc lo 1a', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-trong-tan-q12',
    name: 'Bãi xe Trọng Tấn (Quận 12)',
    address: '789 Lê Thị Riêng, P. Thới An, Quận 12, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'Quận 12',
    aliases: ['quan 12', 'q12', 'le thi rieng', 'trong tan', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-quang-dung-hoc-mon',
    name: 'Bãi xe Quang Dũng (Hóc Môn)',
    address: '1/3B Nguyễn Ảnh Thủ, H. Hóc Môn (giáp Quận 12), TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'Hóc Môn',
    aliases: ['hoc mon', 'nguyen anh thu', 'quang dung', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-an-khang-hoc-mon',
    name: 'Bãi gửi xe An Khang (Hóc Môn)',
    address: '54/9 Tỉnh Lộ 14A, Ấp Tiền Lân, Xã Bà Điểm, H. Hóc Môn, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'Hóc Môn',
    aliases: ['hoc mon', 'ba diem', 'an khang', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-cat-lai-thu-duc',
    name: 'Bãi xe & Depot Cảng Cát Lái',
    address: 'Đường Nguyễn Thị Định – Nguyễn Duy Trinh, TP. Thủ Đức, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'TP. Thủ Đức',
    aliases: ['cat lai', 'thu duc', 'nguyen thi dinh', 'nguyen duy trinh', 'cang', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-hoang-huu-nam',
    name: 'Bãi xe Hoàng Hữu Nam (Thủ Đức)',
    address: 'Đường Hoàng Hữu Nam, P. Tân Phú, TP. Thủ Đức, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'TP. Thủ Đức',
    aliases: ['hoang huu nam', 'thu duc', 'suoi tien', 'tan phu', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-phu-huu',
    name: 'Bãi xe Vòng xoay Phú Hữu',
    address: 'Đường Võ Chí Công, P. Phú Hữu, TP. Thủ Đức, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'TP. Thủ Đức',
    aliases: ['phu huu', 'vo chi cong', 'thu duc', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-tan-thuan-nha-be',
    name: 'Bãi xe Cảng Tân Thuận & Nhà Bè',
    address: 'Trục Nguyễn Văn Linh – Huỳnh Tấn Phát, Quận 7 / Nhà Bè, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'Quận 7 – Nhà Bè',
    aliases: ['tan thuan', 'nha be', 'quan 7', 'q7', 'hiep phuoc', 'nguyen van linh', 'hcm', 'ho chi minh', 'bai xe'],
  },
  {
    id: 'hcm-nam-han-vinhomes',
    name: 'Chi nhánh Nam Hân TP. HCM',
    address: 'Đường V3, Số V3-37, Manhattan Vinhomes Grand Park, P. Long Bình, TP. Thủ Đức, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    area: 'TP. Thủ Đức',
    aliases: ['nam han', 'vinhomes', 'long binh', 'thu duc', 'chi nhanh', 'hcm', 'ho chi minh'],
  },

  // Bình Dương
  {
    id: 'bd-an-binh-song-than',
    name: 'Tổng kho An Bình – Sóng Thần',
    address: 'KP. Bình Đường 1, P. An Bình (KCN Sóng Thần), TP. Dĩ An, Bình Dương',
    city: 'Bình Dương',
    area: 'TP. Dĩ An',
    aliases: ['song than', 'an binh', 'di an', 'binh duong', 'tong kho', 'bai xe'],
  },
  {
    id: 'bd-depot-ga-song-than',
    name: 'Hệ thống Depot Ga Sóng Thần',
    address: 'Đại lộ Độc Lập / Đường số 2 & 14, KCN Sóng Thần 1 & 2, TP. Dĩ An, Bình Dương',
    city: 'Bình Dương',
    area: 'TP. Dĩ An',
    aliases: ['ga song than', 'kcn song than', 'doc lap', 'di an', 'binh duong', 'depot', 'bai xe'],
  },
  {
    id: 'bd-tan-van-dt743',
    name: 'Bãi xe Ngã ba Tân Vạn – ĐT743',
    address: 'Tuyến ĐT743 & Ngã ba Tân Vạn, P. Bình Thắng, TP. Dĩ An, Bình Dương',
    city: 'Bình Dương',
    area: 'TP. Dĩ An',
    aliases: ['tan van', 'dt743', 'binh thang', 'di an', 'binh duong', 'bai xe'],
  },
  {
    id: 'bd-vsip-1',
    name: 'Bãi xe & Depot KCN VSIP 1',
    address: 'Đường Hữu Nghị / Đại lộ Tự Do, KCN VSIP 1, TP. Thuận An, Bình Dương',
    city: 'Bình Dương',
    area: 'TP. Thuận An',
    aliases: ['vsip', 'vsip 1', 'thuan an', 'binh hoa', 'binh duong', 'bai xe'],
  },
  {
    id: 'bd-my-phuoc-tan-van',
    name: 'Bãi xe trục Mỹ Phước – Tân Vạn',
    address: 'Đường Mỹ Phước – Tân Vạn, P. An Phú / Thuận Giao, TP. Thuận An, Bình Dương',
    city: 'Bình Dương',
    area: 'TP. Thuận An',
    aliases: ['my phuoc tan van', 'an phu', 'thuan giao', 'thuan an', 'binh duong', 'bai xe'],
  },
  {
    id: 'bd-vinh-phu',
    name: 'Bãi xe Vĩnh Phú (Thuận An)',
    address: 'Đường Vĩnh Phú 21, P. Vĩnh Phú, TP. Thuận An, Bình Dương',
    city: 'Bình Dương',
    area: 'TP. Thuận An',
    aliases: ['vinh phu', 'thuan an', 'binh duong', 'bai xe'],
  },

  // Hà Nội
  {
    id: 'hn-s9-thanh-tri',
    name: 'Bãi xe S9 – Chân cầu Thanh Trì',
    address: 'Tổ 21, P. Thanh Trì, Quận Hoàng Mai, Hà Nội',
    city: 'Hà Nội',
    area: 'Q. Hoàng Mai',
    aliases: ['s9', 'thanh tri', 'hoang mai', 'cau thanh tri', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-gam-cau-thanh-tri-h3',
    name: 'Bãi xe Gầm cầu Thanh Trì – Trụ H3',
    address: 'Đường gom Vành đai 3, P. Lĩnh Nam, Quận Hoàng Mai, Hà Nội',
    city: 'Hà Nội',
    area: 'Q. Hoàng Mai',
    aliases: ['gam cau thanh tri', 'tru h3', 'vanh dai 3', 'linh nam', 'hoang mai', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-thuy-linh',
    name: 'Bãi xe Thúy Lĩnh – Lĩnh Nam',
    address: 'Số 1 / Ngõ 49 Thúy Lĩnh, P. Lĩnh Nam, Quận Hoàng Mai, Hà Nội',
    city: 'Hà Nội',
    area: 'Q. Hoàng Mai',
    aliases: ['thuy linh', 'linh nam', 'hoang mai', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-phap-van',
    name: 'Bãi xe Pháp Vân – Tứ Hiệp',
    address: 'Đường Trần Thủ Độ, KĐT Pháp Vân, Quận Hoàng Mai, Hà Nội',
    city: 'Hà Nội',
    area: 'Q. Hoàng Mai',
    aliases: ['phap van', 'tu hiep', 'tran thu do', 'hoang mai', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-ngoc-hoi',
    name: 'Tổng kho & Bãi xe Ngọc Hồi',
    address: 'Km10 Đường Giải Phóng / KCN Ngọc Hồi, H. Thanh Trì, Hà Nội',
    city: 'Hà Nội',
    area: 'H. Thanh Trì',
    aliases: ['ngoc hoi', 'giai phong', 'thanh tri', 'ha noi', 'tong kho', 'bai xe'],
  },
  {
    id: 'hn-vinh-quynh',
    name: 'Bãi xe Vĩnh Quỳnh (QL1A cũ)',
    address: 'Xã Vĩnh Quỳnh, Huyện Thanh Trì, Hà Nội',
    city: 'Hà Nội',
    area: 'H. Thanh Trì',
    aliases: ['vinh quynh', 'thanh tri', 'quoc lo 1a', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-lien-ninh',
    name: 'Bãi xe Liên Ninh (Thanh Trì)',
    address: 'Xã Liên Ninh, Huyện Thanh Trì, Hà Nội',
    city: 'Hà Nội',
    area: 'H. Thanh Trì',
    aliases: ['lien ninh', 'thanh tri', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-tran-van-tra',
    name: 'Bãi xe Phố Trần Văn Trà',
    address: 'Phố Trần Văn Trà, P. Việt Hưng, Quận Long Biên, Hà Nội',
    city: 'Hà Nội',
    area: 'Q. Long Biên',
    aliases: ['tran van tra', 'viet hung', 'long bien', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-thach-ban-co-linh',
    name: 'Bãi xe Thạch Bàn – Cổ Linh',
    address: 'P. Thạch Bàn (gần cầu Vĩnh Tuy & Thanh Trì), Quận Long Biên, Hà Nội',
    city: 'Hà Nội',
    area: 'Q. Long Biên',
    aliases: ['thach ban', 'co linh', 'long bien', 'ha noi', 'bai xe'],
  },
  {
    id: 'hn-ngo-gia-tu',
    name: 'Bãi xe Ngô Gia Tự – Đức Giang',
    address: 'Phố Ngô Gia Tự, P. Đức Giang, Quận Long Biên, Hà Nội',
    city: 'Hà Nội',
    area: 'Q. Long Biên',
    aliases: ['ngo gia tu', 'duc giang', 'long bien', 'ha noi', 'bai xe'],
  },
];

/**
 * Prominent B2B Logistics Hubs, Industrial Parks & Ports
 */
export const MAJOR_LOGISTICS_HUBS: LocationSuggestion[] = [
  { name: 'TP. Hồ Chí Minh (Tổng kho & Cảng Cát Lái)', type: 'hub', provinceName: 'TP. Hồ Chí Minh', region: 'Đông Nam Bộ', badge: 'Hub trọng điểm', isPopular: true },
  { name: 'Bình Dương (Depot KCN Sóng Thần / VSIP)', type: 'hub', provinceName: 'Bình Dương', region: 'Đông Nam Bộ', badge: 'Depot Nam Hân', isPopular: true },
  { name: 'Đồng Nai (KCN Biên Hòa / Amata / Nhơn Trạch)', type: 'hub', provinceName: 'Đồng Nai', region: 'Đông Nam Bộ', badge: 'Cụm KCN lớn', isPopular: true },
  { name: 'Bình Phước (KCN Chơn Thành / Đồng Xoài)', type: 'hub', provinceName: 'Bình Phước', region: 'Đông Nam Bộ', badge: 'Đông Nam Bộ', isPopular: true },
  { name: 'Thanh Hóa (Trụ sở Nam Hân / Bỉm Sơn / Nghi Sơn)', type: 'hub', provinceName: 'Thanh Hóa', region: 'Miền Trung', badge: 'Trụ sở chính', isPopular: true },
  { name: 'Hà Nội (Hub phân phối phía Bắc & ICD Mỹ Đình)', type: 'hub', provinceName: 'Hà Nội', region: 'Miền Bắc', badge: 'Hub Bắc Bộ', isPopular: true },
  { name: 'Hải Phòng (Cụm cảng Đình Vũ / Lạch Huyện)', type: 'hub', provinceName: 'Hải Phòng', region: 'Miền Bắc', badge: 'Cảng biển quốc tế', isPopular: true },
  { name: 'Đà Nẵng (Trạm trung chuyển Miền Trung / Cảng Tiên Sa)', type: 'hub', provinceName: 'Đà Nẵng', region: 'Miền Trung', badge: 'Hub Miền Trung', isPopular: true },
  { name: 'Long An (KCN Bến Lức / Đức Hòa / Cảng Long An)', type: 'hub', provinceName: 'Long An', region: 'Tây Nam Bộ', badge: 'Cửa ngõ Miền Tây', isPopular: true },
  { name: 'Bắc Ninh (KCN Yên Phong / Quế Võ / VSIP)', type: 'hub', provinceName: 'Bắc Ninh', region: 'Miền Bắc', badge: 'Thủ phủ công nghiệp', isPopular: true },
  { name: 'Cần Thơ (KCN Trà Nóc / Trung tâm Tây Nam Bộ)', type: 'hub', provinceName: 'Cần Thơ', region: 'Tây Nam Bộ', badge: 'Hub Tây Nam Bộ', isPopular: true },
];

/**
 * Remove Vietnamese accents and convert to lower case for fuzzy matching
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Filter locations matching a query string
 */
export function searchLocations(query: string, limit: number = 8): LocationSuggestion[] {
  const cleanQ = removeVietnameseTones(query);
  if (!cleanQ) {
    // Return top popular hubs & provinces
    const popularProvinces = VIETNAM_PROVINCES.filter((p) => p.isHub).slice(0, 6).map((p) => ({
      name: p.name,
      type: 'province' as const,
      provinceName: p.name,
      region: p.region,
      isPopular: true,
    }));
    return popularProvinces;
  }

  const results: LocationSuggestion[] = [];
  const seen = new Set<string>();

  // 1. Check matching provinces (each province appears exactly once)
  for (const prov of VIETNAM_PROVINCES) {
    const rawNameClean = removeVietnameseTones(prov.name);
    const fullNameClean = removeVietnameseTones(prov.fullName);
    const hasAliasMatch = prov.aliases?.some((a) => removeVietnameseTones(a).includes(cleanQ));

    if (rawNameClean.includes(cleanQ) || fullNameClean.includes(cleanQ) || hasAliasMatch) {
      if (!seen.has(prov.name)) {
        seen.add(prov.name);
        results.push({
          name: prov.name,
          type: 'province',
          provinceName: prov.name,
          region: prov.region,
          badge: prov.isHub ? 'Trọng điểm' : prov.region,
          isPopular: prov.isHub,
        });
      }
    }
  }

  return results.slice(0, limit);
}

