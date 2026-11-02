/**
 * Centralized Image Registry for Services Overview Page (Dịch Vụ — Frame 51:575)
 * Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface ServicesImageAsset {
  src: string | null;
  alt: string;
  label: string;
  aspectRatio: string;
  expectedFile: string;
}

export type ServicesAssetKey =
  | 'hero'
  | 'serviceRoad'
  | 'serviceLogistics'
  | 'serviceHandling'
  | 'serviceSolutions';

export const servicesAssets: Record<ServicesAssetKey, ServicesImageAsset> = {
  // 1. Hero Section (Node 51:603)
  hero: {
    src: '/images/services/hero-services.webp',
    alt: 'Xe container Nam Hân di chuyển trên tuyến đường bộ ven biển',
    label: 'SERVICES HERO',
    aspectRatio: '16/7',
    expectedFile: '/images/services/hero-services.webp',
  },

  // 2. Core Service 01: Vận tải đường bộ (Node 51:639)
  serviceRoad: {
    src: '/images/services/service-road-core.webp',
    alt: 'Dịch vụ vận tải đường bộ Bắc Trung Nam bằng xe container và xe tải chuyên dụng',
    label: 'SERVICE ROAD (CORE)',
    aspectRatio: '16/10',
    expectedFile: '/images/services/service-road-core.webp',
  },

  // 3. Service 02: Logistics & Giao nhận
  serviceLogistics: {
    src: '/images/services/service-logistics-fleet.webp',
    alt: 'Dịch vụ logistics và điều phối giao nhận hàng hóa tại trung tâm phân phối',
    label: 'SERVICE LOGISTICS',
    aspectRatio: '16/10',
    expectedFile: '/images/services/service-logistics-fleet.webp',
  },

  // 4. Service 03: Bốc xếp & Hỗ trợ vận tải
  serviceHandling: {
    src: '/images/services/service-handling-forklift.webp',
    alt: 'Dịch vụ bốc xếp cơ giới, nâng hạ và đóng gói hàng hóa kho bãi',
    label: 'SERVICE HANDLING',
    aspectRatio: '16/10',
    expectedFile: '/images/services/service-handling-forklift.webp',
  },

  // 5. Service 04: Giải pháp vận tải
  serviceSolutions: {
    src: '/images/services/service-solutions-truck.webp',
    alt: 'Tư vấn giải pháp vận tải hàng hóa chuyên dụng và công nghiệp nặng',
    label: 'SERVICE SOLUTIONS',
    aspectRatio: '16/10',
    expectedFile: '/images/services/service-solutions-truck.webp',
  },
};
