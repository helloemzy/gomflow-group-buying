// Country and localization types
export type CountryCode = 'ID' | 'MY' | 'SG' | 'HK' | 'TW' | 'US' | 'CA' | 'BR' | 'AR' | 'MX' | 'GB' | 'FR' | 'DE' | 'AU';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  currency: string;
  locale: string;
  flag: string;
  paymentMethods: string[];
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  country: CountryCode;
  accountType: 'buyer' | 'manager';
  avatar_url?: string;
  phone?: string;
  rating: number;
  totalOrders: number;
  created_at: string;
}

// Product and order types
export interface Product {
  title: string;
  price: number;
  original_price?: number;
  shipping_cost: number;
  images: string[];
  url: string;
  retailer: string;
  category?: string;
}

export interface GroupOrder {
  id: string;
  slug: string;
  manager_id: string;
  country: CountryCode;
  
  // Product details
  product_url?: string;
  title: string;
  description?: string;
  images: string[];
  category?: string;
  
  // Pricing
  individual_price?: number;
  group_price: number;
  currency: string;
  
  // Capacity
  min_orders: number;
  max_orders: number;
  current_orders: number;
  
  // Payment
  payment_methods: Record<string, any>;
  payment_deadline?: string;
  
  // Status
  status: 'active' | 'closed' | 'completed' | 'cancelled';
  deadline: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  manager?: User;
  participants?: OrderParticipant[];
  product?: Product;
}

export interface OrderParticipant {
  id: string;
  order_id: string;
  user_id: string;
  
  // Payment
  payment_method?: string;
  payment_proof_url?: string;
  payment_status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  payment_amount?: number;
  
  // Status
  joined_at: string;
  paid_at?: string;
  verified_at?: string;
  verified_by?: string;
  
  // Relations
  user?: User;
}

// Request wall types
export interface ProductRequest {
  id: string;
  requester_id: string;
  country: CountryCode;
  
  product_name: string;
  product_url?: string;
  description?: string;
  images: string[];
  
  // Demand tracking
  me_too_count: number;
  fulfilled_by?: string;
  
  status: 'open' | 'picked_up' | 'fulfilled';
  created_at: string;
  
  // Relations
  requester?: User;
  votes?: RequestVote[];
}

export interface RequestVote {
  request_id: string;
  user_id: string;
  created_at: string;
}

// AI Agent types
export interface PricingRequest {
  productCost: number;
  shippingCost: number;
  country: CountryCode;
  minOrders: number;
  category?: string;
}

export interface PricingResponse {
  recommendedPrice: number;
  breakEvenPrice: number;
  profitMargin: number;
  pricePoints: {
    conservative: number;
    balanced: number;
    aggressive: number;
  };
  reasoning: string;
}

export interface ShippingRequest {
  orders: Array<{
    address: string;
    items: number;
  }>;
  country: CountryCode;
  weight: number;
}

export interface ShippingResponse {
  providers: Array<{
    name: string;
    cost: number;
    duration: string;
    reliability: number;
  }>;
  recommendations: string;
  bulkDiscounts: Array<{
    quantity: number;
    discount: number;
  }>;
}

// Form and creation types
export interface CreateOrderData {
  product_url?: string;
  title: string;
  description?: string;
  images: string[];
  category?: string;
  country: CountryCode;
  individual_price?: number;
  group_price: number;
  min_orders: number;
  max_orders: number;
  payment_methods: Record<string, any>;
  payment_deadline?: string;
  deadline: string;
}

export interface ProductDetectionResult {
  success: boolean;
  product?: Product;
  error?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Legacy types for backward compatibility
export interface GroupBuy extends GroupOrder {}
export interface Participant extends OrderParticipant {}
export interface CreateGroupBuyData extends CreateOrderData {}
