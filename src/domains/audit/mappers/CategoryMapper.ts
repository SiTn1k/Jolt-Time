/**
 * Category Mapper
 *
 * Maps between AuditCategory entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { AuditCategory, AuditCategoryRecord } from '../entities/AuditCategory';
import type { CreateAuditCategoryDto, AuditCategoryResponseDto } from '../dto/AuditCategory.dto';

/**
 * Mapper for converting between AuditCategory entity and DTOs.
 */
export class CategoryMapper {
  /**
   * Converts an AuditCategory entity to AuditCategoryResponseDto.
   */
  public static toResponse(category: AuditCategory): AuditCategoryResponseDto {
    return {
      categoryId: category.categoryId.value,
      name: category.name,
      description: category.description,
      metadata: category.metadata,
    };
  }

  /**
   * Converts an array of AuditCategory entities to AuditCategoryResponseDto array.
   */
  public static toResponseList(categories: AuditCategory[]): AuditCategoryResponseDto[] {
    return categories.map((category) => this.toResponse(category));
  }

  /**
   * Converts a CreateAuditCategoryDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAuditCategoryDto): Omit<CreateAuditCategoryDto, never> {
    return {
      name: dto.name,
      description: dto.description,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateAuditCategoryDto format.
   */
  public static fromRecordToDto(record: AuditCategoryRecord): CreateAuditCategoryDto {
    return {
      name: record.name,
      description: record.description,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an AuditCategory entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(category: AuditCategory): Omit<AuditCategoryRecord, never> {
    return {
      category_id: category.categoryId.value,
      name: category.name,
      description: category.description,
      metadata: category.metadata,
    };
  }
}
