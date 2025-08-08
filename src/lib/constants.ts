import { CountryCode, CountryConfig } from '@/types';

// Country configurations
export const COUNTRY_CONFIGS: Record<CountryCode, CountryConfig> = {
  // Southeast Asia
  ID: {
    code: 'ID',
    name: 'Indonesia',
    currency: 'IDR',
    locale: 'id-ID',
    flag: '🇮🇩',
    paymentMethods: ['GoPay', 'OVO', 'Bank Transfer', 'DANA']
  },
  MY: {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    locale: 'ms-MY',
    flag: '🇲🇾',
    paymentMethods: ['Maybank', 'Touch n Go', 'GrabPay', 'Bank Transfer']
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    locale: 'en-SG',
    flag: '🇸🇬',
    paymentMethods: ['PayNow', 'GrabPay', 'Bank Transfer', 'Paylah']
  },
  
  // East Asia
  HK: {
    code: 'HK',
    name: 'Hong Kong',
    currency: 'HKD',
    locale: 'zh-HK',
    flag: '🇭🇰',
    paymentMethods: ['FPS', 'PayMe', 'Bank Transfer', 'Octopus']
  },
  TW: {
    code: 'TW',
    name: 'Taiwan',
    currency: 'TWD',
    locale: 'zh-TW',
    flag: '🇹🇼',
    paymentMethods: ['Line Pay', 'Bank Transfer', 'JKOPay', 'FamiPay']
  },
  
  // Americas
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    locale: 'en-US',
    flag: '🇺🇸',
    paymentMethods: ['Venmo', 'Zelle', 'CashApp', 'PayPal']
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    locale: 'en-CA',
    flag: '🇨🇦',
    paymentMethods: ['Interac', 'PayPal', 'Bank Transfer', 'Paymi']
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    currency: 'BRL',
    locale: 'pt-BR',
    flag: '🇧🇷',
    paymentMethods: ['PIX', 'Boleto', 'Bank Transfer', 'PicPay']
  },
  AR: {
    code: 'AR',
    name: 'Argentina',
    currency: 'ARS',
    locale: 'es-AR',
    flag: '🇦🇷',
    paymentMethods: ['MercadoPago', 'Bank Transfer', 'Ualá', 'MODO']
  },
  MX: {
    code: 'MX',
    name: 'Mexico',
    currency: 'MXN',
    locale: 'es-MX',
    flag: '🇲🇽',
    paymentMethods: ['OXXO', 'MercadoPago', 'Bank Transfer', 'CoDi']
  },
  
  // Europe
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    locale: 'en-GB',
    flag: '🇬🇧',
    paymentMethods: ['Bank Transfer', 'PayPal', 'Revolut', 'Monzo']
  },
  FR: {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    locale: 'fr-FR',
    flag: '🇫🇷',
    paymentMethods: ['Bank Transfer', 'PayPal', 'Lydia', 'PayLib']
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    locale: 'de-DE',
    flag: '🇩🇪',
    paymentMethods: ['SEPA', 'PayPal', 'Giropay', 'Sofort']
  },
  
  // Oceania
  AU: {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    locale: 'en-AU',
    flag: '🇦🇺',
    paymentMethods: ['PayID', 'Bank Transfer', 'PayPal', 'Beem It']
  }
};

// Product categories
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Beauty & Health',
  'Sports & Outdoors',
  'Books & Media',
  'Food & Beverages',
  'Automotive',
  'Toys & Games',
  'Office & Business',
  'Other'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Order statuses
export const ORDER_STATUSES = ['active', 'closed', 'completed', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

// Payment statuses
export const PAYMENT_STATUSES = ['pending', 'uploaded', 'verified', 'rejected'] as const;
export type PaymentStatus = typeof PAYMENT_STATUSES[number];

// Request statuses
export const REQUEST_STATUSES = ['open', 'picked_up', 'fulfilled'] as const;
export type RequestStatus = typeof REQUEST_STATUSES[number];

// Account types
export const ACCOUNT_TYPES = ['buyer', 'manager'] as const;
export type AccountType = typeof ACCOUNT_TYPES[number];

// Default values
export const DEFAULT_VALUES = {
  MIN_ORDERS: 5,
  MAX_ORDERS: 100,
  ORDER_DURATION_DAYS: 7,
  PAYMENT_DEADLINE_DAYS: 3,
  MAX_IMAGES: 5,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500
} as const;

// API endpoints
export const API_ENDPOINTS = {
  ORDERS: '/api/orders',
  PAYMENTS: '/api/payments',
  AI: '/api/ai',
  SCRAPE: '/api/scrape',
  GEO: '/api/geo',
  REQUESTS: '/api/requests'
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_AI: process.env.NEXT_PUBLIC_ENABLE_AI === 'true',
  ENABLE_STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
} as const;

// Utility functions
export function getCountryConfig(country: CountryCode): CountryConfig {
  return COUNTRY_CONFIGS[country];
}

export function getAllCountries(): CountryConfig[] {
  return Object.values(COUNTRY_CONFIGS);
}

export function formatCurrency(amount: number, country: CountryCode): string {
  const config = getCountryConfig(country);
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency
  }).format(amount);
}

export function getCountryFlag(country: CountryCode): string {
  return getCountryConfig(country).flag;
}

export function getPaymentMethods(country: CountryCode): string[] {
  return getCountryConfig(country).paymentMethods;
}
