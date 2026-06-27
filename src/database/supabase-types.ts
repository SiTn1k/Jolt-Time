/**
 * Supabase Database Types
 * 
 * TypeScript type definitions for Supabase database tables.
 * These types are generated from the database schema and used throughout the application.
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          telegram_id: number | null;
          username: string | null;
          chat_id: number | null;
          notifications_enabled: boolean;
          last_notification_at: string | null;
          last_active_at: string;
          created_at: string;
          updated_at: string;
          status: string;
          is_premium: boolean;
          language_code: string | null;
          photo_url: string | null;
          last_seen_at: string | null;
        };
        Insert: {
          id?: string;
          telegram_id?: number | null;
          username?: string | null;
          chat_id?: number | null;
          notifications_enabled?: boolean;
          last_notification_at?: string | null;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
          is_premium?: boolean;
          language_code?: string | null;
          photo_url?: string | null;
          last_seen_at?: string | null;
        };
        Update: {
          id?: string;
          telegram_id?: number | null;
          username?: string | null;
          chat_id?: number | null;
          notifications_enabled?: boolean;
          last_notification_at?: string | null;
          last_active_at?: string;
          created_at?: string;
          updated_at?: string;
          status?: string;
          is_premium?: boolean;
          language_code?: string | null;
          photo_url?: string | null;
          last_seen_at?: string | null;
        };
      };
      
      notification_preferences: {
        Row: {
          id: string;
          user_id: string;
          daily_reminders: boolean;
          events: boolean;
          research_complete: boolean;
          energy_restored: boolean;
          building_complete: boolean;
          marketing: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          daily_reminders?: boolean;
          events?: boolean;
          research_complete?: boolean;
          energy_restored?: boolean;
          building_complete?: boolean;
          marketing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          daily_reminders?: boolean;
          events?: boolean;
          research_complete?: boolean;
          energy_restored?: boolean;
          building_complete?: boolean;
          marketing?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      notifications_queue: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          status: string;
          scheduled_at: string | null;
          sent_at: string | null;
          created_at: string;
          deduplication_key: string | null;
          error_message: string | null;
          retry_count: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          status?: string;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
          deduplication_key?: string | null;
          error_message?: string | null;
          retry_count?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          status?: string;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
          deduplication_key?: string | null;
          error_message?: string | null;
          retry_count?: number;
        };
      };
      
      notification_cooldowns: {
        Row: {
          id: string;
          user_id: string;
          notification_type: string;
          cooldown_expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_type: string;
          cooldown_expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notification_type?: string;
          cooldown_expires_at?: string;
          created_at?: string;
        };
      };
      
      academies: {
        Row: {
          id: string;
          player_profile_id: string;
          academy_level: number;
          research_points: number;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_profile_id: string;
          academy_level?: number;
          research_points?: number;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_profile_id?: string;
          academy_level?: number;
          research_points?: number;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      research_progress: {
        Row: {
          id: string;
          academy_id: string;
          node_id: string;
          status: string;
          progress: number;
          completed_at: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          academy_id: string;
          node_id: string;
          status?: string;
          progress?: number;
          completed_at?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          academy_id?: string;
          node_id?: string;
          status?: string;
          progress?: number;
          completed_at?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      achievements: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          rarity: string;
          points: number;
          icon: string;
          reward_definition: Record<string, unknown>;
          is_hidden: boolean;
          is_active: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          rarity: string;
          points: number;
          icon?: string;
          reward_definition?: Record<string, unknown>;
          is_hidden?: boolean;
          is_active?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          category?: string;
          rarity?: string;
          points?: number;
          icon?: string;
          reward_definition?: Record<string, unknown>;
          is_hidden?: boolean;
          is_active?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      achievement_conditions: {
        Row: {
          id: string;
          achievement_id: string;
          condition_type: string;
          target: string | null;
          required_value: number;
          metadata: Record<string, unknown>;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          achievement_id: string;
          condition_type: string;
          target?: string | null;
          required_value: number;
          metadata?: Record<string, unknown>;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          achievement_id?: string;
          condition_type?: string;
          target?: string | null;
          required_value?: number;
          metadata?: Record<string, unknown>;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      achievement_progress: {
        Row: {
          id: string;
          player_profile_id: string;
          achievement_id: string;
          status: string;
          current_value: number;
          completed_at: string | null;
          claimed_at: string | null;
          metadata: Record<string, unknown>;
          started_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_profile_id: string;
          achievement_id: string;
          status?: string;
          current_value?: number;
          completed_at?: string | null;
          claimed_at?: string | null;
          metadata?: Record<string, unknown>;
          started_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_profile_id?: string;
          achievement_id?: string;
          status?: string;
          current_value?: number;
          completed_at?: string | null;
          claimed_at?: string | null;
          metadata?: Record<string, unknown>;
          started_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
