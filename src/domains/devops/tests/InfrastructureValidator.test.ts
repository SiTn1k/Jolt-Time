/**
 * Infrastructure Validator Tests
 *
 * Tests for InfrastructureValidator.
 */

import { describe, it, expect } from 'vitest';
import { InfrastructureValidator } from '../validators/InfrastructureValidator';
import { InfrastructureType } from '../types/InfrastructureType';

describe('InfrastructureValidator', () => {
  describe('isValidNodeName', () => {
    it('should reject null node name', () => {
      expect(InfrastructureValidator.isValidNodeName(null)).toBe(false);
    });

    it('should reject undefined node name', () => {
      expect(InfrastructureValidator.isValidNodeName(undefined)).toBe(false);
    });

    it('should accept valid node names', () => {
      expect(InfrastructureValidator.isValidNodeName('api-server-1')).toBe(true);
      expect(InfrastructureValidator.isValidNodeName('db.primary')).toBe(true);
      expect(InfrastructureValidator.isValidNodeName('cache_01')).toBe(true);
    });

    it('should reject node name shorter than 2 characters', () => {
      expect(InfrastructureValidator.isValidNodeName('a')).toBe(false);
    });

    it('should reject node name longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      expect(InfrastructureValidator.isValidNodeName(longName)).toBe(false);
    });
  });

  describe('isValidNodeType', () => {
    it('should accept all valid infrastructure types', () => {
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.API_SERVER)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.DATABASE)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.CACHE)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.QUEUE)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.LOAD_BALANCER)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.CDN)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.STORAGE)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.MONITORING)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.LOGGING)).toBe(true);
      expect(InfrastructureValidator.isValidNodeType(InfrastructureType.ORCHESTRATOR)).toBe(true);
    });

    it('should reject invalid node type', () => {
      expect(InfrastructureValidator.isValidNodeType('invalid')).toBe(false);
      expect(InfrastructureValidator.isValidNodeType('')).toBe(false);
      expect(InfrastructureValidator.isValidNodeType(null)).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    it('should accept all valid statuses', () => {
      expect(InfrastructureValidator.isValidStatus('healthy')).toBe(true);
      expect(InfrastructureValidator.isValidStatus('unhealthy')).toBe(true);
      expect(InfrastructureValidator.isValidStatus('unknown')).toBe(true);
      expect(InfrastructureValidator.isValidStatus('maintenance')).toBe(true);
    });

    it('should reject invalid status', () => {
      expect(InfrastructureValidator.isValidStatus('invalid')).toBe(false);
      expect(InfrastructureValidator.isValidStatus('')).toBe(false);
      expect(InfrastructureValidator.isValidStatus(null)).toBe(false);
    });
  });

  describe('isValidRegion', () => {
    it('should accept valid regions', () => {
      expect(InfrastructureValidator.isValidRegion('us-east-1')).toBe(true);
      expect(InfrastructureValidator.isValidRegion('eu-west')).toBe(true);
      expect(InfrastructureValidator.isValidRegion('ap_southeast')).toBe(true);
    });

    it('should reject invalid regions', () => {
      expect(InfrastructureValidator.isValidRegion('')).toBe(false);
      expect(InfrastructureValidator.isValidRegion(null)).toBe(false);
      expect(InfrastructureValidator.isValidRegion('a')).toBe(false);
      expect(InfrastructureValidator.isValidRegion('a' + 'b'.repeat(50))).toBe(false);
    });
  });

  describe('validateInfrastructureNode', () => {
    it('should return valid result for valid node data', () => {
      const result = InfrastructureValidator.validateInfrastructureNode({
        nodeName: 'api-server-1',
        nodeType: InfrastructureType.API_SERVER,
        status: 'healthy',
        region: 'us-east-1',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid node name', () => {
      const result = InfrastructureValidator.validateInfrastructureNode({
        nodeName: '',
        nodeType: InfrastructureType.API_SERVER,
        region: 'us-east-1',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Node name'))).toBe(true);
    });

    it('should return errors for invalid node type', () => {
      const result = InfrastructureValidator.validateInfrastructureNode({
        nodeName: 'api-server-1',
        nodeType: 'invalid',
        region: 'us-east-1',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Node type'))).toBe(true);
    });

    it('should return errors for invalid region', () => {
      const result = InfrastructureValidator.validateInfrastructureNode({
        nodeName: 'api-server-1',
        nodeType: InfrastructureType.API_SERVER,
        region: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Region'))).toBe(true);
    });
  });

  describe('validateInfrastructureNodeOrThrow', () => {
    it('should not throw for valid node data', () => {
      expect(() =>
        InfrastructureValidator.validateInfrastructureNodeOrThrow({
          nodeName: 'api-server-1',
          nodeType: InfrastructureType.API_SERVER,
          region: 'us-east-1',
        })
      ).not.toThrow();
    });

    it('should throw for invalid node data', () => {
      expect(() =>
        InfrastructureValidator.validateInfrastructureNodeOrThrow({
          nodeName: '',
        })
      ).toThrow();
    });
  });
});
