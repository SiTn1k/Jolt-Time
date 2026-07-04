/**
 * BackupType
 *
 * Defines the type of backup operation.
 */

export type BackupType =
  | 'full'
  | 'incremental'
  | 'configuration'
  | 'database'
  | 'analytics'
  | 'audit';

export const BACKUP_TYPE_DISPLAY: Record<BackupType, string> = {
  full: 'Full Backup',
  incremental: 'Incremental Backup',
  configuration: 'Configuration Backup',
  database: 'Database Backup',
  analytics: 'Analytics Backup',
  audit: 'Audit Backup',
};

export const BACKUP_TYPE_DESCRIPTIONS: Record<BackupType, string> = {
  full: 'Complete backup of all systems and data',
  incremental: 'Backup of changes since last backup',
  configuration: 'Backup of system configuration',
  database: 'Backup of database data only',
  analytics: 'Backup of analytics data only',
  audit: 'Backup of audit logs only',
};

/**
 * Checks if a backup type is a data backup type.
 */
export function isDataBackupType(type: BackupType): boolean {
  return type === 'full' || type === 'incremental';
}

/**
 * Checks if a backup type is a system backup type.
 */
export function isSystemBackupType(type: BackupType): boolean {
  return type === 'configuration' || type === 'database';
}

/**
 * Checks if a backup type is a metadata backup type.
 */
export function isMetadataBackupType(type: BackupType): boolean {
  return type === 'analytics' || type === 'audit';
}

/**
 * Gets all backup types that are considered critical.
 */
export function getCriticalBackupTypes(): BackupType[] {
  return ['full', 'database', 'audit'];
}
