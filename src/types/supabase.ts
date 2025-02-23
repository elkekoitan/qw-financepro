export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          encrypted_password: string
          full_name: string
          status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Tables['users']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          avatar_url: string | null
          risk_tolerance: number | null
          investment_goal: string | null
          preferred_currency: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Tables['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Tables['profiles']['Insert']>
      }
    }
  }
}

type Tables = Database['public']['Tables'] 