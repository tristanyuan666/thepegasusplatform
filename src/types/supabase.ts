export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_recommendations: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          description: string | null
          id: string
          is_used: boolean | null
          metadata: Json | null
          platform: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
          viral_score: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_used?: boolean | null
          metadata?: Json | null
          platform?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
          viral_score?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_used?: boolean | null
          metadata?: Json | null
          platform?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
          viral_score?: number | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          metric_name: string | null
          metric_type: string
          metric_value: number
          platform: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          metric_name?: string | null
          metric_type: string
          metric_value: number
          platform: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metric_name?: string | null
          metric_type?: string
          metric_value?: number
          platform?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          amount: number | null
          billing_cycle: string
          completed_at: string | null
          created_at: string | null
          currency: string | null
          id: string
          plan_name: string
          price_id: string
          session_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          billing_cycle?: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          plan_name: string
          price_id: string
          session_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          billing_cycle?: string
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          plan_name?: string
          price_id?: string
          session_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_generation_history: {
        Row: {
          content_type: string
          created_at: string | null
          format: string | null
          generated_content: string
          id: string
          is_used: boolean | null
          metadata: Json | null
          platform: string | null
          prompt: string
          user_id: string | null
        }
        Insert: {
          content_type: string
          created_at?: string | null
          format?: string | null
          generated_content: string
          id?: string
          is_used?: boolean | null
          metadata?: Json | null
          platform?: string | null
          prompt: string
          user_id?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          format?: string | null
          generated_content?: string
          id?: string
          is_used?: boolean | null
          metadata?: Json | null
          platform?: string | null
          prompt?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_performance: {
        Row: {
          comments: number | null
          content_id: string
          content_type: string | null
          created_at: string | null
          engagement_rate: number | null
          id: string
          likes: number | null
          platform: string
          published_at: string | null
          shares: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          views: number | null
          viral_score: number | null
        }
        Insert: {
          comments?: number | null
          content_id: string
          content_type?: string | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          platform: string
          published_at?: string | null
          shares?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          viral_score?: number | null
        }
        Update: {
          comments?: number | null
          content_id?: string
          content_type?: string | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          platform?: string
          published_at?: string | null
          shares?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          viral_score?: number | null
        }
        Relationships: []
      }
      content_queue: {
        Row: {
          content: string
          content_type: string
          created_at: string
          id: string
          media_urls: string[] | null
          platform: string
          scheduled_for: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string | null
          viral_score: number | null
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          platform: string
          scheduled_for?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          viral_score?: number | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          platform?: string
          scheduled_for?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          viral_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      hashtag_performance: {
        Row: {
          created_at: string | null
          engagement_rate: number | null
          hashtag: string
          id: string
          last_used: string | null
          platform: string
          reach: number | null
          updated_at: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          engagement_rate?: number | null
          hashtag: string
          id?: string
          last_used?: string | null
          platform: string
          reach?: number | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          engagement_rate?: number | null
          hashtag?: string
          id?: string
          last_used?: string | null
          platform?: string
          reach?: number | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_analytics: {
        Row: {
          collected_at: string | null
          created_at: string | null
          id: string
          metrics: Json
          platform: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          collected_at?: string | null
          created_at?: string | null
          id?: string
          metrics: Json
          platform: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          collected_at?: string | null
          created_at?: string | null
          id?: string
          metrics?: Json
          platform?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          follower_count: number | null
          id: string
          is_active: boolean | null
          platform: string
          platform_user_id: string | null
          refresh_token: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          follower_count?: number | null
          id?: string
          is_active?: boolean | null
          platform: string
          platform_user_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          follower_count?: number | null
          id?: string
          is_active?: boolean | null
          platform?: string
          platform_user_id?: string | null
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          billing_history: Json | null
          cancel_at_period_end: boolean | null
          canceled_at: number | null
          created_at: string
          currency: string | null
          current_period_end: number | null
          current_period_start: number | null
          custom_field_data: Json | null
          customer_cancellation_comment: string | null
          customer_cancellation_reason: string | null
          customer_id: string | null
          ended_at: number | null
          ends_at: number | null
          features_used: Json | null
          id: string
          interval: string | null
          metadata: Json | null
          plan_name: string | null
          price_id: string | null
          started_at: number | null
          status: string | null
          stripe_id: string | null
          stripe_price_id: string | null
          updated_at: string
          usage_limits: Json | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          billing_history?: Json | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          features_used?: Json | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          plan_name?: string | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          usage_limits?: Json | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          billing_history?: Json | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          features_used?: Json | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          plan_name?: string | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          usage_limits?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          step_1_completed: boolean | null
          step_2_completed: boolean | null
          step_3_completed: boolean | null
          step_4_completed: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          step_1_completed?: boolean | null
          step_2_completed?: boolean | null
          step_3_completed?: boolean | null
          step_4_completed?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          step_1_completed?: boolean | null
          step_2_completed?: boolean | null
          step_3_completed?: boolean | null
          step_4_completed?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          content_format: string | null
          created_at: string
          credits: string | null
          email: string | null
          fame_goals: string | null
          follower_count: number | null
          full_name: string | null
          id: string
          image: string | null
          monetization_forecast: number | null
          name: string | null
          niche: string | null
          onboarding_completed: boolean | null
          subscription: string | null
          token_identifier: string
          tone: string | null
          updated_at: string | null
          user_id: string | null
          viral_score: number | null
        }
        Insert: {
          avatar_url?: string | null
          content_format?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          fame_goals?: string | null
          follower_count?: number | null
          full_name?: string | null
          id?: string
          image?: string | null
          monetization_forecast?: number | null
          name?: string | null
          niche?: string | null
          onboarding_completed?: boolean | null
          subscription?: string | null
          token_identifier: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string | null
          viral_score?: number | null
        }
        Update: {
          avatar_url?: string | null
          content_format?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          fame_goals?: string | null
          follower_count?: number | null
          full_name?: string | null
          id?: string
          image?: string | null
          monetization_forecast?: number | null
          name?: string | null
          niche?: string | null
          onboarding_completed?: boolean | null
          subscription?: string | null
          token_identifier?: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string | null
          viral_score?: number | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          data: Json | null
          event_type: string
          id: string
          modified_at: string
          stripe_event_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
