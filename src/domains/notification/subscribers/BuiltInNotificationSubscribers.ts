/**
 * Built-in Notification Event Subscribers
 *
 * Event subscribers that listen to domain events and create notifications.
 * These subscribers ONLY create notifications - they do NOT modify any domain state.
 *
 * Supported Events:
 * - RewardGranted
 * - AchievementUnlocked
 * - QuestCompleted
 * - MuseumCompleted
 * - ResearchCompleted
 * - GuildMemberJoined
 * - DailyLogin
 * - SystemAnnouncement
 */

import type { DomainEvent } from '../../../core/events/entities/DomainEvent';
import { EventType } from '../../../core/events/value-objects/EventType';
import { HandlerId } from '../../../core/events/value-objects/HandlerId';
import type { IEventHandler } from '../../../core/events/interfaces/IEventHandler';
import type { NotificationService } from '../services/NotificationService';
import { NotificationChannelType } from '../types/NotificationChannelType';
import { NotificationPriority } from '../types/NotificationPriority';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('NotificationSubscribers');

/**
 * Base class for notification event handlers.
 */
abstract class BaseNotificationHandler implements IEventHandler {
  public abstract readonly handlerName: string;
  public abstract readonly eventType: EventType;
  public readonly handlerId: HandlerId;

  constructor(public readonly notificationService: NotificationService) {
    this.handlerId = HandlerId.generate();
  }

  public canHandle(eventType: EventType): boolean {
    return eventType.equals(this.eventType);
  }

  public abstract handle(event: DomainEvent): Promise<boolean>;

  protected getPlayerProfileId(event: DomainEvent): string | null {
    return (event.payload.playerProfileId as string) ?? null;
  }
}

/**
 * Handler for RewardGranted events.
 */
class RewardGrantedHandler extends BaseNotificationHandler {
  public readonly handlerName = 'RewardGrantedNotificationHandler';
  public readonly eventType = EventType.reconstruct('RewardGranted');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = this.getPlayerProfileId(event);
      if (!playerProfileId) {
        logger.warn('RewardGranted event missing playerProfileId');
        return false;
      }

      const payload = event.payload;
      const rewardTypes = (payload.rewardTypes as string[]) ?? [];
      const totalValue = (payload.totalValue as number) ?? 0;

      await this.notificationService.createNotification({
        playerProfileId,
        templateId: 'reward-granted',
        channel: NotificationChannelType.IN_APP,
        priority: NotificationPriority.NORMAL,
        payload: {
          title: '🎁 Reward Received!',
          body: `You received rewards worth ${totalValue}! Check your inventory for details.`,
          data: {
            rewardTypes: rewardTypes.join(', '),
            totalValue: String(totalValue),
          },
        },
        metadata: {
          sourceEvent: 'RewardGranted',
          sourceEventId: event.eventId.value,
        },
      });

      logger.debug('RewardGranted notification created', { playerProfileId });
      return true;
    } catch (err) {
      logger.error('Failed to handle RewardGranted event', err as Error);
      return false;
    }
  }
}

/**
 * Handler for AchievementUnlocked events.
 */
class AchievementUnlockedHandler extends BaseNotificationHandler {
  public readonly handlerName = 'AchievementUnlockedNotificationHandler';
  public readonly eventType = EventType.reconstruct('AchievementUnlocked');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = this.getPlayerProfileId(event);
      if (!playerProfileId) {
        logger.warn('AchievementUnlocked event missing playerProfileId');
        return false;
      }

      const payload = event.payload;
      const title = (payload.title as string) ?? 'Achievement Unlocked';
      const slug = (payload.slug as string) ?? '';
      const rarity = (payload.rarity as string) ?? 'common';
      const points = (payload.points as number) ?? 0;

      await this.notificationService.createNotification({
        playerProfileId,
        templateId: 'achievement-unlocked',
        channel: NotificationChannelType.IN_APP,
        priority: rarity === 'legendary' ? NotificationPriority.HIGH : NotificationPriority.NORMAL,
        payload: {
          title: `🏆 ${title}`,
          body: `Achievement unlocked: ${slug}! +${points} points`,
          data: {
            achievementSlug: slug,
            rarity,
            points: String(points),
          },
        },
        metadata: {
          sourceEvent: 'AchievementUnlocked',
          sourceEventId: event.eventId.value,
        },
      });

      logger.debug('AchievementUnlocked notification created', { playerProfileId, title });
      return true;
    } catch (err) {
      logger.error('Failed to handle AchievementUnlocked event', err as Error);
      return false;
    }
  }
}

/**
 * Handler for QuestCompleted events.
 */
class QuestCompletedHandler extends BaseNotificationHandler {
  public readonly handlerName = 'QuestCompletedNotificationHandler';
  public readonly eventType = EventType.reconstruct('QuestCompleted');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = this.getPlayerProfileId(event);
      if (!playerProfileId) {
        logger.warn('QuestCompleted event missing playerProfileId');
        return false;
      }

      const payload = event.payload;
      const questTitle = (payload.questTitle as string) ?? 'Quest';
      const rewards = (payload.rewards as string) ?? '';

      await this.notificationService.createNotification({
        playerProfileId,
        templateId: 'quest-completed',
        channel: NotificationChannelType.IN_APP,
        priority: NotificationPriority.NORMAL,
        payload: {
          title: '✅ Quest Completed!',
          body: `You completed "${questTitle}"! Rewards: ${rewards}`,
          data: {
            questTitle,
            rewards,
          },
        },
        metadata: {
          sourceEvent: 'QuestCompleted',
          sourceEventId: event.eventId.value,
        },
      });

      logger.debug('QuestCompleted notification created', { playerProfileId, questTitle });
      return true;
    } catch (err) {
      logger.error('Failed to handle QuestCompleted event', err as Error);
      return false;
    }
  }
}

/**
 * Handler for MuseumCompleted events.
 */
class MuseumCompletedHandler extends BaseNotificationHandler {
  public readonly handlerName = 'MuseumCompletedNotificationHandler';
  public readonly eventType = EventType.reconstruct('MuseumCompleted');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = this.getPlayerProfileId(event);
      if (!playerProfileId) {
        logger.warn('MuseumCompleted event missing playerProfileId');
        return false;
      }

      const payload = event.payload;
      const collectionName = (payload.collectionName as string) ?? 'Collection';
      const completionBonus = (payload.completionBonus as number) ?? 0;

      await this.notificationService.createNotification({
        playerProfileId,
        templateId: 'museum-completed',
        channel: NotificationChannelType.IN_APP,
        priority: NotificationPriority.HIGH,
        payload: {
          title: '🏛️ Museum Collection Complete!',
          body: `You completed "${collectionName}"! Bonus: ${completionBonus} coins`,
          data: {
            collectionName,
            completionBonus: String(completionBonus),
          },
        },
        metadata: {
          sourceEvent: 'MuseumCompleted',
          sourceEventId: event.eventId.value,
        },
      });

      logger.debug('MuseumCompleted notification created', { playerProfileId, collectionName });
      return true;
    } catch (err) {
      logger.error('Failed to handle MuseumCompleted event', err as Error);
      return false;
    }
  }
}

/**
 * Handler for ResearchCompleted events.
 */
class ResearchCompletedHandler extends BaseNotificationHandler {
  public readonly handlerName = 'ResearchCompletedNotificationHandler';
  public readonly eventType = EventType.reconstruct('ResearchCompleted');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = this.getPlayerProfileId(event);
      if (!playerProfileId) {
        logger.warn('ResearchCompleted event missing playerProfileId');
        return false;
      }

      const payload = event.payload;
      const researchName = (payload.researchName as string) ?? 'Research';

      await this.notificationService.createNotification({
        playerProfileId,
        templateId: 'research-completed',
        channel: NotificationChannelType.IN_APP,
        priority: NotificationPriority.NORMAL,
        payload: {
          title: '🔬 Research Complete!',
          body: `Your research "${researchName}" is complete and ready to use.`,
          data: {
            researchName,
          },
        },
        metadata: {
          sourceEvent: 'ResearchCompleted',
          sourceEventId: event.eventId.value,
        },
      });

      logger.debug('ResearchCompleted notification created', { playerProfileId, researchName });
      return true;
    } catch (err) {
      logger.error('Failed to handle ResearchCompleted event', err as Error);
      return false;
    }
  }
}

/**
 * Handler for GuildMemberJoined events.
 */
class GuildMemberJoinedHandler extends BaseNotificationHandler {
  public readonly handlerName = 'GuildMemberJoinedNotificationHandler';
  public readonly eventType = EventType.reconstruct('GuildMemberJoined');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = this.getPlayerProfileId(event);
      if (!playerProfileId) {
        logger.warn('GuildMemberJoined event missing playerProfileId');
        return false;
      }

      const payload = event.payload;
      const guildName = (payload.guildName as string) ?? 'Guild';
      const memberName = (payload.memberName as string) ?? 'A new member';

      await this.notificationService.createNotification({
        playerProfileId,
        templateId: 'guild-member-joined',
        channel: NotificationChannelType.IN_APP,
        priority: NotificationPriority.LOW,
        payload: {
          title: '👥 Guild Update',
          body: `${memberName} has joined ${guildName}!`,
          data: {
            guildName,
            memberName,
          },
        },
        metadata: {
          sourceEvent: 'GuildMemberJoined',
          sourceEventId: event.eventId.value,
        },
      });

      logger.debug('GuildMemberJoined notification created', { playerProfileId, guildName });
      return true;
    } catch (err) {
      logger.error('Failed to handle GuildMemberJoined event', err as Error);
      return false;
    }
  }
}

/**
 * Handler for DailyLogin events.
 */
class DailyLoginHandler extends BaseNotificationHandler {
  public readonly handlerName = 'DailyLoginNotificationHandler';
  public readonly eventType = EventType.reconstruct('DailyLogin');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const playerProfileId = this.getPlayerProfileId(event);
      if (!playerProfileId) {
        logger.warn('DailyLogin event missing playerProfileId');
        return false;
      }

      const payload = event.payload;
      const streak = (payload.streak as number) ?? 1;
      const bonus = (payload.bonus as number) ?? 0;

      await this.notificationService.createNotification({
        playerProfileId,
        templateId: 'daily-login',
        channel: NotificationChannelType.IN_APP,
        priority: NotificationPriority.NORMAL,
        payload: {
          title: '🌟 Daily Login Reward!',
          body: `Day ${streak} streak! You earned ${bonus} bonus coins!`,
          data: {
            streak: String(streak),
            bonus: String(bonus),
          },
        },
        metadata: {
          sourceEvent: 'DailyLogin',
          sourceEventId: event.eventId.value,
        },
      });

      logger.debug('DailyLogin notification created', { playerProfileId, streak });
      return true;
    } catch (err) {
      logger.error('Failed to handle DailyLogin event', err as Error);
      return false;
    }
  }
}

/**
 * Handler for SystemAnnouncement events.
 */
class SystemAnnouncementHandler extends BaseNotificationHandler {
  public readonly handlerName = 'SystemAnnouncementNotificationHandler';
  public readonly eventType = EventType.reconstruct('SystemAnnouncement');

  public async handle(event: DomainEvent): Promise<boolean> {
    try {
      const payload = event.payload;
      const title = (payload.title as string) ?? 'System Announcement';
      const message = (payload.message as string) ?? '';
      const targetPlayerProfileIds = (payload.targetPlayerProfileIds as string[]) ?? [];
      const priority = (payload.priority as string) ?? 'NORMAL';

      if (targetPlayerProfileIds.length === 0) {
        logger.warn('SystemAnnouncement event has no target players');
        return false;
      }

      for (const playerProfileId of targetPlayerProfileIds) {
        await this.notificationService.createNotification({
          playerProfileId,
          templateId: 'system-announcement',
          channel: NotificationChannelType.SYSTEM,
          priority: priority === 'CRITICAL' ? NotificationPriority.CRITICAL : NotificationPriority.HIGH,
          payload: {
            title: `📢 ${title}`,
            body: message,
            data: {
              announcementTitle: title,
              announcementMessage: message,
            },
          },
          metadata: {
            sourceEvent: 'SystemAnnouncement',
            sourceEventId: event.eventId.value,
          },
        });
      }

      logger.debug('SystemAnnouncement notifications created', {
        count: targetPlayerProfileIds.length,
        title,
      });
      return true;
    } catch (err) {
      logger.error('Failed to handle SystemAnnouncement event', err as Error);
      return false;
    }
  }
}

/**
 * Registry of all built-in notification handlers.
 */
export const BUILT_IN_NOTIFICATION_HANDLERS: IEventHandler[] = [];

/**
 * Registers all built-in notification handlers with the notification service.
 */
export function registerBuiltInHandlers(notificationService: NotificationService): IEventHandler[] {
  const handlers: IEventHandler[] = [
    new RewardGrantedHandler(notificationService),
    new AchievementUnlockedHandler(notificationService),
    new QuestCompletedHandler(notificationService),
    new MuseumCompletedHandler(notificationService),
    new ResearchCompletedHandler(notificationService),
    new GuildMemberJoinedHandler(notificationService),
    new DailyLoginHandler(notificationService),
    new SystemAnnouncementHandler(notificationService),
  ];

  BUILT_IN_NOTIFICATION_HANDLERS.length = 0;
  BUILT_IN_NOTIFICATION_HANDLERS.push(...handlers);

  logger.info('Registered built-in notification handlers', {
    count: handlers.length,
    handlers: handlers.map((h) => h.handlerName),
  });

  return handlers;
}

/**
 * Gets all registered built-in notification handlers.
 */
export function getBuiltInHandlers(): IEventHandler[] {
  return [...BUILT_IN_NOTIFICATION_HANDLERS];
}