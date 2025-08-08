'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  Share2, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { GroupOrder } from '@/types';
import { formatCurrency, getCountryFlag } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Mock order data
const MOCK_ORDER: GroupOrder = {
  id: '1',
  slug: 'coffee-deal-hk',
  manager_id: 'user1',
  country: 'HK',
  title: 'Premium Coffee Beans - Hong Kong',
  description: 'High-quality coffee beans from local roasters. Perfect for coffee lovers! This is a limited-time group order with amazing savings. Join now before it fills up!',
  images: [
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'
  ],
  category: 'Food & Beverages',
  individual_price: 120,
  group_price: 85,
  currency: 'HKD',
  min_orders: 10,
  max_orders: 50,
  current_orders: 7,
  payment_methods: { 
    'FPS': 'FPS ID: 12345678', 
    'PayMe': 'PayMe ID: 87654321',
    'Bank Transfer': 'Bank: HSBC, Acc: 123-456789-001'
  },
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
  },
  participants: [
    {
      id: 'p1',
      order_id: '1',
      user_id: 'user2',
      payment_method: 'FPS',
      payment_status: 'verified',
      payment_amount: 85,
      joined_at: '2024-01-16T09:00:00Z',
      paid_at: '2024-01-16T10:00:00Z',
      verified_at: '2024-01-16T11:00:00Z',
      user: {
        id: 'user2',
        email: 'john@example.com',
        name: 'John Doe',
        country: 'HK',
        accountType: 'buyer',
        rating: 4.5,
        totalOrders: 3,
        created_at: '2024-01-10T00:00:00Z'
      }
    },
    {
      id: 'p2',
      order_id: '1',
      user_id: 'user3',
      payment_method: 'PayMe',
      payment_status: 'uploaded',
      payment_amount: 85,
      joined_at: '2024-01-16T14:00:00Z',
      paid_at: '2024-01-16T15:00:00Z',
      user: {
        id: 'user3',
        email: 'jane@example.com',
        name: 'Jane Smith',
        country: 'HK',
        accountType: 'buyer',
        rating: 4.7,
        totalOrders: 8,
        created_at: '2024-01-05T00:00:00Z'
      }
    }
  ]
};

const OrderPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppStore();
  
  const [order] = useState<GroupOrder>(MOCK_ORDER);
  const [isJoining, setIsJoining] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const calculateSavings = () => {
    if (!order.individual_price || !order.group_price) return 0;
    return ((order.individual_price - order.group_price) / order.individual_price) * 100;
  };

  const getDaysLeft = () => {
    const deadlineDate = new Date(order.deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleJoinOrder = () => {
    if (!user) {
      // Redirect to sign up/login
      alert('Please sign in to join this order');
      return;
    }
    setIsJoining(true);
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedPaymentMethod || !paymentProof) {
      alert('Please select a payment method and upload proof');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setShowPaymentModal(false);
    alert('Payment proof uploaded successfully! The manager will verify it soon.');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: order.title,
        text: `Join this group order and save ${calculateSavings().toFixed(0)}%!`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const isUserJoined = order.participants?.some(p => p.user_id === user?.id);
  const isOrderFull = order.current_orders >= order.max_orders;
  const daysLeft = getDaysLeft();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {getCountryFlag(order.country)} {order.country}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{order.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {!user && (
                <Button size="sm">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Images */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={order.images[0]}
                  alt={order.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {calculateSavings().toFixed(0)}% OFF
                </div>
              </div>
            </div>

            {/* Order Details */}
            <Card>
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">{order.title}</h1>
                
                {order.description && (
                  <p className="text-gray-600 leading-relaxed">{order.description}</p>
                )}

                {/* Pricing */}
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <div>
                    <span className="text-3xl font-bold text-emerald-600">
                      {formatCurrency(order.group_price, order.country)}
                    </span>
                    {order.individual_price && (
                      <span className="text-lg text-gray-500 line-through ml-3">
                        {formatCurrency(order.individual_price, order.country)}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-emerald-600">
                      Save {formatCurrency((order.individual_price || 0) - order.group_price, order.country)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {calculateSavings().toFixed(0)}% discount
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="font-semibold">
                      {order.current_orders} / {order.min_orders} joined
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((order.current_orders / order.min_orders) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Need {order.min_orders - order.current_orders} more people to join
                  </p>
                </div>

                {/* Manager Info */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Manager</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-600">
                        {order.manager?.name?.charAt(0) || 'M'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {order.manager?.name || 'Manager'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{order.manager?.rating?.toFixed(1) || '4.5'}</span>
                        <span>•</span>
                        <span>{order.manager?.totalOrders || 0} orders managed</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Participants */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Participants ({order.participants?.length || 0})</h3>
              <div className="space-y-3">
                {order.participants?.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {participant.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {participant.user?.name || 'User'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Joined {new Date(participant.joined_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {participant.payment_status === 'verified' && (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      )}
                      {participant.payment_status === 'uploaded' && (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-sm text-gray-600">
                        {participant.payment_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Join This Order</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{daysLeft} days left</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Group Price</span>
                    <span className="font-semibold">
                      {formatCurrency(order.group_price, order.country)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">You Save</span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency((order.individual_price || 0) - order.group_price, order.country)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-semibold">
                      {new Date(order.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isUserJoined ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-900">
                        You&apos;re joined!
                      </span>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleJoinOrder}
                    className="w-full"
                    disabled={isOrderFull}
                    loading={isJoining}
                  >
                    {isOrderFull ? 'Order Full' : 'Join Order'}
                  </Button>
                )}
              </div>
            </Card>

            {/* Payment Methods */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                {Object.entries(order.payment_methods).map(([method, details]) => (
                  <div key={method} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{method}</div>
                      <div className="text-sm text-gray-600">{details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Order</h3>
            
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="space-y-2">
                  {Object.entries(order.payment_methods).map(([method, details]) => (
                    <button
                      key={method}
                      onClick={() => handlePaymentMethodSelect(method)}
                      className={`w-full p-3 border rounded-lg text-left transition-colors ${
                        selectedPaymentMethod === method
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{method}</div>
                      <div className="text-sm text-gray-600">{details}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Proof
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload screenshot or PDF of your payment confirmation
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitPayment}
                  className="flex-1"
                  loading={isUploading}
                  disabled={!selectedPaymentMethod || !paymentProof}
                >
                  Submit Payment
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
