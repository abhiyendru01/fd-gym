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
      banners: {
        Row: {
          active: boolean | null
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          id: string
          image: string
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image: string
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          id?: string
          image?: string
          title?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          num_tickets: number
          payment_id: string | null
          payment_status: string | null
          total_amount: number
          user_email: string
          user_id: string | null
          user_name: string
          user_phone: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          num_tickets: number
          payment_id?: string | null
          payment_status?: string | null
          total_amount: number
          user_email: string
          user_id?: string | null
          user_name: string
          user_phone?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          num_tickets?: number
          payment_id?: string | null
          payment_status?: string | null
          total_amount?: number
          user_email?: string
          user_id?: string | null
          user_name?: string
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          artist_host: string | null
          banner_image: string | null
          category: string
          city: string
          created_at: string | null
          description: string | null
          duration: string | null
          event_date: string
          gallery_images: string[] | null
          id: string
          price: number
          subtitle: string | null
          title: string
          total_seats: number
          updated_at: string | null
        }
        Insert: {
          artist_host?: string | null
          banner_image?: string | null
          category: string
          city: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          event_date: string
          gallery_images?: string[] | null
          id?: string
          price: number
          subtitle?: string | null
          title: string
          total_seats: number
          updated_at?: string | null
        }
        Update: {
          artist_host?: string | null
          banner_image?: string | null
          category?: string
          city?: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          event_date?: string
          gallery_images?: string[] | null
          id?: string
          price?: number
          subtitle?: string | null
          title?: string
          total_seats?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          category: string
          city: string
          created_at: string | null
          description: string | null
          duration: string | null
          gallery_images: string[] | null
          id: string
          image: string | null
          price_range: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          city: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          gallery_images?: string[] | null
          id?: string
          image?: string | null
          price_range?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          city?: string
          created_at?: string | null
          description?: string | null
          duration?: string | null
          gallery_images?: string[] | null
          id?: string
          image?: string | null
          price_range?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          duration: string
          end_date: string
          id: string
          plan_name: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          duration: string
          end_date: string
          id?: string
          plan_name: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          duration?: string
          end_date?: string
          id?: string
          plan_name?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
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
