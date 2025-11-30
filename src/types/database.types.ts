export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      golf_pace_tracker_courses: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          name: string;
          number_of_holes: number | null;
          par: number | null;
          phone: string | null;
          state: string | null;
          updated_at: string | null;
          verified: boolean;
          website: string | null;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name: string;
          number_of_holes?: number | null;
          par?: number | null;
          phone?: string | null;
          state?: string | null;
          updated_at?: string | null;
          verified?: boolean;
          website?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
          number_of_holes?: number | null;
          par?: number | null;
          phone?: string | null;
          state?: string | null;
          updated_at?: string | null;
          verified?: boolean;
          website?: string | null;
          zip_code?: string | null;
        };
        Relationships: [];
      };
      golf_pace_tracker_round_submissions: {
        Row: {
          course_id: string;
          created_at: string | null;
          day_of_week: number | null;
          duration_minutes: number;
          holes_played: number;
          id: string;
          notes: string | null;
          number_of_players: number;
          played_at: string;
          time_of_day: string | null;
          user_id: string;
          walk_or_cart: string | null;
          weather_conditions: string | null;
        };
        Insert: {
          course_id: string;
          created_at?: string | null;
          day_of_week?: number | null;
          duration_minutes: number;
          holes_played: number;
          id?: string;
          notes?: string | null;
          number_of_players: number;
          played_at: string;
          time_of_day?: string | null;
          user_id: string;
          walk_or_cart?: string | null;
          weather_conditions?: string | null;
        };
        Update: {
          course_id?: string;
          created_at?: string | null;
          day_of_week?: number | null;
          duration_minutes?: number;
          holes_played?: number;
          id?: string;
          notes?: string | null;
          number_of_players?: number;
          played_at?: string;
          time_of_day?: string | null;
          user_id?: string;
          walk_or_cart?: string | null;
          weather_conditions?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "golf_pace_tracker_round_submissions_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "golf_pace_tracker_courses";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Functions: {
      get_clerk_user_id: { Args: never; Returns: string };
      get_grocerylist_menu_grocery_list: {
        Args: { p_menu_id: string };
        Returns: {
          aisle: Database["public"]["Enums"]["ingredient_aisles"];
          base_unit: Database["public"]["Enums"]["ingredient_units"];
          item: string;
          notes: string[];
          total_base_qty: number;
        }[];
      };
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export type Course =
  Database["public"]["Tables"]["golf_pace_tracker_courses"]["Row"];
export type CourseInsert =
  Database["public"]["Tables"]["golf_pace_tracker_courses"]["Insert"];
export type RoundSubmission =
  Database["public"]["Tables"]["golf_pace_tracker_round_submissions"]["Row"];
export type RoundSubmissionInsert =
  Database["public"]["Tables"]["golf_pace_tracker_round_submissions"]["Insert"];

export const TIME_OF_DAY_OPTIONS = ["morning", "afternoon", "evening"] as const;
export const WEATHER_OPTIONS = [
  "sunny",
  "cloudy",
  "rainy",
  "windy",
  "hot",
  "cold",
] as const;
