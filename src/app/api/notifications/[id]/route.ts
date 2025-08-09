import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notificationService } from '@/lib/services/notifications';

export async function PATCH(
  request: Request,
  { params }: any
) {
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

    const { action } = await request.json();

    if (action === 'mark-read') {
      const notification = await notificationService.markAsRead(params.id);
      return NextResponse.json({
        success: true,
        notification,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: any
) {
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

    await notificationService.deleteNotification(params.id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
