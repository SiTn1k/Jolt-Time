/**
 * Template Mapper
 *
 * Maps between NotificationTemplate entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { NotificationTemplate, type NotificationTemplateRecord } from '../entities/NotificationTemplate';
import type {
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  QueryNotificationTemplateDto,
} from '../dto/NotificationTemplateDto';
import type {
  NotificationTemplateResponseDto,
  NotificationTemplateSummaryDto,
} from '../dto/NotificationResponse.dto';

/**
 * Mapper for converting between NotificationTemplate entity and DTOs.
 */
export class TemplateMapper {
  /**
   * Converts a NotificationTemplate entity to NotificationTemplateResponseDto.
   */
  public static toResponse(template: NotificationTemplate): NotificationTemplateResponseDto {
    return {
      templateId: template.templateId.value,
      slug: template.slug,
      title: template.title,
      body: template.body,
      variables: template.variables,
      channel: template.channel,
      metadata: template.metadata,
    };
  }

  /**
   * Converts a NotificationTemplate entity to NotificationTemplateSummaryDto.
   */
  public static toSummary(template: NotificationTemplate): NotificationTemplateSummaryDto {
    return {
      templateId: template.templateId.value,
      slug: template.slug,
      title: template.title,
      channel: template.channel,
      isActive: template.metadata.isActive,
    };
  }

  /**
   * Converts an array of NotificationTemplate entities to NotificationTemplateResponseDto array.
   */
  public static toResponseList(templates: NotificationTemplate[]): NotificationTemplateResponseDto[] {
    return templates.map((template) => this.toResponse(template));
  }

  /**
   * Converts an array of NotificationTemplate entities to NotificationTemplateSummaryDto array.
   */
  public static toSummaryList(templates: NotificationTemplate[]): NotificationTemplateSummaryDto[] {
    return templates.map((template) => this.toSummary(template));
  }

  /**
   * Converts a CreateNotificationTemplateDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateNotificationTemplateDto): Omit<CreateNotificationTemplateDto, never> {
    return {
      slug: dto.slug,
      title: dto.title,
      body: dto.body,
      channel: dto.channel,
      variables: dto.variables,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateNotificationTemplateDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateNotificationTemplateDto): Partial<NotificationTemplate> {
    return {
      title: dto.title,
      body: dto.body,
      variables: dto.variables,
      metadata: dto.metadata,
    } as Partial<NotificationTemplate>;
  }

  /**
   * Converts a database record to NotificationTemplate entity.
   */
  public static fromRecord(record: NotificationTemplateRecord): NotificationTemplate {
    return NotificationTemplate.fromDatabase(record);
  }

  /**
   * Converts a NotificationTemplate entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(template: NotificationTemplate): Omit<NotificationTemplateRecord, never> {
    return {
      template_id: template.templateId.value,
      slug: template.slug,
      title: template.title,
      body: template.body,
      variables: template.variables,
      channel: template.channel,
      metadata: template.metadata,
    };
  }

  /**
   * Converts a QueryNotificationTemplateDto to repository query filters.
   */
  public static toQueryFilters(dto: QueryNotificationTemplateDto) {
    return {
      slug: dto.slug,
      channel: dto.channel,
      category: dto.category,
      isActive: dto.isActive,
      tags: dto.tags,
      limit: dto.limit ?? 50,
      offset: dto.offset ?? 0,
    };
  }
}