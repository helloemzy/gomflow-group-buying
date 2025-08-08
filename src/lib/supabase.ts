import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      group_buys: {
        Row: {
          id: string;
          slug: string;
          organizer_id: string;
          product_url: string;
          title: string;
          description: string | null;
          price: number | null;
          original_price: number | null;
          shipping_cost: number | null;
          min_participants: number;
          max_participants: number;
          deadline: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          organizer_id: string;
          product_url: string;
          title: string;
          description?: string | null;
          price?: number | null;
          original_price?: number | null;
          shipping_cost?: number | null;
          min_participants?: number;
          max_participants?: number;
          deadline: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          organizer_id?: string;
          product_url?: string;
          title?: string;
          description?: string | null;
          price?: number | null;
          original_price?: number | null;
          shipping_cost?: number | null;
          min_participants?: number;
          max_participants?: number;
          deadline?: string;
          status?: string;
          created_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          group_buy_id: string;
          user_id: string;
          status: string;
          proof_url: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_buy_id: string;
          user_id: string;
          status?: string;
          proof_url?: string | null;
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_buy_id?: string;
          user_id?: string;
          status?: string;
          proof_url?: string | null;
          joined_at?: string;
        };
      };
    };
  };
};
