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

  async signInWithGoogle() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/browse`
      }
    })
    if (error) throw error
    return data
  },

  async signInWithOtp(email: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/browse` }
    })
    if (error) throw error
    return data
  },

  async signInWithPhone(phone: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOtp({
      phone
    })
    if (error) throw error
    return data
  },

  async verifyPhoneOtp(phone: string, token: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
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
  },

  async upgradeToManager(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .update({ account_type: 'manager' as any })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
