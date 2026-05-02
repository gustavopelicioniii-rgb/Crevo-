export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          plan: 'start' | 'pro' | 'business' | 'enterprise'
          credits_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          plan?: 'start' | 'pro' | 'business' | 'enterprise'
          credits_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          plan?: 'start' | 'pro' | 'business' | 'enterprise'
          credits_balance?: number
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          canvas_data: Json | null
          thumbnail_url: string | null
          status: 'draft' | 'processing' | 'done' | 'failed'
          credits_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          canvas_data?: Json | null
          thumbnail_url?: string | null
          status?: 'draft' | 'processing' | 'done' | 'failed'
          credits_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          canvas_data?: Json | null
          thumbnail_url?: string | null
          status?: 'draft' | 'processing' | 'done' | 'failed'
          credits_used?: number
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          type: 'image' | 'video'
          provider: 'kling' | 'dalle' | 'flux' | 'gemini'
          prompt: string
          input_url: string | null
          output_url: string | null
          status: 'pending' | 'processing' | 'done' | 'failed'
          credits_cost: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          type: 'image' | 'video'
          provider: 'kling' | 'dalle' | 'flux' | 'gemini'
          prompt: string
          input_url?: string | null
          output_url?: string | null
          status?: 'pending' | 'processing' | 'done' | 'failed'
          credits_cost?: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          output_url?: string | null
          status?: 'pending' | 'processing' | 'done' | 'failed'
          metadata?: Json | null
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          category: string
          thumbnail_url: string | null
          canvas_data: Json | null
          prompt_template: string | null
          recommended_settings: Json | null
          usage_count: number
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          thumbnail_url?: string | null
          canvas_data?: Json | null
          prompt_template?: string | null
          recommended_settings?: Json | null
          usage_count?: number
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          usage_count?: number
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'purchase' | 'usage' | 'refund' | 'expiry'
          amount: number
          balance_after: number
          description: string | null
          payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'purchase' | 'usage' | 'refund' | 'expiry'
          amount: number
          balance_after: number
          description?: string | null
          payment_id?: string | null
          created_at?: string
        }
        Update: never
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          last_used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_hash: string
          last_used_at?: string | null
          created_at?: string
        }
        Update: {
          last_used_at?: string | null
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Generation = Database['public']['Tables']['generations']['Row']
export type Template = Database['public']['Tables']['templates']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
