/**
 * Telegram Deep Link Types
 *
 * Type definitions for deep links and referral parameters.
 */

/**
 * Deep link parameter types.
 */
export interface DeepLinkParams {
  startParam?: string;
  startgroup?: boolean;
  chatType?: 'private' | 'group' | 'supergroup' | 'channel';
  authDate?: Date;
  userId?: number;
}

/**
 * Parsed deep link data.
 */
export interface ParsedDeepLink {
  raw: string;
  type: DeepLinkType;
  campaign?: CampaignParams;
  referral?: DeepLinkReferral;
  gameId?: string;
  additionalParams: Record<string, string>;
}

/**
 * Deep link types.
 */
export enum DeepLinkType {
  UNKNOWN = 'unknown',
  START = 'start',
  STARTGROUP = 'startgroup',
  GAME = 'game',
  REFERRAL = 'referral',
  CAMPAIGN = 'campaign',
}

/**
 * Referral information from deep link.
 */
export interface DeepLinkReferral {
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  startParam?: string;
}

/**
 * Campaign tracking parameters.
 */
export interface CampaignParams {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  customId?: string;
}

/**
 * Deep link builder options.
 */
export interface DeepLinkBuilderOptions {
  startParam?: string;
  startGroup?: boolean;
  gameId?: string;
  campaign?: CampaignParams;
  referralUserId?: number;
  webAppToken?: string;
}

/**
 * Deep link validation result.
 */
export interface DeepLinkValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
