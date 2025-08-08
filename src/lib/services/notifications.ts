import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export const notificationService = {
  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
  }) {
    const supabase = createClient();
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        action_url: data.actionUrl,
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return notification;
  },

  async getUserNotifications(userId: string, limit = 50) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async markAllAsRead(userId: string) {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  async getUnreadCount(userId: string) {
    const supabase = createClient();
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  async deleteNotification(notificationId: string) {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Notification templates for common events
  async notifyOrderCreated(orderId: string, orderTitle: string, managerId: string) {
    return this.createNotification({
      userId: managerId,
      title: 'Order Created Successfully!',
      message: `Your group order "${orderTitle}" has been created and is now live.`,
      type: 'success',
      actionUrl: `/orders/${orderId}`,
    });
  },

  async notifyOrderJoined(orderId: string, orderTitle: string, participantId: string, managerId: string) {
    // Notify the manager
    await this.createNotification({
      userId: managerId,
      title: 'New Participant Joined!',
      message: `Someone has joined your order "${orderTitle}".`,
      type: 'info',
      actionUrl: `/orders/${orderId}`,
    });

    // Notify the participant
    await this.createNotification({
      userId: participantId,
      title: 'Order Joined Successfully!',
      message: `You've joined the group order "${orderTitle}".`,
      type: 'success',
      actionUrl: `/orders/${orderId}`,
    });
  },

  async notifyPaymentVerified(orderId: string, orderTitle: string, participantId: string) {
    return this.createNotification({
      userId: participantId,
      title: 'Payment Verified!',
      message: `Your payment for "${orderTitle}" has been verified by the order manager.`,
      type: 'success',
      actionUrl: `/orders/${orderId}`,
    });
  },

  async notifyOrderDeadline(orderId: string, orderTitle: string, participantIds: string[]) {
    const notifications = participantIds.map(participantId =>
      this.createNotification({
        userId: participantId,
        title: 'Order Deadline Approaching!',
        message: `The deadline for "${orderTitle}" is approaching. Complete your payment soon!`,
        type: 'warning',
        actionUrl: `/orders/${orderId}`,
      })
    );

    return Promise.all(notifications);
  },

  async notifyOrderCompleted(orderId: string, orderTitle: string, participantIds: string[]) {
    const notifications = participantIds.map(participantId =>
      this.createNotification({
        userId: participantId,
        title: 'Order Completed!',
        message: `The group order "${orderTitle}" has been completed successfully!`,
        type: 'success',
        actionUrl: `/orders/${orderId}`,
      })
    );

    return Promise.all(notifications);
  },
};
