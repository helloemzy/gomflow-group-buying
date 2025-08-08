# GOMFLOW MVP

> Group buying made as simple as creating an event on lu.ma

GOMFLOW is a group buying platform that makes organizing bulk purchases delightfully simple. Users paste a product URL, invite friends, and save 30-70% on shipping costs by combining orders.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd gomflow-mvp
npm install
```

2. **Set up environment variables**
Create a `.env.local` file in the root directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Core Features

### ✅ Implemented (MVP)
- **Split-screen creation flow** - Form on left, real-time preview on right
- **Magic URL detection** - Auto-detects products from Amazon, Walmart, Target, Costco, Best Buy
- **Real-time preview** - See exactly what participants will see as you type
- **Responsive design** - Works on desktop and mobile
- **Delightful animations** - Framer Motion powered interactions
- **Smart defaults** - Pre-filled with reasonable values
- **User authentication** - Login and signup flows with mock authentication
- **User dashboard** - Profile management, order tracking, and settings
- **AI-powered features** - Pricing and shipping optimization assistants
- **Browse functionality** - Filter and search through group orders
- **Order detail pages** - Complete order information with payment flow
- **Legal pages** - Terms of Service and Privacy Policy
- **API routes** - Product scraping endpoint for development

### 🚧 Coming Soon
- Database integration with Supabase
- Real payment processing
- Email notifications
- Push notifications
- Advanced analytics
- Mobile app

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

### Key Components
- `src/components/ui/` - Reusable UI components
- `src/components/forms/` - Form-specific components
- `src/lib/` - Utilities and services
- `src/types/` - TypeScript type definitions
- `src/app/` - Next.js app router pages

## 🎨 Design System

### Colors
- **Primary**: Emerald (`#10b981`)
- **Neutral**: Gray scale
- **Accent**: Amber for urgency, Red for alerts

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Tailwind's default scale

### Components
- **Buttons**: Primary, secondary, outline, ghost variants
- **Inputs**: With loading, success, error states
- **Cards**: Hover effects and consistent spacing

## 🧪 Testing the MVP

### Demo URLs
Try these URLs in the creation flow:
- `https://amazon.com/dp/B08N5WRWNW` (Coffee beans)
- `https://walmart.com/ip/123456` (Bulk coffee)
- `https://target.com/p/123456` (Coffee subscription)
- `https://costco.com/item/123456` (Kirkland coffee)
- `https://bestbuy.com/site/123456` (Coffee maker)

### Key User Flows
1. **Create Group Buy**: Visit `/create` and try the split-screen experience
2. **URL Detection**: Paste any of the demo URLs above
3. **Real-time Preview**: Watch the preview update as you type
4. **Mobile Experience**: Test on mobile devices

## 📊 Success Metrics

### Week 1 Targets
- [ ] 100 users sign up
- [ ] 50 users create a group buy
- [ ] 30 group buys get shared
- [ ] Creation completion rate >80%
- [ ] Time to create <2 minutes

### Month 1 Targets
- [ ] 1,000 total users
- [ ] 200 active group buys
- [ ] 50 completed successfully
- [ ] Average group size: 8 people
- [ ] Completion rate >60%

## 🚨 Critical Implementation Notes

### For Development Team

1. **START WITH THE CREATION FLOW**
   - This is the heart of the product
   - If this isn't delightful, nothing else matters
   - Copy lu.ma's split-screen pattern EXACTLY

2. **REAL-TIME IS NON-NEGOTIABLE**
   - Form changes must update preview instantly
   - Use optimistic updates everywhere
   - No loading spinners between form and preview

3. **MOBILE-FIRST RESPONSIVE**
   - 60% of shares will be opened on mobile
   - Creation should work on mobile (different UX)
   - Test on real devices, not just browser

4. **PERFORMANCE TARGETS**
   - First paint: <1.5s
   - Interactive: <3s
   - Lighthouse score: 90+

5. **SHIP WEEKLY**
   - Every Friday, deploy to production
   - Real users, real feedback
   - Iterate based on data, not opinions

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── create/            # Group buy creation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── forms/            # Form-specific components
├── lib/                  # Utilities and services
│   ├── store.ts          # Zustand state management
│   ├── supabase.ts       # Supabase client
│   └── productDetection.ts # Product URL detection
└── types/                # TypeScript definitions
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.gomflow.com](https://docs.gomflow.com)
- **Issues**: [GitHub Issues](https://github.com/gomflow/mvp/issues)
- **Discord**: [Join our community](https://discord.gg/gomflow)

---

**Built with ❤️ by the GOMFLOW team**
