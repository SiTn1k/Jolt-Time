/**
 * UserPreferencesService
 * 
 * Service for managing user notification preferences.
 * Handles CRUD operations for notification_preferences table.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NotificationCategory } from '../types/notifications';

export interface UserNotificationPreferences {
  daily_reminders: boolean;
  events: boolean;
  research_complete: boolean;
  energy_restored: boolean;
  building_complete: boolean;
  marketing: boolean;
}

export class UserPreferencesService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Get notification preferences for a user.
   * 
   * If no preferences exist, returns default values (all enabled except marketing).
   * 
   * @param userId - User ID
   * @returns UserNotificationPreferences
   */
  async getPreferences(userId: string): Promise<UserNotificationPreferences> {
    const { data, error } = await this.supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Return defaults if no preferences found
      return {
        daily_reminders: true,
        events: true,
        research_complete: true,
        energy_restored: true,
        building_complete: true,
        marketing: false
      };
    }

    return {
      daily_reminders: data.daily_reminders,
      events: data.events,
      research_complete: data.research_complete,
      energy_restored: data.energy_restored,
      building_complete: data.building_complete,
      marketing: data.marketing
    };
  }

  /**
   * Update notification preferences for a user.
   * 
   * Uses upsert to create if not exists, update if exists.
   * Only updates the fields provided in the params.
   * 
   * @param userId - User ID
   * @param preferences - Partial preferences to update
   * @returns Updated preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<UserNotificationPreferences>
  ): Promise<UserNotificationPreferences> {
    // Build update object with only provided fields
    const updateData: Partial<UserNotificationPreferences> & { user_id: string; updated_at: string } = {
      user_id: userId,
      updated_at: new Date().toISOString()
    };

    if (preferences.daily_reminders !== undefined) {
      updateData.daily_reminders = preferences.daily_reminders;
    }
    if (preferences.events !== undefined) {
      updateData.events = preferences.events;
    }
    if (preferences.research_complete !== undefined) {
      updateData.research_complete = preferences.research_complete;
    }
    if (preferences.energy_restored !== undefined) {
      updateData.energy_restored = preferences.energy_restored;
    }
    if (preferences.building_complete !== undefined) {
      updateData.building_complete = preferences.building_complete;
    }
    if (preferences.marketing !== undefined) {
      updateData.marketing = preferences.marketing;
    }

    const { data, error } = await this.supabase
      .from('notification_preferences')
      .upsert(updateData, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }

    return {
      daily_reminders: data.daily_reminders,
      events: data.events,
      research_complete: data.research_complete,
      energy_restored: data.energy_restored,
      building_complete: data.building_complete,
      marketing: data.marketing
    };
  }

  /**
   * Check if a specific category is enabled for a user.
   * 
   * @param userId - User ID
   * @param category - Notification category to check
   * @returns true if enabled, false otherwise
   */
  async isCategoryEnabled(userId: string, category: NotificationCategory): Promise<boolean> {
    const prefs = await this.getPreferences(userId);

    switch (category) {
      case NotificationCategory.DAILY_REMINDERS:
        return prefs.daily_reminders;
      case NotificationCategory.EVENTS:
        return prefs.events;
      case NotificationCategory.RESEARCH_COMPLETE:
        return prefs.research_complete;
      case NotificationCategory.ENERGY_RESTORED:
        return prefs.energy_restored;
      case NotificationCategory.BUILDING_COMPLETE:
        return prefs.building_complete;
      case NotificationCategory.MARKETING:
        return prefs.marketing;
      default:
        return false;
    }
  }

  /**
   * Reset preferences to defaults for a user.
   * 
   * @param userId - User ID
   * @returns Reset preferences
   */
  async resetToDefaults(userId: string): Promise<UserNotificationPreferences> {
    return this.updatePreferences(userId, {
      daily_reminders: true,
      events: true,
      research_complete: true,
      energy_restored: true,
      building_complete: true,
      marketing: false
    });
  }
}

// Singleton instance
let preferencesServiceInstance: UserPreferencesService | null = null;

export function getUserPreferencesService(
  supabaseUrl?: string,
  supabaseKey?: string
): UserPreferencesService {
  if (!preferencesServiceInstance) {
    const url = supabaseUrl || process.env.SUPABASE_URL;
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing required environment variables for UserPreferencesService');
    }

    preferencesServiceInstance = new UserPreferencesService(url, key);
  }

  return preferencesServiceInstance;
}
