/**
 * Logistics & Delivery Image Asset Registry
 * Design Reference: Figma Frame 84:1720 (Dịch vụ Logistics & Giao nhận - Nam Hân Logistics.png)
 * Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface LogisticsImageAsset {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  label: string;
  aspectRatio: string;
}

export type LogisticsAssetKey = 'heroBg' | 'warehouse';

export const logisticsAssets: Record<LogisticsAssetKey, LogisticsImageAsset> = {
  heroBg: {
    src: '/images/services/logistics/logistics-hero-bg.webp',
    alt: 'Bối cảnh kho bãi logistics và điều phối xe tải Nam Hân',
    width: 1280,
    height: 520,
    label: 'LOGISTICS HERO BACKGROUND',
    aspectRatio: '16/7',
  },
  warehouse: {
    src: '/images/services/logistics/logistics-warehouse.webp',
    alt: 'Hoạt động xuất nhập hàng và đóng gói pallet tại trung tâm logistics Nam Hân',
    width: 580,
    height: 400,
    label: 'LOGISTICS WAREHOUSE HUB',
    aspectRatio: '16/11',
  },
};
