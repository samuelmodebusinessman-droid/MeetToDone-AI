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
          subscription_status: string
          daily_analysis_count: number
          last_analysis_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_status?: string
          daily_analysis_count?: number
          last_analysis_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_status?: string
          daily_analysis_count?: number
          last_analysis_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      saved_analyses: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          tag: string | null
          original_text: string
          result_json: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          date: string
          tag?: string | null
          original_text: string
          result_json: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          tag?: string | null
          original_text?: string
          result_json?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
