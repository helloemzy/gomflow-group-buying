import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: any
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Insert vote (ignore on conflict)
    await supabase.from('request_votes').insert({ request_id: params.id, user_id: user.id }).catch(() => {});

    // Increment count
    await supabase.rpc('increment_me_too_count', { p_request_id: params.id }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to vote' }, { status: 500 });
  }
}
