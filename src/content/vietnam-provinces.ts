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

  // 1. Check matching provinces
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
          badge: prov.isHub ? 'Tỉnh trọng điểm' : undefined,
          isPopular: prov.isHub,
        });
      }
    }
  }

  // 2. Check matching major logistics hubs
  for (const hub of MAJOR_LOGISTICS_HUBS) {
    const hubNameClean = removeVietnameseTones(hub.name);
    if (hubNameClean.includes(cleanQ)) {
      if (!seen.has(hub.name)) {
        seen.add(hub.name);
        results.push(hub);
      }
    }
  }

  return results.slice(0, limit);
}

