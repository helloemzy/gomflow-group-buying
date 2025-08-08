# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Configure Environment Variables

Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create all tables, indexes, and policies

## 4. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.vercel.app/auth/callback`

## 5. Test the Integration

1. Start your development server: `npm run dev`
2. Try signing up a new user
3. Check the Supabase dashboard to see the user in the `auth.users` table
4. Verify the user profile is created in the `public.users` table

## 6. Deploy to Production

1. Add your production environment variables to Vercel
2. Update your Supabase redirect URLs to include your production domain
3. Deploy your application

## Database Schema Overview

### Tables Created:
- `users` - Extended user profiles
- `group_orders` - Group buy orders
- `order_participants` - Users participating in orders
- `product_requests` - Product request wall
- `request_votes` - Votes on product requests

### Security Features:
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access their own data
- Public read access for active orders and product requests

### Key Features:
- Automatic user profile creation on signup
- Real-time order updates
- Payment verification workflow
- Product request system
- User statistics tracking

## Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Check your environment variables are correct
   - Ensure you're using the anon key, not the service role key

2. **"User not found" after signup**
   - Check the database triggers are working
   - Verify the user profile is being created

3. **RLS policy errors**
   - Ensure all policies are created correctly
   - Check that auth.uid() is available

4. **Middleware redirects not working**
   - Verify your middleware configuration
   - Check the matcher patterns in `middleware.ts`

## Next Steps

After setting up Supabase:

1. **Payment Integration** - Add Stripe/PayPal
2. **File Upload** - Configure Supabase Storage
3. **Email Notifications** - Set up email service
4. **Real-time Features** - Enable real-time subscriptions
5. **Analytics** - Add user behavior tracking
