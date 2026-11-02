/**
 * Transport Solutions Image Asset Registry
 * Design Reference: Figma Frame 84:2283 (Dịch vụ Giải pháp vận tải - Nam Hân Logistics.png)
 * Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface SolutionsImageAsset {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  label: string;
  aspectRatio: string;
}

export type SolutionsAssetKey =
  | 'heroBg'
  | 'fleet'
  | 'modeLtl'
  | 'modeConsolidation'
  | 'modeFtl';

export const solutionsAssets: Record<SolutionsAssetKey, SolutionsImageAsset> = {
  heroBg: {
    src: '/images/services/solutions/solutions-hero-bg.webp',
    alt: 'Đoàn xe vận tải Nam Hân lưu thông trên cao tốc huyết mạch Bắc Nam',
    width: 1280,
    height: 480,
    label: 'SOLUTIONS HERO BACKGROUND',
    aspectRatio: '16/6',
  },
  fleet: {
    src: '/images/services/solutions/solutions-fleet.webp',
    alt: 'Đội xe đầu kéo container và xe tải đỗ tại trung tâm điều vận Nam Hân',
    width: 580,
    height: 380,
    label: 'SOLUTIONS FLEET TERMINAL',
    aspectRatio: '16/11',
  },
  modeLtl: {
    src: '/images/services/solutions/solutions-mode-ltl.webp',
    alt: 'Vận chuyển hàng lẻ LTL tiết kiệm chi phí',
    width: 380,
    height: 240,
    label: 'TRANSPORT MODE LTL',
    aspectRatio: '16/10',
  },
  modeConsolidation: {
    src: '/images/services/solutions/solutions-mode-consolidation.webp',
    alt: 'Vận chuyển hàng ghép tối ưu hóa diện tích xe',
    width: 380,
    height: 240,
    label: 'TRANSPORT MODE CONSOLIDATION',
    aspectRatio: '16/10',
  },
  modeFtl: {
    src: '/images/services/solutions/solutions-mode-ftl.webp',
    alt: 'Vận chuyển hàng nguyên chuyến bao xe FTL an toàn tuyệt đối',
    width: 380,
    height: 240,
    label: 'TRANSPORT MODE FTL',
    aspectRatio: '16/10',
  },
};
