'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Globe, Users, Clock, DollarSign, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { GroupOrder, CountryCode } from '@/types';
import { getAllCountries, formatCurrency, getCountryFlag } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Mock data for development
const MOCK_ORDERS: GroupOrder[] = [
  {
    id: '1',
    slug: 'coffee-deal-hk',
    manager_id: 'user1',
    country: 'HK',
    title: 'Premium Coffee Beans - Hong Kong',
    description: 'High-quality coffee beans from local roasters. Perfect for coffee lovers!',
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'],
    category: 'Food & Beverages',
    individual_price: 120,
    group_price: 85,
    currency: 'HKD',
    min_orders: 10,
    max_orders: 50,
    current_orders: 7,
    payment_methods: { 'FPS': 'details', 'PayMe': 'details' },
    status: 'active',
    deadline: '2024-02-15',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    manager: {
      id: 'user1',
      email: 'sarah@example.com',
      name: 'Sarah Chen',
      country: 'HK',
      accountType: 'manager',
      rating: 4.8,
      totalOrders: 15,
      created_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '2',
    slug: 'tech-gadgets-sg',
    manager_id: 'user2',
    country: 'SG',
    title: 'Wireless Earbuds - Singapore',
    description: 'Premium wireless earbuds with noise cancellation. Great deal for tech enthusiasts!',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
    category: 'Electronics',
    individual_price: 299,
    group_price: 199,
    currency: 'SGD',
    min_orders: 15,
    max_orders: 100,
    current_orders: 12,
    payment_methods: { 'PayNow': 'details', 'GrabPay': 'details' },
    status: 'active',
    deadline: '2024-02-20',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    manager: {
      id: 'user2',
      email: 'mike@example.com',
      name: 'Mike Rodriguez',
      country: 'SG',
      accountType: 'manager',
      rating: 4.6,
      totalOrders: 8,
      created_at: '2024-01-05T00:00:00Z'
    }
  },
  {
    id: '3',
    slug: 'fitness-equipment-us',
    manager_id: 'user3',
    country: 'US',
    title: 'Home Gym Equipment Set',
    description: 'Complete home gym setup including weights, bench, and resistance bands.',
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
    category: 'Sports & Outdoors',
    individual_price: 599,
    group_price: 399,
    currency: 'USD',
    min_orders: 8,
    max_orders: 30,
    current_orders: 5,
    payment_methods: { 'Venmo': 'details', 'Zelle': 'details' },
    status: 'active',
    deadline: '2024-02-25',
    created_at: '2024-01-12T09:15:00Z',
    updated_at: '2024-01-12T09:15:00Z',
    manager: {
      id: 'user3',
      email: 'emma@example.com',
      name: 'Emma Thompson',
      country: 'US',
      accountType: 'manager',
      rating: 4.9,
      totalOrders: 22,
      created_at: '2023-12-01T00:00:00Z'
    }
  }
];

const BrowsePage: React.FC = () => {
  const { userCountry, browseFilters, setBrowseFilters } = useAppStore();
  const [orders, setOrders] = useState<GroupOrder[]>(MOCK_ORDERS);
  const [filteredOrders, setFilteredOrders] = useState<GroupOrder[]>(MOCK_ORDERS);
  const [isLoading, setIsLoading] = useState(false);

  // Filter orders based on current filters
  useEffect(() => {
    let filtered = orders;

    // Filter by country
    if (browseFilters.country !== 'all') {
      filtered = filtered.filter(order => order.country === browseFilters.country);
    }

    // Filter by category
    if (browseFilters.category !== 'all') {
      filtered = filtered.filter(order => order.category === browseFilters.category);
    }

    // Filter by minimum savings
    filtered = filtered.filter(order => {
      const savings = order.individual_price && order.group_price 
        ? ((order.individual_price - order.group_price) / order.individual_price) * 100
        : 0;
      return savings >= browseFilters.minSavings;
    });

    // Filter by maximum price
    if (browseFilters.maxPrice) {
      filtered = filtered.filter(order => order.group_price <= browseFilters.maxPrice!);
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (browseFilters.sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'ending_soon':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'most_popular':
          return (b.current_orders / b.max_orders) - (a.current_orders / a.max_orders);
        case 'highest_savings':
          const savingsA = a.individual_price && a.group_price 
            ? ((a.individual_price - a.group_price) / a.individual_price) * 100
            : 0;
          const savingsB = b.individual_price && b.group_price 
            ? ((b.individual_price - b.group_price) / b.individual_price) * 100
            : 0;
          return savingsB - savingsA;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, browseFilters]);

  const calculateSavings = (order: GroupOrder) => {
    if (!order.individual_price || !order.group_price) return 0;
    return ((order.individual_price - order.group_price) / order.individual_price) * 100;
  };

  const getDaysLeft = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleJoinOrder = (order: GroupOrder) => {
    // In a real app, this would redirect to the order page
    window.location.href = `/o/${order.country.toLowerCase()}/${order.slug}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-emerald-600">GOMFLOW</h1>
              <div className="h-6 w-px bg-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900">Browse Orders</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {getCountryFlag(userCountry)} {userCountry}
              </span>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Create Order
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Country Filter */}
            <select
              value={browseFilters.country}
              onChange={(e) => setBrowseFilters({ country: e.target.value as CountryCode | 'all' })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Countries</option>
              {getAllCountries().map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={browseFilters.category}
              onChange={(e) => setBrowseFilters({ category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Beauty & Health">Beauty & Health</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Food & Beverages">Food & Beverages</option>
            </select>

            {/* Sort */}
            <select
              value={browseFilters.sortBy}
              onChange={(e) => setBrowseFilters({ sortBy: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="ending_soon">Ending Soon</option>
              <option value="most_popular">Most Popular</option>
              <option value="highest_savings">Highest Savings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  {/* Order Image */}
                  <div className="relative mb-4">
                    <img
                      src={order.images[0] || 'https://via.placeholder.com/400x300'}
                      alt={order.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {getCountryFlag(order.country)} {order.country}
                    </div>
                    <div className="absolute top-2 right-2 bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold">
                      {order.category}
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                      {order.title}
                    </h3>
                    
                    {order.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {order.description}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(order.group_price, order.country)}
                        </span>
                        {order.individual_price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatCurrency(order.individual_price, order.country)}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-600">
                          {calculateSavings(order).toFixed(0)}% OFF
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">
                          {order.current_orders} / {order.min_orders} joined
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((order.current_orders / order.min_orders) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Manager Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-600">
                            {order.manager?.name?.charAt(0) || 'M'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.manager?.name || 'Manager'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">
                              {order.manager?.rating?.toFixed(1) || '4.5'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{getDaysLeft(order.deadline)} days left</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleJoinOrder(order)}
                      className="w-full"
                      disabled={order.current_orders >= order.max_orders}
                    >
                      {order.current_orders >= order.max_orders ? 'Order Full' : 'Join Order'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
