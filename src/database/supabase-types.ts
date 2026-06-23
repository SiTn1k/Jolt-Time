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
    };
  };
}
