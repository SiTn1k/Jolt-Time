/**
 * NotificationTemplate Entity
 *
 * Domain entity representing a reusable notification template.
 * Templates define the structure and content of notifications.
 *
 * NotificationTemplate Entity Responsibilities:
 * - Store notification content templates
 * - Define required variables for template rendering
 * - Track template metadata and configuration
 *
 * NotificationTemplate Entity is NOT:
 * - A notification instance
 * - A delivery mechanism
 * - A channel configuration
 */

import type { INotificationTemplate, NotificationTemplateMetadata } from '../interfaces/INotificationTemplate';
import { TemplateId } from '../value-objects/TemplateId';
import { NotificationChannelType } from '../types/NotificationChannelType';

/**
 * Default template metadata.
 */
const DEFAULT_TEMPLATE_METADATA: NotificationTemplateMetadata = {
  name: '',
  category: 'general',
  isActive: true,
  schemaVersion: 1,
};

/**
 * NotificationTemplate entity class.
 * Immutable domain entity representing a notification template.
 */
export class NotificationTemplate implements INotificationTemplate {
  /** Unique template identifier */
  public readonly templateId: TemplateId;

  /** Human-readable template slug */
  public readonly slug: string;

  /** Default notification title */
  public readonly title: string;

  /** Default notification body */
  public readonly body: string;

  /** List of variable names used in the template */
  public readonly variables: string[];

  /** Target delivery channel */
  public readonly channel: NotificationChannelType;

  /** Template metadata */
  public readonly metadata: NotificationTemplateMetadata;

  /**
   * Creates a new NotificationTemplate instance.
   * @param props NotificationTemplate properties
   */
  constructor(props: NotificationTemplateProps) {
    this.templateId = props.templateId;
    this.slug = props.slug;
    this.title = props.title;
    this.body = props.body;
    this.variables = props.variables;
    this.channel = props.channel;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new NotificationTemplate.
   * Factory method for template creation.
   */
  public static create(params: {
    templateId: TemplateId;
    slug: string;
    title: string;
    body: string;
    channel: NotificationChannelType;
    metadata?: Partial<NotificationTemplateMetadata>;
    variables?: string[];
  }): NotificationTemplate {
    return new NotificationTemplate({
      templateId: params.templateId,
      slug: params.slug,
      title: params.title,
      body: params.body,
      channel: params.channel,
      variables: params.variables ?? extractVariables(params.title, params.body),
      metadata: {
        ...DEFAULT_TEMPLATE_METADATA,
        ...params.metadata,
        schemaVersion: DEFAULT_TEMPLATE_METADATA.schemaVersion,
      },
    });
  }

  /**
   * Creates a NotificationTemplate from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: NotificationTemplateRecord): NotificationTemplate {
    return new NotificationTemplate({
      templateId: TemplateId.reconstruct(record.template_id),
      slug: record.slug,
      title: record.title,
      body: record.body,
      variables: record.variables ?? [],
      channel: record.channel as NotificationChannelType,
      metadata: record.metadata ?? DEFAULT_TEMPLATE_METADATA,
    });
  }

  /**
   * Checks if this template is active.
   */
  public get isActive(): boolean {
    return this.metadata.isActive;
  }

  /**
   * Renders the template with the given variables.
   * Replaces {{variable}} placeholders with provided values.
   */
  public render(variables: Record<string, string>): { title: string; body: string } {
    let renderedTitle = this.title;
    let renderedBody = this.body;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      renderedTitle = renderedTitle.replaceAll(placeholder, value);
      renderedBody = renderedBody.replaceAll(placeholder, value);
    }

    return {
      title: renderedTitle,
      body: renderedBody,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new NotificationTemplate instance.
   */
  public copyWith(params: Partial<NotificationTemplateProps>): NotificationTemplate {
    return new NotificationTemplate({
      templateId: params.templateId ?? this.templateId,
      slug: params.slug ?? this.slug,
      title: params.title ?? this.title,
      body: params.body ?? this.body,
      variables: params.variables ?? this.variables,
      channel: params.channel ?? this.channel,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the NotificationTemplate to a plain object.
   */
  public toJSON(): NotificationTemplateJSON {
    return {
      templateId: this.templateId.value,
      slug: this.slug,
      title: this.title,
      body: this.body,
      variables: this.variables,
      channel: this.channel,
      metadata: this.metadata,
    };
  }
}

/**
 * Extracts variable names from title and body templates.
 */
function extractVariables(title: string, body: string): string[] {
  const variablePattern = /\{\{(\w+)\}\}/g;
  const variables = new Set<string>();

  let match;
  while ((match = variablePattern.exec(title)) !== null) {
    variables.add(match[1]);
  }
  while ((match = variablePattern.exec(body)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

/**
 * NotificationTemplate properties interface for constructor.
 */
export interface NotificationTemplateProps {
  templateId: TemplateId;
  slug: string;
  title: string;
  body: string;
  variables: string[];
  channel: NotificationChannelType;
  metadata: NotificationTemplateMetadata;
}

/**
 * Database record representation of NotificationTemplate.
 */
export interface NotificationTemplateRecord {
  template_id: string;
  slug: string;
  title: string;
  body: string;
  variables: string[] | null;
  channel: string;
  metadata: NotificationTemplateMetadata | null;
}

/**
 * JSON serialization representation of NotificationTemplate.
 */
export interface NotificationTemplateJSON {
  templateId: string;
  slug: string;
  title: string;
  body: string;
  variables: string[];
  channel: NotificationChannelType;
  metadata: NotificationTemplateMetadata;
}