/**
 * Exhibit Mapper
 *
 * Maps between MuseumExhibit entity and various DTOs.
 * No database logic - pure transformation only.
 *
 * IMPORTANT: Exhibits reference inventory items, not artifacts directly.
 * The mapper handles the reference mapping properly.
 */

import { MuseumExhibit } from '../entities/MuseumExhibit';
import type { MuseumExhibitRecord } from '../entities/MuseumExhibit';
import type { CreateExhibitDto } from '../dto/CreateExhibit.dto';
import type { MuseumExhibitResponseDto, MuseumExhibitSummaryDto } from '../dto/MuseumResponse.dto';

/**
 * Mapper for converting between MuseumExhibit entity and DTOs.
 */
export class ExhibitMapper {
  /**
   * Converts a MuseumExhibit entity to MuseumExhibitResponseDto.
   */
  public static toResponse(exhibit: MuseumExhibit): MuseumExhibitResponseDto {
    return {
      exhibitId: exhibit.exhibitId.value,
      hallId: exhibit.hallId.value,
      inventoryItemId: exhibit.inventoryItemId.value,
      artifactId: exhibit.artifactId,
      displayOrder: exhibit.displayOrder.value,
      condition: exhibit.condition,
      popularity: exhibit.popularity,
      placedAt: exhibit.placedAt.toISOString(),
      createdAt: exhibit.createdAt.toISOString(),
      updatedAt: exhibit.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a MuseumExhibit entity to MuseumExhibitSummaryDto.
   */
  public static toSummary(exhibit: MuseumExhibit): MuseumExhibitSummaryDto {
    return {
      exhibitId: exhibit.exhibitId.value,
      artifactId: exhibit.artifactId,
      displayOrder: exhibit.displayOrder.value,
      condition: exhibit.condition,
      popularity: exhibit.popularity,
    };
  }

  /**
   * Converts an array of MuseumExhibit entities to MuseumExhibitResponseDto array.
   */
  public static toResponseList(exhibits: MuseumExhibit[]): MuseumExhibitResponseDto[] {
    return exhibits.map((exhibit) => this.toResponse(exhibit));
  }

  /**
   * Converts an array of MuseumExhibit entities to MuseumExhibitSummaryDto array.
   */
  public static toSummaryList(exhibits: MuseumExhibit[]): MuseumExhibitSummaryDto[] {
    return exhibits.map((exhibit) => this.toSummary(exhibit));
  }

  /**
   * Converts a CreateExhibitDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   *
   * IMPORTANT: Validates that inventoryItemId is provided since exhibits
   * reference inventory items, not artifacts directly.
   */
  public static fromCreateDto(dto: CreateExhibitDto): Omit<CreateExhibitDto, never> {
    if (!dto.inventoryItemId) {
      throw new Error('InventoryItemId is required for exhibit creation');
    }

    return {
      hallId: dto.hallId,
      inventoryItemId: dto.inventoryItemId,
      artifactId: dto.artifactId,
      displayOrder: dto.displayOrder,
      condition: dto.condition,
      popularity: dto.popularity,
    };
  }

  /**
   * Converts a database record to MuseumExhibit entity format.
   */
  public static fromRecord(record: MuseumExhibitRecord): MuseumExhibit {
    return MuseumExhibit.fromDatabase(record);
  }

  /**
   * Converts a MuseumExhibit entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(exhibit: MuseumExhibit): MuseumExhibitRecord {
    return {
      exhibit_id: exhibit.exhibitId.value,
      hall_id: exhibit.hallId.value,
      inventory_item_id: exhibit.inventoryItemId.value,
      artifact_id: exhibit.artifactId,
      display_order: exhibit.displayOrder.value,
      condition: exhibit.condition,
      popularity: exhibit.popularity,
      placed_at: exhibit.placedAt.toISOString(),
      metadata: exhibit.metadata,
      created_at: exhibit.createdAt.toISOString(),
      updated_at: exhibit.updatedAt.toISOString(),
    };
  }
}
