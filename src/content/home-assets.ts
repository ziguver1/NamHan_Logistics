/**
 * Centralized Image Registry for Homepage (Phase 1B)
 * Based on docs/03-FIGMA-PAGE-MAP.md (Frame 44:1195)
 *
 * Current state: Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface HomeImageAsset {
  src: string | null;
  alt: string;
  label: string;
  aspectRatio: string;
  expectedFile: string;
}

export const homeAssets: Record<string, HomeImageAsset> = {
  // 1. Hero Section (Node 44:1456)
  hero: {
    src: '/images/home/hero-truck.webp',
    alt: 'Đội xe vận tải đường bộ Nam Hân Logistics di chuyển liên tỉnh',
    label: 'HERO IMAGE',
    aspectRatio: '16/10',
    expectedFile: '/images/home/hero-truck.webp',
  },

  // 2. Overview & Năng lực (Node 44:1197)
  overviewMain: {
    src: '/images/home/overview-fleet.webp',
    alt: 'Đội xe tải và xe đầu kéo Nam Hân Logistics tại bãi tập kết',
    label: 'OVERVIEW FLEET',
    aspectRatio: '4/3',
    expectedFile: '/images/home/overview-fleet.webp',
  },
  overviewSecondary: {
    src: '/images/home/overview-warehouse.webp',
    alt: 'Hoạt động điều phối và kiểm soát hàng hóa tại kho Nam Hân',
    label: 'OVERVIEW WAREHOUSE',
    aspectRatio: '16/10',
    expectedFile: '/images/home/overview-warehouse.webp',
  },

  // 3. Four Core Services
  serviceRoad: {
    src: '/images/home/service-road.webp',
    alt: 'Dịch vụ vận tải hàng hóa đường bộ Bắc — Trung — Nam',
    label: 'SERVICE ROAD',
    aspectRatio: '16/10',
    expectedFile: '/images/home/service-road.webp',
  },
  serviceHandling: {
    src: '/images/home/service-handling.webp',
    alt: 'Dịch vụ bốc xếp, nâng hạ và đóng gói hàng hóa cơ giới',
    label: 'SERVICE HANDLING',
    aspectRatio: '16/10',
    expectedFile: '/images/home/service-handling.webp',
  },
  serviceLogistics: {
    src: '/images/home/service-logistics.webp',
    alt: 'Dịch vụ logistics và giao nhận hàng hóa tận nơi',
    label: 'SERVICE LOGISTICS',
    aspectRatio: '16/10',
    expectedFile: '/images/home/service-logistics.webp',
  },
  serviceSolutions: {
    src: '/images/home/service-solutions.webp',
    alt: 'Tư vấn và thiết kế giải pháp chuỗi cung ứng vận tải',
    label: 'SERVICE SOLUTIONS',
    aspectRatio: '16/10',
    expectedFile: '/images/home/service-solutions.webp',
  },

  // 4. Green Logistics Section (Node 44:1261)
  greenLogistics: {
    src: '/images/home/green-logistics.webp',
    alt: 'Giải pháp logistics xanh thân thiện với môi trường, tối ưu khí thải CO2',
    label: 'GREEN LOGISTICS',
    aspectRatio: '16/9',
    expectedFile: '/images/home/green-logistics.webp',
  },

  // 5. Testimonials Section (Node 44:1310)
  clientAvatar1: {
    src: '/images/home/client-avatar-1.webp',
    alt: 'Đại diện Doanh nghiệp sản xuất hàng tiêu dùng',
    label: 'CLIENT AVATAR 1',
    aspectRatio: '1/1',
    expectedFile: '/images/home/client-avatar-1.webp',
  },
  clientAvatar2: {
    src: '/images/home/client-avatar-2.webp',
    alt: 'Đại diện Công ty xuất nhập khẩu nông sản',
    label: 'CLIENT AVATAR 2',
    aspectRatio: '1/1',
    expectedFile: '/images/home/client-avatar-2.webp',
  },
  clientAvatar3: {
    src: '/images/home/client-avatar-3.webp',
    alt: 'Giám đốc chuỗi cung ứng thương mại điện tử',
    label: 'CLIENT AVATAR 3',
    aspectRatio: '1/1',
    expectedFile: '/images/home/client-avatar-3.webp',
  },

  // 6. News Section (Node 44:1513)
  newsThumb1: {
    src: '/images/home/news-thumb-1.webp',
    alt: 'Tối ưu hóa hành trình vận tải hàng hóa liên tỉnh mùa cao điểm',
    label: 'NEWS THUMB 1',
    aspectRatio: '16/10',
    expectedFile: '/images/home/news-thumb-1.webp',
  },
  newsThumb2: {
    src: '/images/home/news-thumb-2.webp',
    alt: 'Nam Hân Logistics mở rộng năng lực bãi xe trung chuyển khu vực miền Trung',
    label: 'NEWS THUMB 2',
    aspectRatio: '16/10',
    expectedFile: '/images/home/news-thumb-2.webp',
  },
  newsThumb3: {
    src: '/images/home/news-thumb-3.webp',
    alt: 'Quy trình an toàn và bảo hiểm hàng hóa 100% trong vận chuyển đường dài',
    label: 'NEWS THUMB 3',
    aspectRatio: '16/10',
    expectedFile: '/images/home/news-thumb-3.webp',
  },
};
