/**
 * Template Validator
 *
 * Validates notification template data and business rules.
 */

import type { CreateNotificationTemplateDto } from '../dto/NotificationTemplateDto';

/**
 * Validation result with error messages.
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;

  /** List of validation errors */
  errors: string[];
}

/**
 * Slug format regex - lowercase alphanumeric with hyphens.
 */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * TemplateValidator class.
 * Validates notification template-related input data.
 */
export class TemplateValidator {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Validates a CreateNotificationTemplateDto.
   */
  public validateCreate(dto: CreateNotificationTemplateDto): ValidationResult {
    const errors: string[] = [];

    // Validate slug
    if (!dto.slug) {
      errors.push('slug is required');
    } else {
      if (dto.slug.length < 3) {
        errors.push('slug must be at least 3 characters');
      }
      if (dto.slug.length > 64) {
        errors.push('slug must not exceed 64 characters');
      }
      if (!SLUG_REGEX.test(dto.slug)) {
        errors.push(
          'slug must be lowercase alphanumeric with hyphens (e.g., "daily-reminder")'
        );
      }
    }

    // Validate title
    if (!dto.title) {
      errors.push('title is required');
    } else if (dto.title.length > 255) {
      errors.push('title must not exceed 255 characters');
    }

    // Validate body
    if (!dto.body) {
      errors.push('body is required');
    } else if (dto.body.length > 2000) {
      errors.push('body must not exceed 2000 characters');
    }

    // Validate channel
    if (!dto.channel) {
      errors.push('channel is required');
    }

    // Validate variables (optional)
    if (dto.variables) {
      if (!Array.isArray(dto.variables)) {
        errors.push('variables must be an array');
      } else {
        for (const variable of dto.variables) {
          if (!/^\w+$/.test(variable)) {
            errors.push(`Invalid variable name: ${variable}. Use alphanumeric characters only.`);
          }
        }
      }
    }

    // Validate metadata.name (if provided in metadata)
    if (dto.metadata?.name !== undefined) {
      if (typeof dto.metadata.name !== 'string') {
        errors.push('metadata.name must be a string');
      } else if (dto.metadata.name.length > 128) {
        errors.push('metadata.name must not exceed 128 characters');
      }
    }

    // Validate metadata.category (if provided in metadata)
    if (dto.metadata?.category !== undefined) {
      if (typeof dto.metadata.category !== 'string') {
        errors.push('metadata.category must be a string');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a template slug format.
   */
  public validateSlug(slug: string): ValidationResult {
    const errors: string[] = [];

    if (!slug) {
      errors.push('slug is required');
    } else if (slug.length < 3) {
      errors.push('slug must be at least 3 characters');
    } else if (slug.length > 64) {
      errors.push('slug must not exceed 64 characters');
    } else if (!SLUG_REGEX.test(slug)) {
      errors.push(
        'slug must be lowercase alphanumeric with hyphens (e.g., "daily-reminder")'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a template ID format.
   */
  public validateTemplateId(id: string): ValidationResult {
    const errors: string[] = [];

    if (!id) {
      errors.push('Template ID is required');
    } else if (!TemplateValidator.UUID_REGEX.test(id)) {
      errors.push('Template ID must be a valid UUID');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that all required variables are present.
   */
  public validateVariables(
    templateVariables: string[],
    providedVariables: Record<string, string>
  ): ValidationResult {
    const errors: string[] = [];

    for (const variable of templateVariables) {
      if (!(variable in providedVariables)) {
        errors.push(`Missing required variable: ${variable}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that template body contains all provided variables.
   */
  public validateTemplateVariables(
    title: string,
    body: string,
    variables: string[]
  ): ValidationResult {
    const errors: string[] = [];
    const usedVariables = new Set<string>();

    // Extract variables used in title and body
    const variablePattern = /\{\{(\w+)\}\}/g;
    let match;

    while ((match = variablePattern.exec(title)) !== null) {
      usedVariables.add(match[1]);
    }
    while ((match = variablePattern.exec(body)) !== null) {
      usedVariables.add(match[1]);
    }

    // Check that all declared variables are actually used
    for (const variable of variables) {
      if (!usedVariables.has(variable)) {
        errors.push(`Declared variable "${variable}" is not used in template`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}