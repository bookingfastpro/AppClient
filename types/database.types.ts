/**
 * Hand-written to match supabase/migrations/*.sql. Once a live Supabase
 * project exists, regenerate with:
 *   npx supabase gen types typescript --project-id <id> > types/database.types.ts
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: Partial<{
          full_name: string | null;
          avatar_url: string | null;
        }>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_path: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category_id: string;
          is_premium: boolean;
          // YouTube video ID (11 chars). Thumbnails are public for every
          // video per product spec, so — unlike the old video_path — this
          // is freely selectable; the real access gate is application-level
          // (the video detail page only renders the embedded player for
          // authorized users). See migration 0009.
          youtube_id: string;
          duration_seconds: number;
          level: "beginner" | "intermediate" | "advanced" | null;
          instructor: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          title: string;
          description: string;
          category_id: string;
          is_premium?: boolean;
          youtube_id: string;
          duration_seconds: number;
          level?: "beginner" | "intermediate" | "advanced" | null;
          instructor: string;
          published_at?: string | null;
        };
        Update: Partial<{
          slug: string;
          title: string;
          description: string;
          category_id: string;
          is_premium: boolean;
          youtube_id: string;
          duration_seconds: number;
          level: "beginner" | "intermediate" | "advanced" | null;
          instructor: string;
          published_at: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "videos_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          video_id: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "favorites_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      programs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          image_path: string | null;
          level: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          image_path?: string | null;
          level?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<{
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          image_path: string | null;
          level: string | null;
          sort_order: number;
          published: boolean;
          updated_at: string;
        }>;
        Relationships: [];
      };
      program_videos: {
        Row: {
          program_id: string;
          video_id: string;
          position: number;
        };
        Insert: {
          program_id: string;
          video_id: string;
          position?: number;
        };
        Update: Partial<{
          position: number;
        }>;
        Relationships: [
          {
            foreignKeyName: "program_videos_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      watch_history: {
        Row: {
          user_id: string;
          video_id: string;
          progress_seconds: number;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          video_id: string;
          progress_seconds: number;
          completed?: boolean;
          updated_at?: string;
        };
        Update: Partial<{
          progress_seconds: number;
          completed: boolean;
          updated_at: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "watch_history_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          status: string;
          price_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          is_manual: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          status?: string;
          price_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          is_manual?: boolean;
        };
        Update: Partial<{
          stripe_subscription_id: string | null;
          status: string;
          price_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          is_manual: boolean;
        }>;
        Relationships: [];
      };
      stripe_events: {
        Row: {
          id: string;
          type: string;
          processed_at: string;
        };
        Insert: {
          id: string;
          type: string;
        };
        Update: never;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          body: string;
          created_at: string;
        };
        Insert: {
          title: string;
          body: string;
        };
        Update: never;
        Relationships: [];
      };
      notification_reads: {
        Row: {
          notification_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          notification_id: string;
          user_id: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey";
            columns: ["notification_id"];
            isOneToOne: false;
            referencedRelation: "notifications";
            referencedColumns: ["id"];
          },
        ];
      };
      membership_plan: {
        Row: {
          id: number;
          stripe_product_id: string | null;
          stripe_price_id: string | null;
          title: string;
          description: string;
          features: string[];
          updated_at: string;
        };
        Insert: never;
        Update: Partial<{
          stripe_product_id: string | null;
          stripe_price_id: string | null;
          title: string;
          description: string;
          features: string[];
          updated_at: string;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_top_favorited_videos: {
        Args: { video_limit?: number };
        Returns: { video_id: string; favorite_count: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/**
 * Every videos column is now safe for anon/authenticated to read (see
 * migration 0009 — thumbnails are public for every video, including
 * premium, so youtube_id is no longer a secret column). The real access
 * gate is application-level: only videos/[slug]/page.tsx decides whether
 * to actually render the embedded player.
 */
export type VideoSummary = Database["public"]["Tables"]["videos"]["Row"];
