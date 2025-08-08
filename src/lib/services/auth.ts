import { createClient } from '@/lib/supabase/client'
import { User } from '@/types'

export const authService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          country: userData.country,
          accountType: userData.accountType || 'buyer',
        }
      }
    })

    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserProfile(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }
}
