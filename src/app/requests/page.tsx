'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, ThumbsUp, Globe, Filter } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { CountryCode, ProductRequest } from '@/types';
import { getAllCountries, getCountryFlag } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { requestService } from '@/lib/services/requests';
import NotificationBell from '@/components/notifications/NotificationBell';

const RequestsPage: React.FC = () => {
  const { userCountry, user } = useAppStore();
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [country, setCountry] = useState<CountryCode | 'all'>(userCountry || 'US');
  const [status, setStatus] = useState<'open' | 'picked_up' | 'fulfilled' | 'all'>('open');

  // Create request form state
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    product_name: '',
    product_url: '',
    description: '',
    images: [] as string[],
    country: userCountry || 'US',
  });

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await requestService.listRequests(
        {
          country: country === 'all' ? undefined : country,
          status: status === 'all' ? undefined : status,
        },
        search
      );
      setRequests(list);
    } catch (e: any) {
      setError(e.message || 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, status]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await requestService.createRequest(createForm);
      setIsCreating(false);
      setCreateForm({ product_name: '', product_url: '', description: '', images: [], country: userCountry || 'US' });
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (req: ProductRequest) => {
    if (!user) {
      alert('Please sign in to vote');
      return;
    }
    try {
      await requestService.vote(req.id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return requests;
    const q = search.toLowerCase();
    return requests.filter(r =>
      r.product_name.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q) ||
      (r.product_url || '').toLowerCase().includes(q)
    );
  }, [requests, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-emerald-600">GOMFLOW</h1>
              <div className="h-6 w-px bg-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900">Product Requests</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {getCountryFlag(userCountry)} {userCountry}
              </span>
              <Link href="/browse">
                <Button variant="outline" size="sm">Browse</Button>
              </Link>
              <Link href="/create">
                <Button size="sm">Create Order</Button>
              </Link>
              <NotificationBell />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requested products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as CountryCode | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Countries</option>
              {getAllCountries().map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="open">Open</option>
              <option value="picked_up">Picked Up</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="all">All</option>
            </select>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" /> New Request
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No product requests</h3>
            <p className="text-gray-600">Be the first to request a product for your country.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((req) => (
              <motion.div key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs bg-gray-100 rounded px-2 py-1">
                      {getCountryFlag(req.country)} {req.country}
                    </div>
                    <Badge variant={req.status === 'open' ? 'info' : req.status === 'picked_up' ? 'warning' : 'success'}>
                      {req.status === 'open' ? 'Open' : req.status === 'picked_up' ? 'Picked Up' : 'Fulfilled'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{req.product_name}</h3>
                  {req.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-3">{req.description}</p>
                  )}
                  {req.product_url && (
                    <a href={req.product_url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 mt-2">
                      View product ↗
                    </a>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">{req.me_too_count} want this</div>
                    <Button size="sm" onClick={() => handleVote(req)}>
                      <ThumbsUp className="w-4 h-4 mr-2" /> Me too
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCreating(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">New Product Request</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  value={createForm.product_name}
                  onChange={(e) => setCreateForm({ ...createForm, product_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product URL (optional)</label>
                <input
                  value={createForm.product_url}
                  onChange={(e) => setCreateForm({ ...createForm, product_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  value={createForm.country}
                  onChange={(e) => setCreateForm({ ...createForm, country: e.target.value as CountryCode })}
                  className="w-full px-3 py-2 border rounded"
                >
                  {getAllCountries().map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex gap-2 justify-end">
                <Button variant="outline" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
