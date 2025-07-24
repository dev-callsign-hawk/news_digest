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
      news_articles: {
        Row: {
          content_generated_by: string | null
          created_at: string | null
          headline: string
          id: string
          image_url: string | null
          news_beat: Database["public"]["Enums"]["news_beat_type"] | null
          published_date: string
          region: Database["public"]["Enums"]["region_type"] | null
          source_url: string
          summary: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          content_generated_by?: string | null
          created_at?: string | null
          headline: string
          id?: string
          image_url?: string | null
          news_beat?: Database["public"]["Enums"]["news_beat_type"] | null
          published_date: string
          region?: Database["public"]["Enums"]["region_type"] | null
          source_url: string
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          content_generated_by?: string | null
          created_at?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          news_beat?: Database["public"]["Enums"]["news_beat_type"] | null
          published_date?: string
          region?: Database["public"]["Enums"]["region_type"] | null
          source_url?: string
          summary?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news_generation_history: {
        Row: {
          articles_generated: number | null
          created_at: string | null
          generation_status: string | null
          id: string
          news_beat: Database["public"]["Enums"]["news_beat_type"] | null
          region: Database["public"]["Enums"]["region_type"] | null
          requested_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          articles_generated?: number | null
          created_at?: string | null
          generation_status?: string | null
          id?: string
          news_beat?: Database["public"]["Enums"]["news_beat_type"] | null
          region?: Database["public"]["Enums"]["region_type"] | null
          requested_date: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          articles_generated?: number | null
          created_at?: string | null
          generation_status?: string | null
          id?: string
          news_beat?: Database["public"]["Enums"]["news_beat_type"] | null
          region?: Database["public"]["Enums"]["region_type"] | null
          requested_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_generation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_requests: {
        Row: {
          articles_found: number | null
          created_at: string | null
          id: string
          news_beat: Database["public"]["Enums"]["news_beat_type"] | null
          region: Database["public"]["Enums"]["region_type"] | null
          request_status: string | null
          requested_date: string
          user_id: string
        }
        Insert: {
          articles_found?: number | null
          created_at?: string | null
          id?: string
          news_beat?: Database["public"]["Enums"]["news_beat_type"] | null
          region?: Database["public"]["Enums"]["region_type"] | null
          request_status?: string | null
          requested_date: string
          user_id: string
        }
        Update: {
          articles_found?: number | null
          created_at?: string | null
          id?: string
          news_beat?: Database["public"]["Enums"]["news_beat_type"] | null
          region?: Database["public"]["Enums"]["region_type"] | null
          request_status?: string | null
          requested_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          notification_enabled: boolean | null
          preferred_beats:
            | Database["public"]["Enums"]["news_beat_type"][]
            | null
          preferred_regions: Database["public"]["Enums"]["region_type"][] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_enabled?: boolean | null
          preferred_beats?:
            | Database["public"]["Enums"]["news_beat_type"][]
            | null
          preferred_regions?:
            | Database["public"]["Enums"]["region_type"][]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_enabled?: boolean | null
          preferred_beats?:
            | Database["public"]["Enums"]["news_beat_type"][]
            | null
          preferred_regions?:
            | Database["public"]["Enums"]["region_type"][]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      news_beat_type:
        | "sports"
        | "agriculture"
        | "politics"
        | "technology"
        | "health"
        | "business"
        | "entertainment"
        | "crime"
        | "real_estate"
        | "education"
        | "environment"
        | "lifestyle"
        | "international"
      region_type:
        | "delhi"
        | "mumbai"
        | "kolkata"
        | "chennai"
        | "bangalore"
        | "hyderabad"
        | "pune"
        | "ahmedabad"
        | "jaipur"
        | "lucknow"
        | "kanpur"
        | "nagpur"
        | "indore"
        | "thane"
        | "bhopal"
        | "visakhapatnam"
        | "pimpri"
        | "patna"
        | "vadodara"
        | "ghaziabad"
        | "ludhiana"
        | "agra"
        | "nashik"
        | "faridabad"
        | "meerut"
        | "rajkot"
        | "kalyan"
        | "vasai"
        | "varanasi"
        | "srinagar"
        | "aurangabad"
        | "dhanbad"
        | "amritsar"
        | "navi_mumbai"
        | "allahabad"
        | "ranchi"
        | "howrah"
        | "coimbatore"
        | "jabalpur"
        | "gwalior"
        | "vijayawada"
        | "jodhpur"
        | "madurai"
        | "raipur"
        | "kota"
        | "guwahati"
        | "chandigarh"
        | "solapur"
        | "hubli"
        | "tiruchirappalli"
        | "bareilly"
        | "mysore"
        | "tiruppur"
        | "gurgaon"
        | "aligarh"
        | "jalandhar"
        | "bhubaneswar"
        | "salem"
        | "warangal"
        | "guntur"
        | "bhiwandi"
        | "saharanpur"
        | "gorakhpur"
        | "bikaner"
        | "amravati"
        | "noida"
        | "jamshedpur"
        | "bhilai"
        | "cuttack"
        | "firozabad"
        | "kochi"
        | "nellore"
        | "bhavnagar"
        | "dehradun"
        | "durgapur"
        | "asansol"
        | "rourkela"
        | "nanded"
        | "kolhapur"
        | "ajmer"
        | "akola"
        | "gulbarga"
        | "jamnagar"
        | "ujjain"
        | "loni"
        | "siliguri"
        | "jhansi"
        | "ulhasnagar"
        | "jammu"
        | "sangli_miraj_kupwad"
        | "mangalore"
        | "erode"
        | "belgaum"
        | "ambattur"
        | "tirunelveli"
        | "malegaon"
        | "gaya"
        | "jalgaon"
        | "udaipur"
        | "maheshtala"
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
    Enums: {
      news_beat_type: [
        "sports",
        "agriculture",
        "politics",
        "technology",
        "health",
        "business",
        "entertainment",
        "crime",
        "real_estate",
        "education",
        "environment",
        "lifestyle",
        "international",
      ],
      region_type: [
        "delhi",
        "mumbai",
        "kolkata",
        "chennai",
        "bangalore",
        "hyderabad",
        "pune",
        "ahmedabad",
        "jaipur",
        "lucknow",
        "kanpur",
        "nagpur",
        "indore",
        "thane",
        "bhopal",
        "visakhapatnam",
        "pimpri",
        "patna",
        "vadodara",
        "ghaziabad",
        "ludhiana",
        "agra",
        "nashik",
        "faridabad",
        "meerut",
        "rajkot",
        "kalyan",
        "vasai",
        "varanasi",
        "srinagar",
        "aurangabad",
        "dhanbad",
        "amritsar",
        "navi_mumbai",
        "allahabad",
        "ranchi",
        "howrah",
        "coimbatore",
        "jabalpur",
        "gwalior",
        "vijayawada",
        "jodhpur",
        "madurai",
        "raipur",
        "kota",
        "guwahati",
        "chandigarh",
        "solapur",
        "hubli",
        "tiruchirappalli",
        "bareilly",
        "mysore",
        "tiruppur",
        "gurgaon",
        "aligarh",
        "jalandhar",
        "bhubaneswar",
        "salem",
        "warangal",
        "guntur",
        "bhiwandi",
        "saharanpur",
        "gorakhpur",
        "bikaner",
        "amravati",
        "noida",
        "jamshedpur",
        "bhilai",
        "cuttack",
        "firozabad",
        "kochi",
        "nellore",
        "bhavnagar",
        "dehradun",
        "durgapur",
        "asansol",
        "rourkela",
        "nanded",
        "kolhapur",
        "ajmer",
        "akola",
        "gulbarga",
        "jamnagar",
        "ujjain",
        "loni",
        "siliguri",
        "jhansi",
        "ulhasnagar",
        "jammu",
        "sangli_miraj_kupwad",
        "mangalore",
        "erode",
        "belgaum",
        "ambattur",
        "tirunelveli",
        "malegaon",
        "gaya",
        "jalgaon",
        "udaipur",
        "maheshtala",
      ],
    },
  },
} as const
