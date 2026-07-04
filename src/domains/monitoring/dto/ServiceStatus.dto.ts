/**
 * ServiceStatusDto
 *
 * Data Transfer Object for ServiceStatus entities.
 */

/**
 * DTO for creating or updating a service status.
 */
export interface CreateServiceStatusDto {
  serviceName: string;
  status: string;
  version?: string;
  metadata?: Record<string, unknown>;
}

/**
 * DTO for service status response.
 */
export interface ServiceStatusDto {
  serviceId: string;
  serviceName: string;
  status: string;
  lastHeartbeat: string;
  version?: string;
  metadata?: Record<string, unknown>;
}

/**
 * DTO for listing service statuses with filters.
 */
export interface ListServiceStatusesDto {
  page?: number;
  pageSize?: number;
  serviceName?: string;
  status?: string;
  heartbeatAfter?: string;
  heartbeatBefore?: string;
}
