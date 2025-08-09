import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { referralCode } = await request.json();
    if (!referralCode) return NextResponse.json({ success: false, error: 'Missing referral code' }, { status: 400 });

    const { data: refUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (error || !refUser) return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 404 });

    // Store referrer in cookie for use after signup
    const response = NextResponse.json({ success: true, referrerId: refUser.id });
    response.cookies.set('referrer_id', refUser.id, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Failed to record referral' }, { status: 500 });
  }
}
