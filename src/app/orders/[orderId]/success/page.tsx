'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Home, Package } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const PaymentSuccessPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const orderId = params.orderId as string;
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Verify the payment with Stripe
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            orderId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data.order);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      setIsLoading(false);
    }
  }, [sessionId, orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed and you've successfully joined the group order.
            </p>
          </motion.div>

          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <h3 className="font-semibold text-emerald-800 mb-2">Order Details</h3>
              <div className="text-sm text-emerald-700 space-y-1">
                <div>Order: {orderDetails.title}</div>
                <div>Amount: ${orderDetails.group_price}</div>
                <div>Status: Active</div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <Button
              onClick={() => router.push(`/orders/${orderId}`)}
              className="w-full"
              size="lg"
            >
              <Package className="w-4 h-4 mr-2" />
              View Order Details
            </Button>

            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>

            <Link
              href="/browse"
              className="block text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Browse More Orders
              <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
