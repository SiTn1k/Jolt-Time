/**
 * Notification Domain Dependency Injection Registration
 *
 * Registers all notification domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseNotificationRepository } from './repositories/SupabaseNotificationRepository';
import { NotificationService } from './services/NotificationService';
import { NotificationMapper } from './mappers/NotificationMapper';
import { TemplateMapper } from './mappers/TemplateMapper';
import { ChannelMapper } from './mappers/ChannelMapper';
import { NotificationValidator } from './validators/NotificationValidator';
import { TemplateValidator } from './validators/TemplateValidator';
import { ChannelValidator } from './validators/ChannelValidator';

/**
 * Notification Domain DI configuration keys.
 */
export const NOTIFICATION_TOKENS = {
  NOTIFICATION_REPOSITORY: Symbol.for('SupabaseNotificationRepository'),
  NOTIFICATION_SERVICE: Symbol.for('NotificationService'),
  NOTIFICATION_MAPPER: Symbol.for('NotificationMapper'),
  TEMPLATE_MAPPER: Symbol.for('TemplateMapper'),
  CHANNEL_MAPPER: Symbol.for('ChannelMapper'),
  NOTIFICATION_VALIDATOR: Symbol.for('NotificationValidator'),
  TEMPLATE_VALIDATOR: Symbol.for('TemplateValidator'),
  CHANNEL_VALIDATOR: Symbol.for('ChannelValidator'),
} as const;

/**
 * Register all notification domain dependencies with the container.
 */
export function registerNotificationDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(NotificationValidator, new NotificationValidator());
  container.registerInstance(TemplateValidator, new TemplateValidator());
  container.registerInstance(ChannelValidator, new ChannelValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(NotificationMapper, new NotificationMapper());
  container.registerInstance(TemplateMapper, new TemplateMapper());
  container.registerInstance(ChannelMapper, new ChannelMapper());

  // Repository (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseNotificationRepository, { lifetime: Lifetime.Singleton });

  // Service (Singleton - depends on repository)
  container.registerFactory(
    NotificationService,
    () => {
      const repository = container.resolve(SupabaseNotificationRepository);
      return new NotificationService(repository);
    },
    { lifetime: Lifetime.Singleton }
  );
}

/**
 * Quick setup function for notification domain.
 * Creates and configures all notification domain components.
 */
export function setupNotificationDomain(): {
  notificationRepository: SupabaseNotificationRepository;
  notificationService: NotificationService;
  notificationMapper: NotificationMapper;
  templateMapper: TemplateMapper;
  channelMapper: ChannelMapper;
  notificationValidator: NotificationValidator;
  templateValidator: TemplateValidator;
  channelValidator: ChannelValidator;
} {
  const notificationRepository = new SupabaseNotificationRepository();
  const notificationMapper = new NotificationMapper();
  const templateMapper = new TemplateMapper();
  const channelMapper = new ChannelMapper();
  const notificationValidator = new NotificationValidator();
  const templateValidator = new TemplateValidator();
  const channelValidator = new ChannelValidator();
  const notificationService = new NotificationService(notificationRepository);

  return {
    notificationRepository,
    notificationService,
    notificationMapper,
    templateMapper,
    channelMapper,
    notificationValidator,
    templateValidator,
    channelValidator,
  };
}