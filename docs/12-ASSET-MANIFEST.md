# 12 — Asset Manifest & Image Inventory

## 1. Mục đích
Tài liệu theo dõi toàn bộ tài sản hình ảnh (assets) của website **NAM HÂN LOGISTICS**, phục vụ chuyển đổi sang định dạng WebP tối ưu và đảm bảo không gây ra hiện tượng layout shift khi chưa có ảnh thực tế.

Tất cả 44 hình ảnh từ thư mục bàn giao `NAM HÂN LOGISTICS/` đã được kiểm duyệt, phân loại và phân bổ chính xác vào các thư mục tương ứng trong `public/images/`.

---

## 2. Danh mục Hình ảnh Trang chủ (Phase 1B — Frame `44:1195`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `hero` | Hero (`44:1456`) | `HeroSection.astro` | `hero-truck.webp` | `/images/home/hero-truck.webp` | 16:10 (~640 × 400px) | **READY** |
| `overviewMain` | Overview & Năng lực (`44:1197`) | `OverviewSection.astro` | `overview-fleet.webp` | `/images/home/overview-fleet.webp` | 4:3 (~520 × 390px) | **READY** |
| `overviewSecondary` | Overview & Năng lực (`44:1197`) | `OverviewSection.astro` | `overview-warehouse.webp` | `/images/home/overview-warehouse.webp` | 16:10 (~400 × 250px) | **READY** |
| `serviceRoad` | Service Grid (`44:1195`) | `ServicesSection.astro` | `service-road.webp` | `/images/home/service-road.webp` | 16:10 (~280 × 175px) | **READY** |
| `serviceHandling` | Service Grid (`44:1195`) | `ServicesSection.astro` | `service-handling.webp` | `/images/home/service-handling.webp` | 16:10 (~280 × 175px) | **READY** |
| `serviceLogistics` | Service Grid (`44:1195`) | `ServicesSection.astro` | `service-logistics.webp` | `/images/home/service-logistics.webp` | 16:10 (~280 × 175px) | **READY** |
| `serviceSolutions` | Service Grid (`44:1195`) | `ServicesSection.astro` | `service-solutions.webp` | `/images/home/service-solutions.webp` | 16:10 (~280 × 175px) | **READY** |
| `greenLogistics` | Green Logistics (`44:1261`) | `GreenLogisticsSection.astro` | `green-logistics.webp` | `/images/home/green-logistics.webp` | 16:9 (~540 × 304px) | **READY** |
| `clientAvatar1` | Testimonials (`44:1310`) | `TestimonialsSection.astro` | `client-avatar-1.webp` | `/images/home/client-avatar-1.webp` | 1:1 (44 × 44px) | **READY** |
| `clientAvatar2` | Testimonials (`44:1310`) | `TestimonialsSection.astro` | `client-avatar-2.webp` | `/images/home/client-avatar-2.webp` | 1:1 (44 × 44px) | **READY** |
| `clientAvatar3` | Testimonials (`44:1310`) | `TestimonialsSection.astro` | `client-avatar-3.webp` | `/images/home/client-avatar-3.webp` | 1:1 (44 × 44px) | **READY** |
| `newsThumb1` | News (`44:1513`) | `NewsSection.astro` | `news-thumb-1.webp` | `/images/home/news-thumb-1.webp` | 16:10 (~380 × 238px) | **READY** |
| `newsThumb2` | News (`44:1513`) | `NewsSection.astro` | `news-thumb-2.webp` | `/images/home/news-thumb-2.webp` | 16:10 (~380 × 238px) | **READY** |
| `newsThumb3` | News (`44:1513`) | `NewsSection.astro` | `news-thumb-3.webp` | `/images/home/news-thumb-3.webp` | 16:10 (~380 × 238px) | **READY** |

---

## 3. Danh mục Hình ảnh Trang Về Nam Hân (Phase 1B — Frame `92:731`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `heroVehicle` | Hero (`92:734`) | `AboutHero.astro` | `hero-about-truck.webp` | `/images/about/hero-about-truck.webp` | 4:5 (~520 × 650px) | **READY** |
| `aboutWarehouse` | Intro Nam Hân (`92:790`) | `AboutIntro.astro` | `about-warehouse-man.webp` | `/images/about/about-warehouse-man.webp` | 16:10 (~540 × 340px) | **READY** |
| `facilityBimSon` | Cơ sở vật chất (`92:900`) | `AboutFacilities.astro` | `facility-bim-son.webp` | `/images/about/facility-bim-son.webp` | 16:10 (~380 × 238px) | **READY** |
| `facilityBinhDuong` | Cơ sở vật chất (`92:900`) | `AboutFacilities.astro` | `facility-binh-duong.webp` | `/images/about/facility-binh-duong.webp` | 16:10 (~380 × 238px) | **READY** |
| `facilityHcm` | Cơ sở vật chất (`92:900`) | `AboutFacilities.astro` | `facility-hcm.webp` | `/images/about/facility-hcm.webp` | 16:10 (~380 × 238px) | **READY** |
| `peopleControl` | Đội ngũ (`92:978`) | `AboutPeople.astro` | `people-control-room.webp` | `/images/about/people-control-room.webp` | 16:10 (~500 × 315px) | **READY** |

---

## 4. Danh mục Hình ảnh Trang Dịch Vụ (Phase 1B — Frame `51:575`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `hero` | Hero Banner (`51:603`) | `ServicesHero.astro` | `hero-services.webp` | `/images/services/hero-services.webp` | 16:7 (~1280 × 560px) | **READY** |
| `serviceRoad` | 4 Service Grid (`51:639`) | `ServicesGrid.astro` | `service-road-core.webp` | `/images/services/service-road-core.webp` | 16:10 (~580 × 360px) | **READY** |
| `serviceLogistics` | 4 Service Grid (`51:639`) | `ServicesGrid.astro` | `service-logistics-fleet.webp` | `/images/services/service-logistics-fleet.webp` | 16:10 (~580 × 360px) | **READY** |
| `serviceHandling` | 4 Service Grid (`51:639`) | `ServicesGrid.astro` | `service-handling-forklift.webp` | `/images/services/service-handling-forklift.webp` | 16:10 (~580 × 360px) | **READY** |
| `serviceSolutions` | 4 Service Grid (`51:639`) | `ServicesGrid.astro` | `service-solutions-truck.webp` | `/images/services/service-solutions-truck.webp` | 16:10 (~580 × 360px) | **READY** |

---

## 5. Danh mục Hình ảnh Dịch vụ Vận Tải Đường Bộ (Phase 1B — Frame `84:409`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `hero` | Hero Banner (`84:427`) | `RoadHero.astro` | `hero-road-freight.webp` | `/images/services/road/hero-road-freight.webp` | 16:7 (~1280 × 560px) | **READY** |
| `overviewWarehouse` | Tổng quan Depot (`84:484`) | `RoadOverview.astro` | `depot-warehouse.webp` | `/images/services/road/depot-warehouse.webp` | 16:10 (~540 × 340px) | **READY** |
| `vehicleHead` | Đội xe: Đầu kéo (`84:534`) | `RoadVehicles.astro` | `vehicle-truck-head.webp` | `/images/services/road/vehicle-truck-head.webp` | 16:10 (~280 × 175px) | **READY** |
| `vehicleContainer` | Đội xe: Container (`84:534`) | `RoadVehicles.astro` | `vehicle-container.webp` | `/images/services/road/vehicle-container.webp` | 16:10 (~280 × 175px) | **READY** |
| `vehicleBox` | Đội xe: Tải thùng (`84:534`) | `RoadVehicles.astro` | `vehicle-box-truck.webp` | `/images/services/road/vehicle-box-truck.webp` | 16:10 (~280 × 175px) | **READY** |
| `vehicleTipper` | Đội xe: Xe ben (`84:534`) | `RoadVehicles.astro` | `vehicle-tipper-dump.webp` | `/images/services/road/vehicle-tipper-dump.webp` | 16:10 (~280 × 175px) | **READY** |

---

## 6. Danh mục Hình ảnh Dịch vụ Bốc Xếp & Hỗ Trợ Vận Tải (Phase 1B — Frame `84:1080`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `hero` | Hero Banner (`84:1103`) | `HandlingHero.astro` | `hero-handling.webp` | `/images/services/handling/hero-handling.webp` | 16:11 (~600 × 420px) | **READY** |
| `overview` | Tổng quan Bốc xếp (`84:1178`) | `HandlingOverview.astro` | `overview-handling.webp` | `/images/services/handling/overview-handling.webp` | 16:11 (~540 × 380px) | **READY** |

---

## 7. Danh mục Hình ảnh Dịch vụ Logistics & Giao Nhận (Phase 1B — Frame `84:1720`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `heroBg` | Hero Background (`84:1738`) | `LogisticsHero.astro` | `logistics-hero-bg.webp` | `/images/services/logistics/logistics-hero-bg.webp` | 16:7 (~1280 × 520px) | **READY** |
| `warehouse` | Trung tâm phân phối (`84:1806`) | `LogisticsIntro.astro` | `logistics-warehouse.webp` | `/images/services/logistics/logistics-warehouse.webp` | 16:11 (~580 × 400px) | **READY** |

---

## 8. Danh mục Hình ảnh Dịch vụ Giải Pháp Vận Tải (Phase 1B — Frame `84:2283`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `heroBg` | Hero Background (`84:2305`) | `SolutionsHero.astro` | `solutions-hero-bg.webp` | `/images/services/solutions/solutions-hero-bg.webp` | 16:6 (~1280 × 480px) | **READY** |
| `fleet` | Nhu cầu thực tế (`84:2346`) | `SolutionsTailored.astro` | `solutions-fleet.webp` | `/images/services/solutions/solutions-fleet.webp` | 16:11 (~580 × 380px) | **READY** |
| `modeLtl` | Hình thức Hàng Lẻ (`84:2476`) | `SolutionsModes.astro` | `solutions-mode-ltl.webp` | `/images/services/solutions/solutions-mode-ltl.webp` | 16:10 (~380 × 240px) | **READY** |
| `modeConsolidation` | Hình thức Hàng Ghép (`84:2476`) | `SolutionsModes.astro` | `solutions-mode-consolidation.webp` | `/images/services/solutions/solutions-mode-consolidation.webp` | 16:10 (~380 × 240px) | **READY** |
| `modeFtl` | Hình thức Hàng Bao Xe (`84:2476`) | `SolutionsModes.astro` | `solutions-mode-ftl.webp` | `/images/services/solutions/solutions-mode-ftl.webp` | 16:10 (~380 × 240px) | **READY** |

---

## 9. Danh mục Hình ảnh Trang Liên Hệ (Phase 1B — Frame `101:1816`)

| Asset Key | Figma Section / Node | Component | Tên file WebP | Public URL | Tỷ lệ hiển thị (Aspect Ratio) | Trạng thái |
|---|---|---|---|---|---|---|
| `heroBg` | Hero Background (`101:1823`) | `ContactHero.astro` | `contact-hero-bg.webp` | `/images/contact/contact-hero-bg.webp` | 16:6 (~1280 × 480px) | **READY** |

---

## 10. Brand Identity & Logo Toàn Cục

| Asset Key | Tên file WebP | Public URL | Kích thước | Trạng thái |
|---|---|---|---|---|
| `brandLogo` | `logo-nam-han.webp` | `/images/logo-nam-han.webp` | 81 × 44px | **READY** |
| `brandLogoWide` | `logo-nam-han-wide.webp` | `/images/logo-nam-han-wide.webp` | 286 × 48px | **READY** |
