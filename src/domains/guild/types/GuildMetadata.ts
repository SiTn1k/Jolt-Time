/**
 * Guild Metadata Type
 *
 * Additional metadata for guilds.
 */

/**
 * Guild icon preset options.
 */
export type GuildIconPreset =
  | 'shield'
  | 'sword'
  | 'crown'
  | 'star'
  | 'moon'
  | 'sun'
  | 'gem'
  | 'flame';

/**
 * Guild metadata.
 */
export interface GuildMetadata {
  /** Guild icon preset */
  iconPreset?: GuildIconPreset;
  /** Custom icon URL (if allowed in future) */
  customIconUrl?: string;
  /** Guild banner color (hex) */
  bannerColor?: string;
  /** Guild tag/motto */
  tag?: string;
  /** Guild rules text */
  rules?: string;
  /** Welcome message for new members */
  welcomeMessage?: string;
  /** Guild website or social link */
  websiteUrl?: string;
  /** Discord server link */
  discordUrl?: string;
}

/**
 * Creates default guild metadata.
 */
export function createDefaultGuildMetadata(): GuildMetadata {
  return {};
}
