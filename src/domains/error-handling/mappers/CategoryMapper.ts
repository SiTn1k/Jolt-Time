/**
 * Category Mapper
 *
 * Maps between ErrorCategory entity and various DTOs.
 * Only mapping - no error handling logic.
 */

import type { ErrorCategory } from '../entities/ErrorCategory';
import type { ErrorCategoryRecord } from '../entities/ErrorCategory';
import type {
  CreateErrorCategoryDto,
  UpdateErrorCategoryDto,
  ErrorCategoryResponseDto,
} from '../dto/ErrorCategory.dto';

/**
 * Mapper for converting between ErrorCategory entity and DTOs.
 */
export class CategoryMapper {
  /**
   * Converts an ErrorCategory entity to ErrorCategoryResponseDto.
   */
  public static toResponse(category: ErrorCategory): ErrorCategoryResponseDto {
    return {
      categoryId: category.categoryId.value,
      name: category.name,
      description: category.description,
      categoryType: category.categoryType,
      metadata: category.metadata,
      isActive: category.isActive,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an array of ErrorCategory entities to ErrorCategoryResponseDto array.
   */
  public static toResponseList(categories: ErrorCategory[]): ErrorCategoryResponseDto[] {
    return categories.map((category) => this.toResponse(category));
  }

  /**
   * Converts a CreateErrorCategoryDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateErrorCategoryDto): Omit<CreateErrorCategoryDto, never> {
    return {
      categoryId: dto.categoryId,
      name: dto.name,
      description: dto.description,
      categoryType: dto.categoryType,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateErrorCategoryDto to entity input.
   */
  public static fromUpdateDto(dto: UpdateErrorCategoryDto): Omit<UpdateErrorCategoryDto, never> {
    return {
      name: dto.name,
      description: dto.description,
      categoryType: dto.categoryType,
      metadata: dto.metadata,
      isActive: dto.isActive,
    };
  }

  /**
   * Converts a database record to CreateErrorCategoryDto format.
   */
  public static fromRecordToDto(record: ErrorCategoryRecord): CreateErrorCategoryDto {
    return {
      categoryId: record.category_id,
      name: record.name,
      description: record.description,
      categoryType: record.category_type as CreateErrorCategoryDto['categoryType'],
      metadata: record.metadata,
    };
  }

  /**
   * Converts an ErrorCategory entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(category: ErrorCategory): Omit<ErrorCategoryRecord, never> {
    return {
      category_id: category.categoryId.value,
      name: category.name,
      description: category.description,
      category_type: category.categoryType,
      metadata: category.metadata,
      is_active: category.isActive,
      created_at: category.createdAt.toISOString(),
      updated_at: category.updatedAt.toISOString(),
    };
  }
}
