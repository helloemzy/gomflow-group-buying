import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/services/payments';
import { orderService } from '@/lib/services/orders';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { sessionId, orderId } = await request.json();

    if (!sessionId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the payment with Stripe
    let isPaymentValid = false;
    try {
      isPaymentValid = await paymentService.verifyPayment(sessionId);
    } catch (err) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    if (!isPaymentValid) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Get order details
    const order = await orderService.getOrderById(orderId);

    // Join the order if not already joined
    const participant = await orderService.joinOrder(orderId, user.id, {
      payment_method: 'stripe',
      payment_amount: order.group_price,
    });

    // Mark payment as verified
    await orderService.verifyPayment(participant.id, user.id);

    return NextResponse.json({
      success: true,
      order,
      participant,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
