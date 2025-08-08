import { NextRequest, NextResponse } from 'next/server';
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

    const { orderId, paymentMethod, paymentAmount, paymentProofUrl } = await request.json();

    if (!orderId || !paymentMethod || !paymentAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Join the order
    const participant = await orderService.joinOrder(orderId, user.id, {
      payment_method: paymentMethod,
      payment_amount: paymentAmount,
    });

    // Update payment proof if provided
    if (paymentProofUrl) {
      await orderService.updatePaymentStatus(participant.id, 'uploaded', user.id);
    }

    return NextResponse.json({
      success: true,
      participant,
    });
  } catch (error: any) {
    console.error('Join order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to join order' },
      { status: 500 }
    );
  }
}
