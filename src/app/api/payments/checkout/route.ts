import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payments';

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, currency, title, description } = await request.json();

    if (!orderId || !amount || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const session = await paymentService.createCheckoutSession({
      orderId,
      amount,
      currency: currency || 'usd',
      title,
      description: description || '',
      });

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (err: any) {
      // Hide Stripe init errors at build-time by deferring until request time
      return NextResponse.json(
        { error: err?.message || 'Stripe not configured' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
