export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          resource_id: string | null
          resource_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          resource_id?: string | null
          resource_type?: string | null
        }
        Relationships: []
      }
      characters: {
        Row: {
          apparent_age: string | null
          appearance: Json
          avatar_url: string | null
          created_at: string
          description: string | null
          gender: string | null
          id: string
          locked_traits: Json
          name: string
          reference_images: Json
          updated_at: string
          user_id: string
          voice: Json
          wardrobe: Json
        }
        Insert: {
          apparent_age?: string | null
          appearance?: Json
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          locked_traits?: Json
          name: string
          reference_images?: Json
          updated_at?: string
          user_id: string
          voice?: Json
          wardrobe?: Json
        }
        Update: {
          apparent_age?: string | null
          appearance?: Json
          avatar_url?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          locked_traits?: Json
          name?: string
          reference_images?: Json
          updated_at?: string
          user_id?: string
          voice?: Json
          wardrobe?: Json
        }
        Relationships: []
      }
      credit_accounts: {
        Row: {
          balance: number
          lifetime_purchased: number
          lifetime_used: number
          reserved: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          lifetime_purchased?: number
          lifetime_used?: number
          reserved?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          lifetime_purchased?: number
          lifetime_used?: number
          reserved?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          created_at: string
          description: string | null
          id: string
          metadata: Json
          reference_id: string | null
          reference_type: string | null
          type: Database["public"]["Enums"]["credit_tx_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          reference_id?: string | null
          reference_type?: string | null
          type: Database["public"]["Enums"]["credit_tx_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          reference_id?: string | null
          reference_type?: string | null
          type?: Database["public"]["Enums"]["credit_tx_type"]
          user_id?: string
        }
        Relationships: []
      }
      generation_jobs: {
        Row: {
          actual_cost_fcfa: number | null
          attempts: number
          completed_at: string | null
          created_at: string
          credits_charged: number
          error: string | null
          estimated_cost_fcfa: number | null
          id: string
          kind: string
          model: string | null
          params: Json
          progress: number
          project_id: string
          provider: string | null
          provider_job_id: string | null
          quality_score: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_cost_fcfa?: number | null
          attempts?: number
          completed_at?: string | null
          created_at?: string
          credits_charged?: number
          error?: string | null
          estimated_cost_fcfa?: number | null
          id?: string
          kind?: string
          model?: string | null
          params?: Json
          progress?: number
          project_id: string
          provider?: string | null
          provider_job_id?: string | null
          quality_score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_cost_fcfa?: number | null
          attempts?: number
          completed_at?: string | null
          created_at?: string
          credits_charged?: number
          error?: string | null
          estimated_cost_fcfa?: number | null
          id?: string
          kind?: string
          model?: string | null
          params?: Json
          progress?: number
          project_id?: string
          provider?: string | null
          provider_job_id?: string | null
          quality_score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          active: boolean
          created_at: string
          credits: number
          duration_seconds: number
          estimated_cost_fcfa: number
          id: string
          label: string
          model_key: string
          price_fcfa: number
          safety_coefficient: number
          target_margin: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          credits: number
          duration_seconds: number
          estimated_cost_fcfa?: number
          id?: string
          label: string
          model_key: string
          price_fcfa: number
          safety_coefficient?: number
          target_margin?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          credits?: number
          duration_seconds?: number
          estimated_cost_fcfa?: number
          id?: string
          label?: string
          model_key?: string
          price_fcfa?: number
          safety_coefficient?: number
          target_margin?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          archived: boolean
          aspect_ratio: string
          bible: Json
          brief: string
          created_at: string
          credits_spent: number
          duration_seconds: number
          id: string
          language: string
          model_key: string
          on_screen_text: string | null
          production_plan: Json
          quality_score: number | null
          reference_images: Json
          status: Database["public"]["Enums"]["job_status"]
          style: string
          title: string
          updated_at: string
          user_id: string
          version: number
          voice_id: string | null
        }
        Insert: {
          archived?: boolean
          aspect_ratio?: string
          bible?: Json
          brief: string
          created_at?: string
          credits_spent?: number
          duration_seconds?: number
          id?: string
          language?: string
          model_key?: string
          on_screen_text?: string | null
          production_plan?: Json
          quality_score?: number | null
          reference_images?: Json
          status?: Database["public"]["Enums"]["job_status"]
          style?: string
          title?: string
          updated_at?: string
          user_id: string
          version?: number
          voice_id?: string | null
        }
        Update: {
          archived?: boolean
          aspect_ratio?: string
          bible?: Json
          brief?: string
          created_at?: string
          credits_spent?: number
          duration_seconds?: number
          id?: string
          language?: string
          model_key?: string
          on_screen_text?: string | null
          production_plan?: Json
          quality_score?: number | null
          reference_images?: Json
          status?: Database["public"]["Enums"]["job_status"]
          style?: string
          title?: string
          updated_at?: string
          user_id?: string
          version?: number
          voice_id?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          clicks: number
          code: string
          conversions: number
          created_at: string
          credits_earned: number
          signups: number
          user_id: string
        }
        Insert: {
          clicks?: number
          code: string
          conversions?: number
          created_at?: string
          credits_earned?: number
          signups?: number
          user_id: string
        }
        Update: {
          clicks?: number
          code?: string
          conversions?: number
          created_at?: string
          credits_earned?: number
          signups?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_sequences: {
        Row: {
          created_at: string
          duration_seconds: number
          id: string
          job_id: string | null
          project_id: string
          prompt: string | null
          sequence_index: number
          start_second: number
          status: Database["public"]["Enums"]["job_status"]
          storage_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number
          id?: string
          job_id?: string | null
          project_id: string
          prompt?: string | null
          sequence_index?: number
          start_second?: number
          status?: Database["public"]["Enums"]["job_status"]
          storage_path?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number
          id?: string
          job_id?: string | null
          project_id?: string
          prompt?: string | null
          sequence_index?: number
          start_second?: number
          status?: Database["public"]["Enums"]["job_status"]
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_sequences_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "generation_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_sequences_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      pricing_public: {
        Row: {
          credits: number | null
          duration_seconds: number | null
          label: string | null
          model_key: string | null
          price_fcfa: number | null
        }
        Insert: {
          credits?: number | null
          duration_seconds?: number | null
          label?: string | null
          model_key?: string | null
          price_fcfa?: number | null
        }
        Update: {
          credits?: number | null
          duration_seconds?: number | null
          label?: string | null
          model_key?: string | null
          price_fcfa?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      refund_credits: {
        Args: {
          _amount: number
          _description: string
          _ref_id: string
          _ref_type: string
          _user_id: string
        }
        Returns: number
      }
      spend_credits: {
        Args: {
          _amount: number
          _description: string
          _ref_id: string
          _ref_type: string
          _user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "ai_manager"
        | "voice_manager"
        | "lingua_manager"
        | "moderator"
        | "finance"
        | "support"
      credit_tx_type:
        | "purchase"
        | "usage"
        | "reserve"
        | "refund"
        | "bonus"
        | "referral"
        | "promo"
      job_status:
        | "QUEUED"
        | "PLANNED"
        | "ANALYZING"
        | "GENERATING"
        | "QUALITY_CHECK"
        | "REGENERATING"
        | "COMPOSITING"
        | "FINALIZING"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED"
        | "PAUSED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "ai_manager",
        "voice_manager",
        "lingua_manager",
        "moderator",
        "finance",
        "support",
      ],
      credit_tx_type: [
        "purchase",
        "usage",
        "reserve",
        "refund",
        "bonus",
        "referral",
        "promo",
      ],
      job_status: [
        "QUEUED",
        "PLANNED",
        "ANALYZING",
        "GENERATING",
        "QUALITY_CHECK",
        "REGENERATING",
        "COMPOSITING",
        "FINALIZING",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
        "PAUSED",
      ],
    },
  },
} as const
