export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      blocked_dates: {
        Row: {
          created_at: string
          date: string
          id: string
          reason: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          reason: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          reason?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          additional_notes: string | null
          address_line1: string | null
          address_line2: string | null
          booking_reference: string | null
          city: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          desserts: string | null
          event_date: string | null
          event_type: string | null
          extra_salad_type: string | null
          extras: string | null
          id: string
          menu_package: string
          menu_selection: Json | null
          notes: string
          number_of_guests: number
          postal_code_address: string | null
          province: string | null
          referral_source: string | null
          season: string | null
          sides: string | null
          starters: string | null
          status: string
          total_price: number
          user_id: string
          venue_city: string | null
          venue_name: string | null
          venue_postal_code: string | null
          venue_province: string | null
          venue_street_address: string | null
        }
        Insert: {
          additional_notes?: string | null
          address_line1?: string | null
          address_line2?: string | null
          booking_reference?: string | null
          city?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          desserts?: string | null
          event_date?: string | null
          event_type?: string | null
          extra_salad_type?: string | null
          extras?: string | null
          id?: string
          menu_package: string
          menu_selection?: Json | null
          notes: string
          number_of_guests: number
          postal_code_address?: string | null
          province?: string | null
          referral_source?: string | null
          season?: string | null
          sides?: string | null
          starters?: string | null
          status?: string
          total_price: number
          user_id?: string
          venue_city?: string | null
          venue_name?: string | null
          venue_postal_code?: string | null
          venue_province?: string | null
          venue_street_address?: string | null
        }
        Update: {
          additional_notes?: string | null
          address_line1?: string | null
          address_line2?: string | null
          booking_reference?: string | null
          city?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          desserts?: string | null
          event_date?: string | null
          event_type?: string | null
          extra_salad_type?: string | null
          extras?: string | null
          id?: string
          menu_package?: string
          menu_selection?: Json | null
          notes?: string
          number_of_guests?: number
          postal_code_address?: string | null
          province?: string | null
          referral_source?: string | null
          season?: string | null
          sides?: string | null
          starters?: string | null
          status?: string
          total_price?: number
          user_id?: string
          venue_city?: string | null
          venue_name?: string | null
          venue_postal_code?: string | null
          venue_province?: string | null
          venue_street_address?: string | null
        }
        Relationships: []
      }
      calendar_sync: {
        Row: {
          error_message: string | null
          events_synced: number | null
          id: string
          last_sync: string
          sync_status: string
        }
        Insert: {
          error_message?: string | null
          events_synced?: number | null
          id?: string
          last_sync?: string
          sync_status?: string
        }
        Update: {
          error_message?: string | null
          events_synced?: number | null
          id?: string
          last_sync?: string
          sync_status?: string
        }
        Relationships: []
      }
      event_availability: {
        Row: {
          booked_events: number | null
          created_at: string
          date: string
          google_calendar_events: Json | null
          id: string
          is_available: boolean
          max_events: number | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          booked_events?: number | null
          created_at?: string
          date: string
          google_calendar_events?: Json | null
          id?: string
          is_available?: boolean
          max_events?: number | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          booked_events?: number | null
          created_at?: string
          date?: string
          google_calendar_events?: Json | null
          id?: string
          is_available?: boolean
          max_events?: number | null
          notes?: string | null
          updated_at?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
