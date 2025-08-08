-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  account_type TEXT NOT NULL DEFAULT 'buyer' CHECK (account_type IN ('buyer', 'manager')),
  avatar_url TEXT,
  phone TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_orders table
CREATE TABLE IF NOT EXISTS public.group_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  manager_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  country TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  individual_price DECIMAL(10,2),
  group_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  min_orders INTEGER NOT NULL DEFAULT 5,
  max_orders INTEGER NOT NULL DEFAULT 100,
  current_orders INTEGER DEFAULT 0,
  payment_methods JSONB DEFAULT '{}',
  payment_deadline TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed', 'cancelled')),
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_participants table
CREATE TABLE IF NOT EXISTS public.order_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.group_orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  payment_method TEXT,
  payment_proof_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'uploaded', 'verified', 'rejected')),
  payment_amount DECIMAL(10,2),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users(id),
  UNIQUE(order_id, user_id)
);

-- Create product_requests table
CREATE TABLE IF NOT EXISTS public.product_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  country TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_url TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  me_too_count INTEGER DEFAULT 0,
  fulfilled_by UUID REFERENCES public.group_orders(id),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'picked_up', 'fulfilled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create request_votes table
CREATE TABLE IF NOT EXISTS public.request_votes (
  request_id UUID REFERENCES public.product_requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (request_id, user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_group_orders_country ON public.group_orders(country);
CREATE INDEX IF NOT EXISTS idx_group_orders_status ON public.group_orders(status);
CREATE INDEX IF NOT EXISTS idx_group_orders_manager ON public.group_orders(manager_id);
CREATE INDEX IF NOT EXISTS idx_group_orders_created ON public.group_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_participants_order ON public.order_participants(order_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON public.order_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_status ON public.order_participants(payment_status);
CREATE INDEX IF NOT EXISTS idx_requests_country ON public.product_requests(country);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.product_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Group orders policies
CREATE POLICY "Anyone can view active orders" ON public.group_orders
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view their own orders" ON public.group_orders
  FOR SELECT USING (auth.uid() = manager_id);

CREATE POLICY "Users can create orders" ON public.group_orders
  FOR INSERT WITH CHECK (auth.uid() = manager_id);

CREATE POLICY "Users can update their own orders" ON public.group_orders
  FOR UPDATE USING (auth.uid() = manager_id);

-- Order participants policies
CREATE POLICY "Users can view participants of their orders" ON public.order_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_orders 
      WHERE id = order_participants.order_id 
      AND manager_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own participations" ON public.order_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can join orders" ON public.order_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Order managers can update participants" ON public.order_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.group_orders 
      WHERE id = order_participants.order_id 
      AND manager_id = auth.uid()
    )
  );

-- Product requests policies
CREATE POLICY "Anyone can view product requests" ON public.product_requests
  FOR SELECT USING (true);

CREATE POLICY "Users can create product requests" ON public.product_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their own requests" ON public.product_requests
  FOR UPDATE USING (auth.uid() = requester_id);

-- Request votes policies
CREATE POLICY "Anyone can view votes" ON public.request_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can vote" ON public.request_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_orders_updated_at BEFORE UPDATE ON public.group_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total orders for managers
  IF TG_OP = 'INSERT' THEN
    UPDATE public.users 
    SET total_orders = total_orders + 1
    WHERE id = NEW.manager_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.users 
    SET total_orders = total_orders - 1
    WHERE id = OLD.manager_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger for user stats
CREATE TRIGGER update_user_order_stats 
  AFTER INSERT OR DELETE ON public.group_orders
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();
