/**
 * Notification Service Tests
 *
 * Unit tests for NotificationService.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationService, DeliveryState } from '../services/NotificationService';
import type { INotificationRepository } from '../interfaces/INotificationRepository';
import { Notification } from '../entities/Notification';
import { NotificationTemplate } from '../entities/NotificationTemplate';
import { NotificationChannel } from '../entities/NotificationChannel';
import { NotificationId } from '../value-objects/NotificationId';
import { TemplateId } from '../value-objects/TemplateId';
import { ChannelId } from '../value-objects/ChannelId';
import { NotificationStatus } from '../types/NotificationStatus';
import { NotificationChannelType } from '../types/NotificationChannelType';
import { NotificationPriority } from '../types/NotificationPriority';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockRepository: INotificationRepository;

  const testPlayerProfileId = '123e4567-e89b-42d3-a456-426614174000';
  const testTemplateId = '123e4567-e89b-42d3-a456-426614174001';
  const testNotificationId = '123e4567-e89b-42d3-a456-426614174002';
  const testChannelId = '123e4567-e89b-42d3-a456-426614174003';

  const createTestNotification = (overrides = {}): Notification => {
    const now = new Date();
    return Notification.fromDatabase({
      notification_id: testNotificationId,
      player_profile_id: testPlayerProfileId,
      template_id: testTemplateId,
      channel: NotificationChannelType.IN_APP,
      status: NotificationStatus.PENDING,
      priority: NotificationPriority.NORMAL,
      payload: {
        title: 'Test Notification',
        body: 'This is a test notification',
      },
      created_at: now.toISOString(),
      scheduled_at: null,
      sent_at: null,
      metadata: {},
      ...overrides,
    });
  };

  const createTestTemplate = (): NotificationTemplate => {
    return NotificationTemplate.fromDatabase({
      template_id: testTemplateId,
      slug: 'test-template',
      title: 'Hello {{name}}!',
      body: 'Your score is {{score}}.',
      variables: ['name', 'score'],
      channel: NotificationChannelType.IN_APP,
      metadata: {
        name: 'Test Template',
        category: 'test',
        isActive: true,
        schemaVersion: 1,
      },
    });
  };

  const createTestChannel = (): NotificationChannel => {
    return NotificationChannel.fromDatabase({
      channel_id: testChannelId,
      channel_type: NotificationChannelType.IN_APP,
      is_enabled: true,
      configuration: {
        enableBatching: false,
        batchSize: 100,
        batchIntervalMs: 60000,
        enableRetries: true,
        maxRetries: 3,
        retryDelayMs: 5000,
        trackReceipts: true,
      },
      metadata: {
        name: 'In-App Channel',
        schemaVersion: 1,
      },
    });
  };

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      updateStatus: vi.fn(),
      count: vi.fn(),
      findTemplateById: vi.fn(),
      findTemplateBySlug: vi.fn(),
      findAllTemplates: vi.fn(),
      saveTemplate: vi.fn(),
      deleteTemplate: vi.fn(),
      findChannelById: vi.fn(),
      findChannelByType: vi.fn(),
      findAllChannels: vi.fn(),
      saveChannel: vi.fn(),
      deleteChannel: vi.fn(),
    };

    notificationService = new NotificationService(mockRepository);
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const payload = {
        title: 'Test Title',
        body: 'Test Body',
      };

      const savedNotification = createTestNotification({ payload });
      vi.mocked(mockRepository.save).mockResolvedValue(savedNotification);

      const result = await notificationService.createNotification({
        playerProfileId: testPlayerProfileId,
        templateId: testTemplateId,
        channel: NotificationChannelType.IN_APP,
        payload,
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('routeNotification', () => {
    it('should route to correct channel handler', () => {
      const telegramNotification = createTestNotification({ channel: NotificationChannelType.TELEGRAM });
      const result = notificationService.routeNotification(telegramNotification);

      expect(result.channel).toBe(NotificationChannelType.TELEGRAM);
      expect(result.handler).toBe('TelegramHandler');
      expect(result.canDeliver).toBe(true);
    });

    it('should indicate cannot deliver for terminal states', () => {
      const sentNotification = createTestNotification({ status: NotificationStatus.SENT });
      const result = notificationService.routeNotification(sentNotification);

      expect(result.canDeliver).toBe(false);
    });
  });

  describe('renderTemplate', () => {
    it('should render template with variables', () => {
      const template = createTestTemplate();
      const variables = { name: 'John', score: '100' };

      const result = notificationService.renderTemplate(template, variables);

      expect(result.title).toBe('Hello John!');
      expect(result.body).toBe('Your score is 100.');
      expect(result.usedVariables).toEqual(['name', 'score']);
      expect(result.missingVariables).toEqual([]);
    });

    it('should detect missing variables', () => {
      const template = createTestTemplate();
      const variables = { name: 'John' };

      const result = notificationService.renderTemplate(template, variables);

      expect(result.missingVariables).toContain('score');
    });
  });

  describe('validateTemplateVariables', () => {
    it('should validate all required variables provided', () => {
      const template = createTestTemplate();
      const variables = { name: 'John', score: '100' };

      const result = notificationService.validateTemplateVariables(template, variables);

      expect(result.isValid).toBe(true);
      expect(result.missingVariables).toEqual([]);
    });

    it('should detect missing required variables', () => {
      const template = createTestTemplate();
      const variables = { name: 'John' };

      const result = notificationService.validateTemplateVariables(template, variables);

      expect(result.isValid).toBe(false);
      expect(result.missingVariables).toContain('score');
    });
  });

  describe('getDeliveryState', () => {
    it('should return correct delivery state for pending status', () => {
      const pending = createTestNotification({ status: NotificationStatus.PENDING });
      expect(notificationService.getDeliveryState(pending)).toBe(DeliveryState.CREATED);
    });

    it('should return correct delivery state for scheduled status', () => {
      const scheduled = createTestNotification({ status: NotificationStatus.SCHEDULED });
      expect(notificationService.getDeliveryState(scheduled)).toBe(DeliveryState.SCHEDULED);
    });

    it('should return correct delivery state for sent status', () => {
      const sent = createTestNotification({ status: NotificationStatus.SENT });
      expect(notificationService.getDeliveryState(sent)).toBe(DeliveryState.SENT);
    });
  });

  describe('loadInbox', () => {
    it('should load inbox with pagination', async () => {
      const notifications = [
        createTestNotification(),
        createTestNotification(),
        createTestNotification(),
      ];
      vi.mocked(mockRepository.findAll).mockResolvedValue(notifications);
      vi.mocked(mockRepository.count).mockResolvedValue(3);

      const result = await notificationService.loadInbox({
        playerProfileId: testPlayerProfileId,
        limit: 10,
        offset: 0,
      });

      expect(result.notifications).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('getNotificationSummary', () => {
    it('should return notification summary statistics', async () => {
      const notifications = [
        createTestNotification({ status: NotificationStatus.SENT, channel: NotificationChannelType.IN_APP }),
        createTestNotification({ status: NotificationStatus.SENT, channel: NotificationChannelType.TELEGRAM }),
        createTestNotification({ status: NotificationStatus.FAILED, channel: NotificationChannelType.IN_APP }),
      ];

      vi.mocked(mockRepository.findAll).mockResolvedValue(notifications);

      const result = await notificationService.getNotificationSummary(testPlayerProfileId);

      expect(result.total).toBe(3);
      expect(result.byStatus[NotificationStatus.SENT]).toBe(2);
      expect(result.byChannel[NotificationChannelType.IN_APP]).toBe(2);
    });
  });
});
