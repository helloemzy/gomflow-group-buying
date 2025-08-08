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
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
