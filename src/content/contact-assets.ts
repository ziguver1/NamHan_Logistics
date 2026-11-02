/**
 * Contact Page Image Asset Registry
 * Design Reference: Figma Frame 101:1816 (Liên hệ.png)
 * Populated with verified assets from NAM HÂN LOGISTICS
 */

export interface ContactImageAsset {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  label: string;
  aspectRatio: string;
}

export type ContactAssetKey = 'heroBg';

export const contactAssets: Record<ContactAssetKey, ContactImageAsset> = {
  heroBg: {
    src: '/images/contact/contact-hero-bg.webp',
    alt: 'Xe tải hiện đại của Nam Hân Logistics lưu thông trên cao tốc',
    width: 1280,
    height: 480,
    label: 'CONTACT HERO BACKGROUND',
    aspectRatio: '16/6',
  },
};
