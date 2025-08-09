'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  LogOut, 
  Plus,
  CheckCircle,
  Star,
  Package,
  Users,
  DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { GroupOrder, OrderParticipant } from '@/types';
import { formatCurrency, getCountryFlag } from '@/lib/constants';
import { getTimeAgo } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

// Mock data for development
const MOCK_USER_ORDERS: GroupOrder[] = [
  {
    id: '1',
    slug: 'coffee-deal-hk',
    manager_id: 'user1',
    country: 'HK',
    title: 'Premium Coffee Beans - Hong Kong',
    description: 'High-quality coffee beans from local roasters.',
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'],
    category: 'Food & Beverages',
    individual_price: 120,
    group_price: 85,
    currency: 'HKD',
    min_orders: 10,
    max_orders: 50,
    current_orders: 7,
    payment_methods: { 'FPS': 'details' },
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
  }
];

const MOCK_PARTICIPATIONS: OrderParticipant[] = [
  {
    id: 'p1',
    order_id: '1',
    user_id: 'user1',
    payment_method: 'FPS',
    payment_status: 'verified',
    payment_amount: 85,
    joined_at: '2024-01-16T09:00:00Z',
    paid_at: '2024-01-16T10:00:00Z',
    verified_at: '2024-01-16T11:00:00Z',
    user: {
      id: 'user1',
      email: 'demo@example.com',
      name: 'Demo User',
      country: 'US',
      accountType: 'buyer',
      rating: 4.5,
      totalOrders: 3,
      created_at: '2024-01-01T00:00:00Z'
    }
  }
];

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, signOut } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'participations' | 'settings'>('overview');
  const [userOrders] = useState<GroupOrder[]>(MOCK_USER_ORDERS);
  const [participations] = useState<OrderParticipant[]>(MOCK_PARTICIPATIONS);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'uploaded':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="info">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/create">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-6">
                {/* User Info */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">
                      {getCountryFlag(user.country)} {user.country}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{user.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Orders Joined</span>
                    <span className="font-semibold">{user.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account Type</span>
                    <Badge variant="default" size="sm">
                      {user.accountType === 'manager' ? 'Manager' : 'Buyer'}
                    </Badge>
                  </div>
                  {user.accountType !== 'manager' && (
                    <div>
                      <Button size="sm" className="w-full mt-2" onClick={async () => {
                        try {
                          const { authService } = await import('@/lib/services/auth');
                          // @ts-ignore
                          await authService.upgradeToManager(user.id);
                          window.location.reload();
                        } catch (err) {
                          console.error(err);
                        }
                      }}>Become a manager</Button>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => setActiveTab('participations')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'participations'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Participations
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Settings
                  </button>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Orders Created</p>
                        <p className="text-2xl font-bold text-gray-900">{userOrders.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Orders Joined</p>
                        <p className="text-2xl font-bold text-gray-900">{participations.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Saved</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(
                            participations.reduce((sum, p) => sum + (p.payment_amount || 0), 0),
                            user.country
                          )}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {participations.slice(0, 3).map((participation) => (
                      <div key={participation.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Joined Coffee Beans Order</p>
                          <p className="text-sm text-gray-600">
                            {getTimeAgo(participation.joined_at)} • {getPaymentStatusBadge(participation.payment_status)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(participation.payment_amount || 0, user.country)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
                  <Link href="/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Order
                    </Button>
                  </Link>
                </div>

                {userOrders.length === 0 ? (
                  <Card>
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Create your first group buy to get started</p>
                      <Link href="/create">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Order
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <Card key={order.id}>
                        <div className="flex items-center gap-4">
                          <img
                            src={order.images[0]}
                            alt={order.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{order.title}</h3>
                            <p className="text-sm text-gray-600">{order.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">
                                {getCountryFlag(order.country)} {order.country}
                              </span>
                              {getStatusBadge(order.status)}
                              <span className="text-sm text-gray-600">
                                {order.current_orders} / {order.min_orders} joined
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">
                              {formatCurrency(order.group_price, order.country)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Deadline: {new Date(order.deadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'participations' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">My Participations</h2>

                {participations.length === 0 ? (
                  <Card>
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No participations yet</h3>
                      <p className="text-gray-600 mb-6">Join group buys to start saving money</p>
                      <Link href="/browse">
                        <Button>
                          Browse Orders
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {participations.map((participation) => (
                      <Card key={participation.id}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Coffee Beans Order</h3>
                            <p className="text-sm text-gray-600">
                              Joined {getTimeAgo(participation.joined_at)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getPaymentStatusBadge(participation.payment_status)}
                              <span className="text-sm text-gray-600">
                                via {participation.payment_method}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-600">
                              {formatCurrency(participation.payment_amount || 0, user.country)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {participation.paid_at ? 'Paid' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                
                <Card>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={user.name || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive updates about your orders</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-600">Receive text message updates</p>
                          </div>
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button>Save Changes</Button>
                      <Button variant="outline">Cancel</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
