import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    const country = searchParams.get('country');
    const status = searchParams.get('status');

    let query = supabase.from('product_requests').select('*').order('created_at', { ascending: false });
    if (country) query = query.eq('country', country);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { product_name, product_url, description, images, country } = body;

    if (!product_name || !country) return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });

    const { data, error } = await supabase
      .from('product_requests')
      .insert({
        requester_id: user.id,
        product_name,
        product_url,
        description,
        images: images || [],
        country,
        status: 'open',
        me_too_count: 0,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create request' }, { status: 500 });
  }
}
