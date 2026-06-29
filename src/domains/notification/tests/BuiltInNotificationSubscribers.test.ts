/**
 * Built-in Notification Subscribers Tests
 *
 * Unit tests for built-in notification event subscribers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DomainEvent } from '../../../core/events/entities/DomainEvent';
import { EventType } from '../../../core/events/value-objects/EventType';
import { AggregateId } from '../../../core/events/value-objects/AggregateId';
import {
  registerBuiltInHandlers,
  getBuiltInHandlers,
} from '../subscribers/BuiltInNotificationSubscribers';
import type { NotificationService } from '../services/NotificationService';

describe('BuiltInNotificationSubscribers', () => {
  let mockNotificationService: NotificationService;

  beforeEach(() => {
    mockNotificationService = {
      createNotification: vi.fn(),
    } as any;
  });

  describe('registerBuiltInHandlers', () => {
    it('should register all built-in handlers', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);

      expect(handlers).toHaveLength(8);
    });

    it('should return handlers for RewardGranted events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const rewardHandler = handlers.find((h) => h.handlerName === 'RewardGrantedNotificationHandler');

      expect(rewardHandler).toBeDefined();
    });

    it('should return handlers for AchievementUnlocked events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const achievementHandler = handlers.find((h) => h.handlerName === 'AchievementUnlockedNotificationHandler');

      expect(achievementHandler).toBeDefined();
    });

    it('should return handlers for QuestCompleted events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const questHandler = handlers.find((h) => h.handlerName === 'QuestCompletedNotificationHandler');

      expect(questHandler).toBeDefined();
    });

    it('should return handlers for MuseumCompleted events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const museumHandler = handlers.find((h) => h.handlerName === 'MuseumCompletedNotificationHandler');

      expect(museumHandler).toBeDefined();
    });

    it('should return handlers for ResearchCompleted events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const researchHandler = handlers.find((h) => h.handlerName === 'ResearchCompletedNotificationHandler');

      expect(researchHandler).toBeDefined();
    });

    it('should return handlers for GuildMemberJoined events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const guildHandler = handlers.find((h) => h.handlerName === 'GuildMemberJoinedNotificationHandler');

      expect(guildHandler).toBeDefined();
    });

    it('should return handlers for DailyLogin events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const dailyLoginHandler = handlers.find((h) => h.handlerName === 'DailyLoginNotificationHandler');

      expect(dailyLoginHandler).toBeDefined();
    });

    it('should return handlers for SystemAnnouncement events', () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const systemHandler = handlers.find((h) => h.handlerName === 'SystemAnnouncementNotificationHandler');

      expect(systemHandler).toBeDefined();
    });
  });

  describe('RewardGrantedHandler', () => {
    it('should create notification for RewardGranted event', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'RewardGrantedNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('RewardGranted'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'RewardRequest',
        sourceModule: 'REWARD' as any,
        payload: {
          playerProfileId: 'test-player-id',
          rewardTypes: ['currency', 'items'],
          totalValue: 100,
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(true);
    });
  });

  describe('AchievementUnlockedHandler', () => {
    it('should create notification for AchievementUnlocked event', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'AchievementUnlockedNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('AchievementUnlocked'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'Achievement',
        sourceModule: 'ACHIEVEMENT' as any,
        payload: {
          playerProfileId: 'test-player-id',
          title: 'First Victory',
          slug: 'first-victory',
          rarity: 'common',
          points: 10,
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(true);
    });
  });

  describe('QuestCompletedHandler', () => {
    it('should create notification for QuestCompleted event', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'QuestCompletedNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('QuestCompleted'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'Quest',
        sourceModule: 'QUEST' as any,
        payload: {
          playerProfileId: 'test-player-id',
          questTitle: 'First Quest',
          rewards: '100 coins, 5 gems',
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(true);
    });
  });

  describe('MuseumCompletedHandler', () => {
    it('should create notification for MuseumCompleted event', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'MuseumCompletedNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('MuseumCompleted'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'Museum',
        sourceModule: 'MUSEUM' as any,
        payload: {
          playerProfileId: 'test-player-id',
          collectionName: 'Ancient Egypt',
          completionBonus: 500,
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(true);
    });
  });

  describe('ResearchCompletedHandler', () => {
    it('should create notification for ResearchCompleted event', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'ResearchCompletedNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('ResearchCompleted'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'Research',
        sourceModule: 'ACADEMY' as any,
        payload: {
          playerProfileId: 'test-player-id',
          researchName: 'Advanced Mining',
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(true);
    });
  });

  describe('GuildMemberJoinedHandler', () => {
    it('should create notification for GuildMemberJoined event', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'GuildMemberJoinedNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('GuildMemberJoined'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'Guild',
        sourceModule: 'GUILD' as any,
        payload: {
          playerProfileId: 'test-player-id',
          guildName: 'Warriors',
          memberName: 'John',
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(true);
    });
  });

  describe('DailyLoginHandler', () => {
    it('should create notification for DailyLogin event', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'DailyLoginNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('DailyLogin'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'PlayerProfile',
        sourceModule: 'USER' as any,
        payload: {
          playerProfileId: 'test-player-id',
          streak: 7,
          bonus: 50,
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(true);
    });
  });

  describe('SystemAnnouncementHandler', () => {
    it('should return false when no target players specified', async () => {
      const handlers = registerBuiltInHandlers(mockNotificationService);
      const handler = handlers.find((h) => h.handlerName === 'SystemAnnouncementNotificationHandler')!;

      const event = DomainEvent.create({
        eventType: EventType.reconstruct('SystemAnnouncement'),
        aggregateId: AggregateId.generate(),
        aggregateType: 'System',
        sourceModule: 'SYSTEM' as any,
        payload: {
          title: 'Announcement',
          message: 'Test message',
          targetPlayerProfileIds: [],
        },
      });

      const result = await handler.handle(event);

      expect(result).toBe(false);
    });
  });
});
