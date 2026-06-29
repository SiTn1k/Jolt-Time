/**
 * Admin Services
 *
 * Export all admin services.
 */

export { AdminService, type AdminServiceOptions } from './AdminService';
export { PermissionEngine, getPermissionEngine, type PermissionCheckResult, type RoleAssignmentResult, type PermissionValidationResult } from './PermissionEngine';
export { AuditService, getAuditService, type AuditLogEntry, type AuditQueryFilters, type AuditQueryResult, type AuditEntryBuilder, AuditEventType, AuditResult } from './AuditService';
export { AdminEventSubscribers, setupAdminEventSubscribers, getAdminEventSubscribers, type AdminEventSubscriberConfig } from './subscribers/AdminEventSubscribers';

// Command types
export {
  // Base interfaces
  type IAdminCommand,
  type ICommandResult,
  type ICommandValidator,
  type ICommandExecutor,
  type CommandValidationResult,
  type CommandValidationError,
  
  // Enums
  AdminTargetDomain,
  PlayerCommandType,
  EconomyCommandType,
  RewardCommandType,
  ConfigurationCommandType,
  AnnouncementCommandType,
  SystemCommandType,
  BanCommandType,
  
  // Command interfaces
  type PlayerCommand,
  type PlayerSearchCommand,
  type PlayerSearchFilters,
  type EconomyCommand,
  type GrantCurrencyCommand,
  type RevokeCurrencyCommand,
  type RewardCommand,
  type IssueRewardCommand,
  type ConfigurationCommand,
  type AnnouncementCommand,
  type AnnouncementData,
  type SystemCommand,
  type BanCommand,
  
  // Utilities
  createCommand,
  AdminCommandBuilder,
} from './commands/AdminCommands';