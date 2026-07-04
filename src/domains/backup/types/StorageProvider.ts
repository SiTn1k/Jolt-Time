/**
 * StorageProvider
 *
 * Defines the storage provider for backup data.
 */

export type StorageProvider =
  | 'local'
  | 'supabase'
  | 's3'
  | 'gcs'
  | 'azure'
  | 'custom';

export const STORAGE_PROVIDER_DISPLAY: Record<StorageProvider, string> = {
  local: 'Local Storage',
  supabase: 'Supabase Storage',
  s3: 'Amazon S3',
  gcs: 'Google Cloud Storage',
  azure: 'Azure Blob Storage',
  custom: 'Custom Provider',
};

export const STORAGE_PROVIDER_DESCRIPTIONS: Record<StorageProvider, string> = {
  local: 'Local filesystem storage',
  supabase: 'Supabase storage bucket',
  s3: 'Amazon Web Services S3',
  gcs: 'Google Cloud Platform Storage',
  azure: 'Microsoft Azure Blob Storage',
  custom: 'Custom storage implementation',
};

/**
 * Checks if a storage provider is a cloud provider.
 */
export function isCloudStorageProvider(provider: StorageProvider): boolean {
  return provider === 's3' || provider === 'gcs' || provider === 'azure';
}

/**
 * Checks if a storage provider is managed by Supabase.
 */
export function isSupabaseStorageProvider(provider: StorageProvider): boolean {
  return provider === 'supabase';
}

/**
 * Checks if a storage provider requires credentials.
 */
export function requiresCredentials(provider: StorageProvider): boolean {
  return provider !== 'local' && provider !== 'supabase';
}
