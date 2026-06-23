/**
 * Notification Message Templates
 * 
 * Provides pre-defined message templates for each notification type.
 * Messages can be customized with dynamic parameters.
 */

import { NotificationType } from '../types/notifications';

export interface MessageParams {
  [key: string]: string | number | boolean | Date;
}

export interface NotificationMessage {
  title: string;
  message: string;
}

/**
 * Returns the notification message template for a given notification type.
 * 
 * @param type - The notification type
 * @param params - Dynamic parameters to interpolate into the message
 * @returns NotificationMessage with title and message
 */
export function getNotificationMessage(type: NotificationType, params: MessageParams = {}): NotificationMessage {
  const templates: Record<NotificationType, NotificationMessage> = {
    [NotificationType.DAILY_REWARD]: {
      title: '⏰ Daily Reward Ready!',
      message: 'Your daily reward is waiting for you! Come back and claim your bonus to keep your streak going.'
    },
    
    [NotificationType.WEEKLY_BONUS]: {
      title: '🎁 Weekly Bonus Available!',
      message: 'Your weekly bonus has been replenished! Log in now to claim your special weekly reward.'
    },
    
    [NotificationType.ENERGY_RESTORED]: {
      title: '⚡ Energy Restored!',
      message: 'Your energy has been fully restored to {energy}. Ready for your next adventure!'
    },
    
    [NotificationType.EXPEDITION_FINISHED]: {
      title: '🏆 Expedition Complete!',
      message: 'Your expedition "{expedition_name}" has finished! Return to collect your rewards.'
    },
    
    [NotificationType.RESEARCH_COMPLETED]: {
      title: '🔬 Research Complete!',
      message: 'Your research in the Academy has been completed. New knowledge awaits!'
    },
    
    [NotificationType.BUILDING_COMPLETED]: {
      title: '🏗️ Building Upgraded!',
      message: 'Your {building_name} has finished upgrading to level {level}! Check out the new features.'
    },
    
    [NotificationType.EVENT_STARTED]: {
      title: '🎉 Event Started!',
      message: 'The "{event_name}" event has begun! Join now for exclusive rewards.'
    },
    
    [NotificationType.INACTIVE_24H]: {
      title: '👋 We Miss You!',
      message: "It's been a day since you last played Jolt Time. Your rewards are waiting!"
    },
    
    [NotificationType.INACTIVE_72H]: {
      title: '🌟 Come Back!',
      message: "It's been 3 days since your last adventure. You've missed daily rewards and events!"
    },
    
    [NotificationType.INACTIVE_7D]: {
      title: '💫 Jolt Time Misses You!',
      message: "It's been a week! Log back in to claim accumulated rewards and check out what's new."
    },
    
    [NotificationType.SYSTEM_MESSAGE]: {
      title: '📢 System Update',
      message: '{message}'
    }
  };

  const template = templates[type];
  
  // Interpolate parameters into message
  let message = template.message;
  for (const [key, value] of Object.entries(params)) {
    message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }

  return {
    title: template.title,
    message
  };
}

/**
 * Generates a deduplication key for a notification.
 * 
 * Deduplication keys ensure the same notification is not sent twice.
 * Format: {type}_{userId}_{context}
 * 
 * @param type - Notification type
 * @param userId - User ID
 * @param context - Additional context (e.g., expedition_id, building_id)
 * @returns Deduplication key string
 */
export function generateDeduplicationKey(type: NotificationType, userId: string, context?: string): string {
  const base = `${type}_${userId}`;
  return context ? `${base}_${context}` : base;
}
