'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Package, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-emerald-600">GOMFLOW</h1>
              <div className="h-6 w-px bg-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/browse"><Button variant="outline" size="sm">Browse</Button></Link>
              <Link href="/dashboard"><Button size="sm">Dashboard</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Active Orders</div>
                <div className="text-2xl font-bold">12</div>
              </div>
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Participants</div>
                <div className="text-2xl font-bold">284</div>
              </div>
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">GMV</div>
                <div className="text-2xl font-bold">$14,320</div>
              </div>
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Growth</div>
                <div className="text-2xl font-bold">+22%</div>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-900">Weekly Orders</h3>
          </div>
          <div className="h-48 flex items-end gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 bg-emerald-100 rounded">
                <div
                  className="bg-emerald-500 rounded"
                  style={{ height: `${20 + Math.random() * 70}%` }}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
