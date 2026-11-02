/**
 * Typed Route Constants
 * Approved 8 route structure based on docs/02-ARCHITECTURE.md and docs/03-FIGMA-PAGE-MAP.md
 */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/ve-nam-han/',
  SERVICES: '/dich-vu/',
  SERVICE_ROAD: '/dich-vu/van-tai-duong-bo/',
  SERVICE_HANDLING: '/dich-vu/boc-xep-ho-tro-van-tai/',
  SERVICE_LOGISTICS: '/dich-vu/logistics-giao-nhan/',
  SERVICE_SOLUTIONS: '/dich-vu/giai-phap-van-tai/',
  CONTACT: '/lien-he/',
  NEWS: '/bang-tin/',
  ADMIN: '/admin/',
  ADMIN_GOOGLE_SHEETS: '/admin/google-sheets/',
  NOT_FOUND: '/404',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
