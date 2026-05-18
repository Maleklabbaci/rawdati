import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Nursery = {
  id: string
  name: string
  owner_name: string
  email: string
  phone?: string
  city?: string
  status: 'Active' | 'Inactive' | 'Pending'
  plan: 'Trial' | 'Basic' | 'Pro' | 'Premium'
}

export type Child = {
  id: string
  nursery_id: string
  first_name: string
  last_name: string
  birth_date: string
  gender: 'M' | 'F'
  group_name: string
  parent_name: string
  parent_phone: string
  status: 'Active' | 'Inactive'
}