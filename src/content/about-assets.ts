/**
 * Centralized Image Registry for About Page (Về Nam Hân — Frame 92:731)
 * Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface AboutImageAsset {
  src: string | null;
  alt: string;
  label: string;
  aspectRatio: string;
  expectedFile: string;
}

export type AboutAssetKey =
  | 'heroVehicle'
  | 'aboutWarehouse'
  | 'facilityBimSon'
  | 'facilityBinhDuong'
  | 'facilityHcm'
  | 'peopleControl';

export const aboutAssets: Record<AboutAssetKey, AboutImageAsset> = {
  // 1. Hero Section (Node 92:734)
  heroVehicle: {
    src: '/images/about/hero-about-truck.webp',
    alt: 'Xe đầu kéo container Nam Hân Logistics di chuyển trên tuyến ven biển lúc hoàng hôn',
    label: 'HERO VEHICLE',
    aspectRatio: '4/5',
    expectedFile: '/images/about/hero-about-truck.webp',
  },

  // 2. About Us / Giới thiệu doanh nghiệp (Node 92:790)
  aboutWarehouse: {
    src: '/images/about/about-warehouse-man.webp',
    alt: 'Cán bộ quản lý kiểm tra hành trình vận chuyển tại bãi xe container Nam Hân Logistics',
    label: 'ABOUT WAREHOUSE',
    aspectRatio: '16/10',
    expectedFile: '/images/about/about-warehouse-man.webp',
  },

  // 3. Facilities / Cơ sở vật chất (Node 92:900)
  facilityBimSon: {
    src: '/images/about/facility-bim-son.webp',
    alt: 'Trụ sở chính và bãi xe Nam Hân tại Bỉm Sơn, Thanh Hóa',
    label: 'HUB BIM SON',
    aspectRatio: '16/10',
    expectedFile: '/images/about/facility-bim-son.webp',
  },
  facilityBinhDuong: {
    src: '/images/about/facility-binh-duong.webp',
    alt: 'Bãi tập kết và xưởng kỹ thuật Nam Hân tại Bình Dương',
    label: 'HUB BINH DUONG',
    aspectRatio: '16/10',
    expectedFile: '/images/about/facility-binh-duong.webp',
  },
  facilityHcm: {
    src: '/images/about/facility-hcm.webp',
    alt: 'Bãi xe và điểm trung chuyển Nam Hân tại Quận 12, TP. Hồ Chí Minh',
    label: 'HUB HCM',
    aspectRatio: '16/10',
    expectedFile: '/images/about/facility-hcm.webp',
  },

  // 4. People / Đội ngũ nhân sự (Node 92:978)
  peopleControl: {
    src: '/images/about/people-control-room.webp',
    alt: 'Đội ngũ điều phối và nhân viên vận hành giám sát lộ trình GPS trực tuyến 24/7',
    label: 'CONTROL ROOM',
    aspectRatio: '16/10',
    expectedFile: '/images/about/people-control-room.webp',
  },
};
