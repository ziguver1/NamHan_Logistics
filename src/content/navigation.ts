import { ROUTES } from '@/lib/routes';
import type { NavigationItem } from '@/lib/types';

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Trang chủ',
    href: ROUTES.HOME,
  },
  {
    label: 'Về Nam Hân',
    href: ROUTES.ABOUT,
  },
  {
    label: 'Dịch vụ',
    href: ROUTES.SERVICES,
    children: [
      {
        label: 'Vận tải đường bộ',
        href: ROUTES.SERVICE_ROAD,
      },
      {
        label: 'Bốc xếp & Hỗ trợ vận tải',
        href: ROUTES.SERVICE_HANDLING,
      },
      {
        label: 'Logistics & Giao nhận',
        href: ROUTES.SERVICE_LOGISTICS,
      },
      {
        label: 'Giải pháp vận tải',
        href: ROUTES.SERVICE_SOLUTIONS,
      },
    ],
  },
  {
    label: 'Bảng tin',
    href: ROUTES.NEWS,
  },
  {
    label: 'Liên hệ',
    href: ROUTES.CONTACT,
  },
];

export const headerCTA: NavigationItem = {
  label: 'Gửi yêu cầu vận chuyển',
  href: ROUTES.CONTACT,
};
