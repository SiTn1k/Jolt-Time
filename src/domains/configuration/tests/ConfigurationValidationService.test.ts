/**
 * Configuration Validation Service Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { ConfigurationValidationService } from '../services/ConfigurationValidationService';
import { ValidationErrorType } from '../services/ConfigurationValidationService';
import { ConfigurationEntry } from '../entities/ConfigurationEntry';
import { ConfigurationType } from '../types/ConfigurationType';

describe('ConfigurationValidationService', () => {
  let service: ConfigurationValidationService;

  const createEntry = (key: string, value: unknown, valueType: ConfigurationType = ConfigurationType.STRING): ConfigurationEntry => {
    return ConfigurationEntry.fromDatabase({
      config_id: `id-${key}`,
      key,
      value,
      value_type: valueType,
      group_id: null,
      description: '',
      version: 1,
      is_public: true,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  beforeEach(() => {
    service = new ConfigurationValidationService();
  });

  describe('validateEntry', () => {
    it('should validate a valid entry', () => {
      const entry = createEntry('valid.key', 'value');
      const result = service.validateEntry(entry);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject entry with invalid key', () => {
      const entry = createEntry('123invalid', 'value');
      const result = service.validateEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === ValidationErrorType.VALIDATION_FAILED)).toBe(true);
    });

    it('should reject entry with mismatched value type', () => {
      const entry = createEntry('valid.key', 'string_value', ConfigurationType.NUMBER);
      const result = service.validateEntry(entry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === ValidationErrorType.INVALID_VALUE)).toBe(true);
    });
  });

  describe('validateEntries', () => {
    it('should validate multiple entries', () => {
      const entries = [
        createEntry('key1', 'value1'),
        createEntry('key2', 'value2'),
      ];
      const result = service.validateEntries(entries);
      expect(result.isValid).toBe(true);
    });

    it('should detect duplicate keys', () => {
      const entries = [
        createEntry('duplicate.key', 'value1'),
        createEntry('duplicate.key', 'value2'),
      ];
      const result = service.validateEntries(entries);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.type === ValidationErrorType.DUPLICATE_KEY)).toBe(true);
    });

    it('should count valid and invalid entries', () => {
      const entries = [
        createEntry('valid1', 'value'),
        createEntry('123invalid', 'value'), // Invalid key (starts with number)
      ];
      const result = service.validateEntries(entries);
      expect(result.validCount).toBe(1);
      expect(result.invalidCount).toBe(1);
    });
  });

  describe('validateRequiredKeys', () => {
    it('should pass when all required keys exist', () => {
      const entries = [
        createEntry('required.key1', 'value'),
        createEntry('required.key2', 'value'),
      ];
      const result = service.validateRequiredKeys(entries, ['required.key1', 'required.key2']);
      expect(result.isValid).toBe(true);
    });

    it('should fail when required keys are missing', () => {
      const entries = [createEntry('existing.key', 'value')];
      const result = service.validateRequiredKeys(entries, ['required.key1', 'required.key2']);
      expect(result.isValid).toBe(false);
      expect(result.errors.filter(e => e.type === ValidationErrorType.MISSING_KEY)).toHaveLength(2);
    });
  });

  describe('validateEntryTypes', () => {
    it('should validate all entry types', () => {
      const entries = [
        createEntry('string.key', 'value', ConfigurationType.STRING),
        createEntry('number.key', 42, ConfigurationType.NUMBER),
        createEntry('boolean.key', true, ConfigurationType.BOOLEAN),
      ];
      const result = service.validateEntryTypes(entries);
      expect(result.isValid).toBe(true);
    });

    it('should detect type mismatches', () => {
      const entries = [
        createEntry('string.key', 123, ConfigurationType.STRING),
      ];
      const result = service.validateEntryTypes(entries);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe(ValidationErrorType.INVALID_TYPE);
    });
  });

  describe('checkCircularReferences', () => {
    it('should pass for entries without references', () => {
      const entries = [
        createEntry('key1', 'value1'),
        createEntry('key2', 'value2'),
      ];
      const result = service.checkCircularReferences(entries);
      expect(result.isValid).toBe(true);
    });

    it('should pass for JSON without circular refs', () => {
      const entries = [
        createEntry('key1', { nested: { value: 'test' } }, ConfigurationType.JSON),
      ];
      const result = service.checkCircularReferences(entries);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateAll', () => {
    it('should validate all configuration data', () => {
      const entries = [createEntry('valid.key', 'value')];
      const result = service.validateAll(entries, [], []);
      expect(result.isValid).toBe(true);
    });

    it('should aggregate errors from all sources', () => {
      const entries = [
        createEntry('duplicate.key', 'value1'),
        createEntry('duplicate.key', 'value2'),
      ];
      const result = service.validateAll(entries, [], []);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
