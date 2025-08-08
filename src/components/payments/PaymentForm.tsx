'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  FileText
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency: string;
  title: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  orderId,
  amount,
  currency,
  title,
  onSuccess,
  onCancel
}) => {
  const { user } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'manual'>('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleStripePayment = async () => {
    if (!user) {
      setError('You must be logged in to make a payment');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency,
          title,
          description: `Payment for ${title}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualPayment = async () => {
    if (!user || !uploadedFile) {
      setError('Please upload a payment proof');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('orderId', orderId);
      formData.append('userId', user.id);

      const response = await fetch('/api/payments/upload-proof', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload payment proof');
      }

      // Update participant record
      const participantResponse = await fetch('/api/orders/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: 'manual',
          paymentAmount: amount,
          paymentProofUrl: data.url,
        }),
      });

      if (!participantResponse.ok) {
        throw new Error('Failed to join order');
      }

      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
          <p className="text-gray-600">Choose your payment method</p>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-emerald-600">
              {formatCurrency(amount, currency)}
            </div>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === 'stripe'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Card Payment</span>
            </button>
            <button
              onClick={() => setPaymentMethod('manual')}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === 'manual'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Upload className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Upload Proof</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Stripe Payment */}
        {paymentMethod === 'stripe' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-blue-600">
                Your payment will be processed securely by Stripe. We never store your card details.
              </p>
            </div>

            <Button
              onClick={handleStripePayment}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Processing...' : `Pay ${formatCurrency(amount, currency)}`}
            </Button>
          </div>
        )}

        {/* Manual Payment */}
        {paymentMethod === 'manual' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 mb-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Upload Payment Proof</span>
              </div>
              <p className="text-xs text-amber-600">
                Upload a screenshot or receipt of your payment. The order manager will verify it.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="cursor-pointer block"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {uploadedFile ? uploadedFile.name : 'Click to upload payment proof'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP, or PDF (max 5MB)
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">{uploadedFile.name}</span>
              </div>
            )}

            <Button
              onClick={handleManualPayment}
              disabled={isLoading || !uploadedFile}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Uploading...' : 'Submit Payment Proof'}
            </Button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default PaymentForm;
