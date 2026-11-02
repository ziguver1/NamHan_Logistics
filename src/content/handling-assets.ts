/**
 * Handling & Transport Support Image Asset Registry
 * Design Reference: Figma Frame 84:1080 (Bốc Xếp và Hỗ trợ vận tải .png)
 * Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface HandlingImageAsset {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  label: string;
  recommendedAspect: string;
}

export type HandlingAssetKey = 'hero' | 'overview';

export const handlingAssets: Record<HandlingAssetKey, HandlingImageAsset> = {
  hero: {
    src: '/images/services/handling/hero-handling.webp',
    alt: 'Hoạt động bốc xếp hàng hóa bằng xe nâng tại kho bãi Nam Hân Logistics',
    width: 600,
    height: 420,
    label: 'HANDLING HERO FORKLIFT',
    recommendedAspect: '16:11 (~600 × 420px)',
  },
  overview: {
    src: '/images/services/handling/overview-handling.webp',
    alt: 'Đội ngũ bốc xếp chuyên nghiệp hỗ trợ dỡ hàng và xếp pallet cẩn trọng',
    width: 540,
    height: 380,
    label: 'HANDLING OVERVIEW LOGISTICS',
    recommendedAspect: '16:11 (~540 × 380px)',
  },
};
