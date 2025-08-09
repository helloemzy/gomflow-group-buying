import { createClient } from '@/lib/supabase/client'
import { ProductRequest } from '@/types'

export const requestService = {
  async listRequests(filters?: { country?: string; status?: 'open' | 'picked_up' | 'fulfilled' }, search?: string) {
    const supabase = createClient()
    let query = supabase.from('product_requests').select('*').order('created_at', { ascending: false })

    if (filters?.country) query = query.eq('country', filters.country)
    if (filters?.status) query = query.eq('status', filters.status)

    const { data, error } = await query
    if (error) throw error

    let results = (data as unknown as ProductRequest[]) || []
    if (search && search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(r =>
        r.product_name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.product_url || '').toLowerCase().includes(q)
      )
    }

    return results
  },

  async createRequest(payload: { product_name: string; product_url?: string; description?: string; images?: string[]; country: string }) {
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error('Unauthorized')

    const { data, error } = await supabase
      .from('product_requests')
      .insert({
        requester_id: auth.user.id,
        product_name: payload.product_name,
        product_url: payload.product_url,
        description: payload.description,
        images: payload.images || [],
        country: payload.country,
        status: 'open',
        me_too_count: 0,
      })
      .select('*')
      .single()

    if (error) throw error
    return data as unknown as ProductRequest
  },

  async vote(requestId: string) {
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error('Unauthorized')

    // Try insert vote
    const { error: insertError } = await supabase
      .from('request_votes')
      .insert({ request_id: requestId, user_id: auth.user.id })

    if (insertError) {
      // If conflict, ignore
    }

    // Update me_too_count via RPC-like update (best-effort, ignore errors)
    await supabase.rpc('increment_me_too_count', { p_request_id: requestId })
  },

  async unvote(requestId: string) {
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error('Unauthorized')

    await supabase.from('request_votes').delete().eq('request_id', requestId).eq('user_id', auth.user.id)
    await supabase.rpc('decrement_me_too_count', { p_request_id: requestId })
  }
}
