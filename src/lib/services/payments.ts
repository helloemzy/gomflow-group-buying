import Stripe from 'stripe';
import { createClient as createServerClient } from '@/lib/supabase/server';

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (stripeClient) return stripeClient;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Defer error to runtime invocation rather than import time to avoid build-time failures
    throw new Error('Stripe secret key is not configured');
  }
  stripeClient = new Stripe(secretKey);
  return stripeClient;
}

export const paymentService = {
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  },

  async createCheckoutSession(orderData: {
    orderId: string;
    amount: number;
    currency: string;
    title: string;
    description: string;
  }) {
    try {
      const session = await getStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: orderData.currency,
              product_data: {
                name: orderData.title,
                description: orderData.description,
              },
              unit_amount: Math.round(orderData.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData.orderId}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData.orderId}/cancel`,
        metadata: {
          orderId: orderData.orderId,
        },
      });

      return session;
    } catch (error) {
      console.error('Checkout session creation error:', error);
      throw error;
    }
  },

  async verifyPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      console.error('Payment verification error:', error);
      return false;
    }
  },

  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const refund = await getStripe().refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      return refund;
    } catch (error) {
      console.error('Payment refund error:', error);
      throw error;
    }
  },

  async uploadPaymentProof(file: File, orderId: string, userId: string) {
    try {
      // Use server client inside API route for secure upload
      const supabase = createServerClient();
      
      // Upload file to Supabase Storage
      const fileName = `payment-proofs/${orderId}/${userId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Payment proof upload error:', error);
      throw error;
    }
  },

  async updatePaymentStatus(participantId: string, status: 'verified' | 'rejected', verifiedBy: string) {
    try {
      const supabase = createServerClient();
      
      const { data, error } = await supabase
        .from('order_participants')
        .update({
          payment_status: status,
          verified_at: status === 'verified' ? new Date().toISOString() : null,
          verified_by: verifiedBy,
        })
        .eq('id', participantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Payment status update error:', error);
      throw error;
    }
  }
};
