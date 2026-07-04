/**
 * Incident Mapper
 *
 * Maps between SecurityIncident entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { SecurityIncident, SecurityIncidentRecord } from '../entities/SecurityIncident';
import type { SecurityIncidentResponseDto, CreateSecurityIncidentDto } from '../dto/SecurityIncident.dto';

/**
 * Mapper for converting between SecurityIncident entity and DTOs.
 */
export class IncidentMapper {
  /**
   * Converts a SecurityIncident entity to SecurityIncidentResponseDto.
   */
  public static toResponse(incident: SecurityIncident): SecurityIncidentResponseDto {
    return {
      incidentId: incident.incidentId.value,
      incidentType: incident.incidentType,
      severity: incident.severity,
      status: incident.status,
      actorId: incident.actorId,
      source: incident.source,
      description: incident.description,
      createdAt: incident.createdAt.toISOString(),
      metadata: incident.metadata,
    };
  }

  /**
   * Converts an array of SecurityIncident entities to SecurityIncidentResponseDto array.
   */
  public static toResponseList(incidents: SecurityIncident[]): SecurityIncidentResponseDto[] {
    return incidents.map((incident) => this.toResponse(incident));
  }

  /**
   * Converts a CreateSecurityIncidentDto to entity input.
   */
  public static fromCreateDto(dto: CreateSecurityIncidentDto): Omit<CreateSecurityIncidentDto, never> {
    return {
      incidentType: dto.incidentType,
      severity: dto.severity,
      status: dto.status,
      actorId: dto.actorId,
      source: dto.source,
      description: dto.description,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateSecurityIncidentDto format.
   */
  public static fromRecordToDto(record: SecurityIncidentRecord): CreateSecurityIncidentDto {
    return {
      incidentType: record.incident_type,
      severity: record.severity as CreateSecurityIncidentDto['severity'],
      status: record.status as CreateSecurityIncidentDto['status'],
      actorId: record.actor_id,
      source: record.source,
      description: record.description,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a SecurityIncident entity to a database record format.
   */
  public static toRecord(incident: SecurityIncident): Omit<SecurityIncidentRecord, never> {
    return {
      incident_id: incident.incidentId.value,
      incident_type: incident.incidentType,
      severity: incident.severity,
      status: incident.status,
      actor_id: incident.actorId,
      source: incident.source,
      description: incident.description,
      created_at: incident.createdAt.toISOString(),
      metadata: incident.metadata,
    };
  }
}
