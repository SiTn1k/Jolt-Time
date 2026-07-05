/**
 * Infrastructure Validator
 *
 * Validates infrastructure node-related data.
 */

import { InfrastructureType } from '../types/InfrastructureType';

/**
 * Result of infrastructure validation.
 */
export interface InfrastructureValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for infrastructure node data.
 */
export class InfrastructureValidator {
  private static readonly NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-._]*[a-zA-Z0-9]$/;
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  private static readonly REGION_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-_]*[a-zA-Z0-9]$/;

  /**
   * Validates that a node name is valid.
   */
  public static isValidNodeName(nodeName: string | null | undefined): boolean {
    if (!nodeName || typeof nodeName !== 'string') {
      return false;
    }
    return this.NAME_REGEX.test(nodeName) && nodeName.length >= 2 && nodeName.length <= 100;
  }

  /**
   * Validates that a node type is valid.
   */
  public static isValidNodeType(nodeType: string | null | undefined): boolean {
    if (!nodeType || typeof nodeType !== 'string') {
      return false;
    }
    return Object.values(InfrastructureType).includes(nodeType as InfrastructureType);
  }

  /**
   * Validates that a status is valid.
   */
  public static isValidStatus(status: string | null | undefined): boolean {
    if (!status || typeof status !== 'string') {
      return false;
    }
    return ['healthy', 'unhealthy', 'unknown', 'maintenance'].includes(status);
  }

  /**
   * Validates that a region is valid.
   */
  public static isValidRegion(region: string | null | undefined): boolean {
    if (!region || typeof region !== 'string') {
      return false;
    }
    return this.REGION_REGEX.test(region) && region.length >= 2 && region.length <= 50;
  }

  /**
   * Validates complete infrastructure node data.
   */
  public static validateInfrastructureNode(data: {
    nodeName?: string;
    nodeType?: string;
    status?: string;
    region?: string;
  }): InfrastructureValidationResult {
    const errors: string[] = [];

    if (data.nodeName !== undefined) {
      if (!this.isValidNodeName(data.nodeName)) {
        errors.push('Node name must be 2-100 alphanumeric characters, hyphens, or dots');
      }
    }

    if (data.nodeType !== undefined) {
      if (!this.isValidNodeType(data.nodeType)) {
        errors.push(`Node type must be one of: ${Object.values(InfrastructureType).join(', ')}`);
      }
    }

    if (data.status !== undefined) {
      if (!this.isValidStatus(data.status)) {
        errors.push('Status must be one of: healthy, unhealthy, unknown, maintenance');
      }
    }

    if (data.region !== undefined) {
      if (!this.isValidRegion(data.region)) {
        errors.push('Region must be 2-50 alphanumeric characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates infrastructure node data and throws if invalid.
   */
  public static validateInfrastructureNodeOrThrow(data: {
    nodeName?: string;
    nodeType?: string;
    status?: string;
    region?: string;
  }): void {
    const result = this.validateInfrastructureNode(data);
    if (!result.isValid) {
      throw new Error(`Infrastructure validation failed: ${result.errors.join('; ')}`);
    }
  }
}