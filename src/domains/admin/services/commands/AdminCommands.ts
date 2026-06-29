/**
 * Administrative Commands
 *
 * Command interfaces for admin operations on game domains.
 * Admin NEVER modifies gameplay directly - it only issues validated commands.
 * Target domains execute their own logic.
 */

/**
 * Base command interface.
 */
export interface IAdminCommand {
  /** Unique command ID */
  readonly commandId: string;

  /** Admin who issued the command */
  readonly issuedBy: string;

  /** Timestamp when command was issued */
  readonly issuedAt: Date;

  /** Target domain */
  readonly targetDomain: AdminTargetDomain;

  /** Command type */
  readonly commandType: string;
}

/**
 * Admin target domains.
 */
export enum AdminTargetDomain {
  PLAYER = 'player',
  ECONOMY = 'economy',
  REWARD = 'reward',
  CONFIGURATION = 'configuration',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system',
  BAN = 'ban',
}

/**
 * Player management command types.
 */
export enum PlayerCommandType {
  VIEW_PROFILE = 'view_profile',
  SEARCH = 'search',
  VIEW_INVENTORY = 'view_inventory',
  VIEW_CURRENCY = 'view_currency',
  VIEW_ACHIEVEMENTS = 'view_achievements',
  VIEW_QUESTS = 'view_quests',
  VIEW_MUSEUM = 'view_museum',
}

/**
 * Player management command.
 */
export interface PlayerCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.PLAYER;
  readonly commandType: PlayerCommandType;
  readonly playerId: string;
  readonly parameters?: Record<string, unknown>;
}

/**
 * Player search command.
 */
export interface PlayerSearchCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.PLAYER;
  readonly commandType: PlayerCommandType.SEARCH;
  readonly searchQuery: string;
  readonly searchFilters?: PlayerSearchFilters;
}

export interface PlayerSearchFilters {
  telegramId?: number;
  username?: string;
  minLevel?: number;
  maxLevel?: number;
  status?: 'active' | 'inactive' | 'banned';
}

/**
 * Economy management command types.
 */
export enum EconomyCommandType {
  VIEW_BALANCE = 'view_balance',
  VIEW_TRANSACTION_HISTORY = 'view_transaction_history',
  GRANT_CURRENCY = 'grant_currency',
  REVOKE_CURRENCY = 'revoke_currency',
  ADJUST_BALANCE = 'adjust_balance',
  VIEW_ECONOMY_STATS = 'view_economy_stats',
}

/**
 * Economy management command.
 */
export interface EconomyCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.ECONOMY;
  readonly commandType: EconomyCommandType;
  readonly playerId?: string;
  readonly parameters?: Record<string, unknown>;
}

/**
 * Currency grant command.
 */
export interface GrantCurrencyCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.ECONOMY;
  readonly commandType: EconomyCommandType.GRANT_CURRENCY;
  readonly playerId: string;
  readonly currencyType: string;
  readonly amount: number;
  readonly reason: string;
}

/**
 * Currency revoke command.
 */
export interface RevokeCurrencyCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.ECONOMY;
  readonly commandType: EconomyCommandType.REVOKE_CURRENCY;
  readonly playerId: string;
  readonly currencyType: string;
  readonly amount: number;
  readonly reason: string;
}

/**
 * Reward management command types.
 */
export enum RewardCommandType {
  VIEW_PENDING_REWARDS = 'view_pending_rewards',
  APPROVE_REWARD = 'approve_reward',
  REJECT_REWARD = 'reject_reward',
  ISSUE_MANUAL_REWARD = 'issue_manual_reward',
  REVOKE_REWARD = 'revoke_reward',
  VIEW_REWARD_HISTORY = 'view_reward_history',
}

/**
 * Reward management command.
 */
export interface RewardCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.REWARD;
  readonly commandType: RewardCommandType;
  readonly rewardId?: string;
  readonly playerId?: string;
  readonly parameters?: Record<string, unknown>;
}

/**
 * Manual reward issuance command.
 */
export interface IssueRewardCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.REWARD;
  readonly commandType: RewardCommandType.ISSUE_MANUAL_REWARD;
  readonly playerId: string;
  readonly rewardType: string;
  readonly rewardConfig: Record<string, unknown>;
  readonly reason: string;
}

/**
 * Configuration management command types.
 */
export enum ConfigurationCommandType {
  VIEW_CONFIG = 'view_config',
  UPDATE_CONFIG = 'update_config',
  RESET_CONFIG = 'reset_config',
  LIST_CONFIGS = 'list_configs',
}

/**
 * Configuration management command.
 */
export interface ConfigurationCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.CONFIGURATION;
  readonly commandType: ConfigurationCommandType;
  readonly configKey?: string;
  readonly configValue?: unknown;
  readonly reason?: string;
}

/**
 * Announcement command types.
 */
export enum AnnouncementCommandType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  SCHEDULE = 'schedule',
  CANCEL = 'cancel',
}

/**
 * Announcement command.
 */
export interface AnnouncementCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.ANNOUNCEMENT;
  readonly commandType: AnnouncementCommandType;
  readonly announcementId?: string;
  readonly announcementData?: AnnouncementData;
}

export interface AnnouncementData {
  readonly title: string;
  readonly message: string;
  readonly type: 'info' | 'warning' | 'urgent' | 'event';
  readonly targetAudience?: 'all' | 'specific' | 'admins';
  readonly targetPlayerIds?: string[];
  readonly scheduledAt?: Date;
  readonly expiresAt?: Date;
  readonly metadata?: Record<string, unknown>;
}

/**
 * System maintenance command types.
 */
export enum SystemCommandType {
  START_MAINTENANCE = 'start_maintenance',
  END_MAINTENANCE = 'end_maintenance',
  VIEW_STATUS = 'view_status',
  CLEAR_CACHE = 'clear_cache',
  RESTART_SERVICE = 'restart_service',
}

/**
 * System maintenance command.
 */
export interface SystemCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.SYSTEM;
  readonly commandType: SystemCommandType;
  readonly reason?: string;
  readonly parameters?: Record<string, unknown>;
}

/**
 * Ban management command types.
 */
export enum BanCommandType {
  VIEW_BAN_STATUS = 'view_ban_status',
  BAN_PLAYER = 'ban_player',
  UNBAN_PLAYER = 'unban_player',
  UPDATE_BAN = 'update_ban',
}

/**
 * Ban management command.
 */
export interface BanCommand extends IAdminCommand {
  readonly targetDomain: AdminTargetDomain.BAN;
  readonly commandType: BanCommandType;
  readonly playerId: string;
  readonly banReason?: string;
  readonly banDuration?: number; // in days
  readonly parameters?: Record<string, unknown>;
}

/**
 * Command result interface.
 */
export interface ICommandResult {
  /** Command ID */
  readonly commandId: string;

  /** Whether the command was successful */
  readonly success: boolean;

  /** Result message */
  readonly message: string;

  /** Result data */
  readonly data?: unknown;

  /** Error details if failed */
  readonly error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };

  /** Execution timestamp */
  readonly executedAt: Date;
}

/**
 * Command validator interface.
 */
export interface ICommandValidator {
  /**
   * Validates a command before execution.
   * @param command The command to validate
   * @returns Validation result
   */
  validate(command: IAdminCommand): CommandValidationResult;
}

/**
 * Command validation result.
 */
export interface CommandValidationResult {
  /** Whether the command is valid */
  readonly valid: boolean;

  /** Validation errors */
  readonly errors: CommandValidationError[];
}

export interface CommandValidationError {
  readonly field: string;
  readonly message: string;
}

/**
 * Command executor interface.
 */
export interface ICommandExecutor {
  /**
   * Executes a command.
   * @param command The command to execute
   * @returns Command result
   */
  execute(command: IAdminCommand): Promise<ICommandResult>;
}

/**
 * Creates a new command with common fields.
 */
export function createCommand(
  targetDomain: AdminTargetDomain,
  commandType: string,
  issuedBy: string,
  additionalFields?: Partial<IAdminCommand>
): IAdminCommand {
  return {
    commandId: `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    issuedBy,
    issuedAt: new Date(),
    targetDomain,
    commandType,
    ...additionalFields,
  };
}

/**
 * Command builder for fluent API.
 */
export class AdminCommandBuilder {
  private command: Partial<IAdminCommand> = {};

  /**
   * Sets the target domain and command type.
   */
  target(targetDomain: AdminTargetDomain, commandType: string): this {
    this.command.targetDomain = targetDomain;
    this.command.commandType = commandType;
    return this;
  }

  /**
   * Sets the issuer.
   */
  issuedBy(adminId: string): this {
    this.command.issuedBy = adminId;
    return this;
  }

  /**
   * Adds parameters.
   */
  withParameters(params: Record<string, unknown>): this {
    this.command = { ...this.command, ...params };
    return this;
  }

  /**
   * Builds the command.
   */
  build(): IAdminCommand {
    if (!this.command.targetDomain || !this.command.commandType || !this.command.issuedBy) {
      throw new Error('Command must have targetDomain, commandType, and issuedBy');
    }

    return {
      commandId: `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      issuedBy: this.command.issuedBy,
      issuedAt: new Date(),
      targetDomain: this.command.targetDomain,
      commandType: this.command.commandType,
    };
  }
}