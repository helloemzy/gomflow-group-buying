import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payments';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    try {
      const paymentIntent = await paymentService.createPaymentIntent(amount, currency);

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (err: any) {
      return NextResponse.json(
        { error: err?.message || 'Stripe not configured' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
