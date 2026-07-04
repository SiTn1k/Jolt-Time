/**
 * Security Mapper
 *
 * Maps between security entities and DTOs.
 * No database logic - pure transformation only.
 */

import type { SecurityIncident, SecurityIncidentRecord } from '../entities/SecurityIncident';
import type { SecurityPolicy, SecurityPolicyRecord } from '../entities/SecurityPolicy';
import type { SecuritySession, SecuritySessionRecord } from '../entities/SecuritySession';
import type { SecurityIncidentResponseDto, CreateSecurityIncidentDto } from '../dto/SecurityIncident.dto';
import type { SecurityPolicyResponseDto, CreateSecurityPolicyDto, UpdateSecurityPolicyDto } from '../dto/SecurityPolicy.dto';
import type { SecuritySessionResponseDto, CreateSecuritySessionDto, UpdateSecuritySessionDto } from '../dto/SecuritySession.dto';
import type { SecurityStatistics } from '../types/SecurityStatistics';

/**
 * Mapper for converting between security entities and DTOs.
 * Only mapping - no security logic.
 */
export class SecurityMapper {
  // ============ Incident Mappings ============

  /**
   * Converts a SecurityIncident entity to SecurityIncidentResponseDto.
   */
  public static incidentToResponse(incident: SecurityIncident): SecurityIncidentResponseDto {
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
  public static incidentsToResponseList(incidents: SecurityIncident[]): SecurityIncidentResponseDto[] {
    return incidents.map((incident) => this.incidentToResponse(incident));
  }

  /**
   * Converts a CreateSecurityIncidentDto to entity input.
   */
  public static incidentFromCreateDto(dto: CreateSecurityIncidentDto): Omit<CreateSecurityIncidentDto, never> {
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
  public static incidentFromRecordToDto(record: SecurityIncidentRecord): CreateSecurityIncidentDto {
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
  public static incidentToRecord(incident: SecurityIncident): Omit<SecurityIncidentRecord, never> {
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

  // ============ Policy Mappings ============

  /**
   * Converts a SecurityPolicy entity to SecurityPolicyResponseDto.
   */
  public static policyToResponse(policy: SecurityPolicy): SecurityPolicyResponseDto {
    return {
      policyId: policy.policyId.value,
      policyName: policy.policyName,
      policyType: policy.policyType,
      enabled: policy.enabled,
      configuration: policy.configuration,
      metadata: policy.metadata,
    };
  }

  /**
   * Converts an array of SecurityPolicy entities to SecurityPolicyResponseDto array.
   */
  public static policiesToResponseList(policies: SecurityPolicy[]): SecurityPolicyResponseDto[] {
    return policies.map((policy) => this.policyToResponse(policy));
  }

  /**
   * Converts a CreateSecurityPolicyDto to entity input.
   */
  public static policyFromCreateDto(dto: CreateSecurityPolicyDto): Omit<CreateSecurityPolicyDto, never> {
    return {
      policyName: dto.policyName,
      policyType: dto.policyType,
      enabled: dto.enabled,
      configuration: dto.configuration,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateSecurityPolicyDto format.
   */
  public static policyFromRecordToDto(record: SecurityPolicyRecord): CreateSecurityPolicyDto {
    return {
      policyName: record.policy_name,
      policyType: record.policy_type as CreateSecurityPolicyDto['policyType'],
      enabled: record.enabled,
      configuration: record.configuration,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a SecurityPolicy entity to a database record format.
   */
  public static policyToRecord(policy: SecurityPolicy): Omit<SecurityPolicyRecord, never> {
    return {
      policy_id: policy.policyId.value,
      policy_name: policy.policyName,
      policy_type: policy.policyType,
      enabled: policy.enabled,
      configuration: policy.configuration,
      metadata: policy.metadata,
    };
  }

  // ============ Session Mappings ============

  /**
   * Converts a SecuritySession entity to SecuritySessionResponseDto.
   */
  public static sessionToResponse(session: SecuritySession): SecuritySessionResponseDto {
    return {
      sessionId: session.sessionId.value,
      actorId: session.actorId,
      status: session.status,
      ipAddress: session.ipAddress,
      device: session.device,
      createdAt: session.createdAt.toISOString(),
      expiresAt: session.expiresAt.toISOString(),
      metadata: session.metadata,
    };
  }

  /**
   * Converts an array of SecuritySession entities to SecuritySessionResponseDto array.
   */
  public static sessionsToResponseList(sessions: SecuritySession[]): SecuritySessionResponseDto[] {
    return sessions.map((session) => this.sessionToResponse(session));
  }

  /**
   * Converts a CreateSecuritySessionDto to entity input.
   */
  public static sessionFromCreateDto(dto: CreateSecuritySessionDto): Omit<CreateSecuritySessionDto, never> {
    return {
      actorId: dto.actorId,
      status: dto.status,
      ipAddress: dto.ipAddress,
      device: dto.device,
      expiresAt: dto.expiresAt,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateSecuritySessionDto format.
   */
  public static sessionFromRecordToDto(record: SecuritySessionRecord): CreateSecuritySessionDto {
    return {
      actorId: record.actor_id,
      status: record.status as CreateSecuritySessionDto['status'],
      ipAddress: record.ip_address,
      device: record.device,
      expiresAt: record.expires_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a SecuritySession entity to a database record format.
   */
  public static sessionToRecord(session: SecuritySession): Omit<SecuritySessionRecord, never> {
    return {
      session_id: session.sessionId.value,
      actor_id: session.actorId,
      status: session.status,
      ip_address: session.ipAddress,
      device: session.device,
      created_at: session.createdAt.toISOString(),
      expires_at: session.expiresAt.toISOString(),
      metadata: session.metadata,
    };
  }

  // ============ Statistics Mappings ============

  /**
   * Converts a SecurityStatistics to a response format.
   */
  public static statisticsToResponse(statistics: SecurityStatistics): { statistics: SecurityStatistics } {
    return { statistics };
  }
}
