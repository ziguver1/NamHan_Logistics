/**
 * Centralized Image Registry for Road Freight Service Page (Vận tải đường bộ — Frame 84:409)
 * Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface RoadImageAsset {
  src: string | null;
  alt: string;
  label: string;
  aspectRatio: string;
  expectedFile: string;
}

export type RoadAssetKey =
  | 'hero'
  | 'overviewWarehouse'
  | 'vehicleHead'
  | 'vehicleContainer'
  | 'vehicleBox'
  | 'vehicleTipper';

export const roadAssets: Record<RoadAssetKey, RoadImageAsset> = {
  // 1. Hero Section (Node 84:427)
  hero: {
    src: '/images/services/road/hero-road-freight.webp',
    alt: 'Đoàn xe vận tải đường bộ Nam Hân di chuyển trên tuyến cao tốc',
    label: 'ROAD HERO',
    aspectRatio: '16/7',
    expectedFile: '/images/services/road/hero-road-freight.webp',
  },

  // 2. Overview Depot & Infrastructure (Node 84:484)
  overviewWarehouse: {
    src: '/images/services/road/depot-warehouse.webp',
    alt: 'Khu vực bãi xe và trạm giao nhận Nam Hân Logistics uy tín chuyên nghiệp',
    label: 'ROAD DEPOT WAREHOUSE',
    aspectRatio: '16/10',
    expectedFile: '/images/services/road/depot-warehouse.webp',
  },

  // 3. Vehicles: 01 Đầu kéo (Node 84:534)
  vehicleHead: {
    src: '/images/services/road/vehicle-truck-head.webp',
    alt: 'Xe đầu kéo chuyên dụng tải trọng lớn vận tải đường dài',
    label: 'VEHICLE 01: TRUCK HEAD',
    aspectRatio: '16/10',
    expectedFile: '/images/services/road/vehicle-truck-head.webp',
  },

  // 4. Vehicles: 02 Xe Container
  vehicleContainer: {
    src: '/images/services/road/vehicle-container.webp',
    alt: 'Xe container 20 feet và 40 feet chạy tuyến Bắc Nam niêm chì nguyên seal',
    label: 'VEHICLE 02: CONTAINER',
    aspectRatio: '16/10',
    expectedFile: '/images/services/road/vehicle-container.webp',
  },

  // 5. Vehicles: 03 Xe Tải Thùng
  vehicleBox: {
    src: '/images/services/road/vehicle-box-truck.webp',
    alt: 'Xe tải thùng kín chuyên chở hàng hóa tiêu dùng và linh kiện điện tử',
    label: 'VEHICLE 03: BOX TRUCK',
    aspectRatio: '16/10',
    expectedFile: '/images/services/road/vehicle-box-truck.webp',
  },

  // 6. Vehicles: 04 Xe Ben
  vehicleTipper: {
    src: '/images/services/road/vehicle-tipper-dump.webp',
    alt: 'Xe ben tự đổ thủy lực chuyên chở nguyên vật liệu và hàng rời công trình',
    label: 'VEHICLE 04: TIPPER DUMP',
    aspectRatio: '16/10',
    expectedFile: '/images/services/road/vehicle-tipper-dump.webp',
  },
};
