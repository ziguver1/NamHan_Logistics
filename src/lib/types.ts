/**
 * Core Domain Types & Data Contracts - NAM HÂN LOGISTICS
 * Based on docs/02-ARCHITECTURE.md and docs/05-FORMS-DATA.md
 */

export type LeadRequestType = 'shipment_quote' | 'handling_quote' | 'route_inquiry';

export type CustomerType = 'individual' | 'business';

export type SubmissionState = 'idle' | 'invalid' | 'submitting' | 'success' | 'error' | 'demo-not-connected';

/**
 * Normalized Lead Data Contract
 * Superset of all fields across 3 lead entry points
 */
export interface NormalizedLead {
  request_type: LeadRequestType;
  customer_type?: CustomerType;
  contact_name: string;
  phone_zalo: string;
  origin?: string;
  destination?: string;
  cargo_description?: string;
  cargo_volume?: string;
  handling_location?: string;
  equipment_need?: string;
  source_page: string;
  consent?: 'yes' | 'no';
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavigationItem[];
}

export interface CompanyInfo {
  name: string;
  shortName: string;
  tagline: string;
  hotline: string;
  email: string;
  address: string;
  businessHours: string;
  taxCode?: string;
}

export interface ServiceSummary {
  id: string;
  title: string;
  shortDescription: string;
  href: string;
  iconName?: string;
}
