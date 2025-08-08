import { createClient } from '@/lib/supabase/client'
import { GroupOrder, CreateOrderData, OrderParticipant } from '@/types'

export const orderService = {
  async createOrder(orderData: CreateOrderData, userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('group_orders')
      .insert({
        ...orderData,
        manager_id: userId,
        status: 'active',
        current_orders: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getOrders(filters?: {
    country?: string
    category?: string
    status?: string
    manager_id?: string
  }) {
    const supabase = createClient()
    
    let query = supabase
      .from('group_orders')
      .select(`
        *,
        manager:users!group_orders_manager_id_fkey(*)
      `)
      .order('created_at', { ascending: false })

    if (filters?.country) {
      query = query.eq('country', filters.country)
    }
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.manager_id) {
      query = query.eq('manager_id', filters.manager_id)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getOrderById(orderId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('group_orders')
      .select(`
        *,
        manager:users!group_orders_manager_id_fkey(*),
        participants:order_participants(
          *,
          user:users(*)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  },

  async joinOrder(orderId: string, userId: string, paymentData: {
    payment_method: string
    payment_amount: number
  }) {
    const supabase = createClient()
    
    // Start a transaction
    const { data: participant, error: participantError } = await supabase
      .from('order_participants')
      .insert({
        order_id: orderId,
        user_id: userId,
        payment_method: paymentData.payment_method,
        payment_amount: paymentData.payment_amount,
        payment_status: 'uploaded',
        joined_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (participantError) throw participantError

    // Update order count
    const { error: updateError } = await supabase
      .from('group_orders')
      .update({ 
        current_orders: supabase.sql`current_orders + 1`,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) throw updateError

    return participant
  },

  async updateOrderStatus(orderId: string, status: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('group_orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async verifyPayment(participantId: string, verifiedBy: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('order_participants')
      .update({
        payment_status: 'verified',
        verified_at: new Date().toISOString(),
        verified_by: verifiedBy,
      })
      .eq('id', participantId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserOrders(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('group_orders')
      .select('*')
      .eq('manager_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getUserParticipations(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('order_participants')
      .select(`
        *,
        order:group_orders(*)
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false })

    if (error) throw error
    return data
  }
}
