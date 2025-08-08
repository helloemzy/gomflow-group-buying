export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  title: string;
  price: number;
  original_price?: number;
  shipping_cost: number;
  images: string[];
  url: string;
  retailer: string;
}

export interface GroupBuy {
  id: string;
  slug: string;
  organizer_id: string;
  product_url: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  shipping_cost: number;
  min_participants: number;
  max_participants: number;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  organizer?: User;
  participants?: Participant[];
  product?: Product;
}

export interface Participant {
  id: string;
  group_buy_id: string;
  user_id: string;
  status: 'joined' | 'purchased' | 'verified';
  proof_url?: string;
  joined_at: string;
  user?: User;
}

export interface CreateGroupBuyData {
  product_url: string;
  title: string;
  description?: string;
  min_participants: number;
  max_participants: number;
  deadline: string;
}

export interface ProductDetectionResult {
  success: boolean;
  product?: Product;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
