/**
 * Guild Status Type
 *
 * Defines the status of a guild.
 */

/**
 * Guild status.
 */
export type GuildStatus = 'active' | 'inactive' | 'deleted';

/**
 * Guild privacy type.
 */
export type GuildPrivacy = 'public' | 'private';

/**
 * Application status for guild applications.
 */
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

/**
 * Invitation status for guild invitations.
 */
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

/**
 * Default privacy setting for new guilds.
 */
export const DEFAULT_GUILD_PRIVACY: GuildPrivacy = 'public';

/**
 * Default status for new guilds.
 */
export const DEFAULT_GUILD_STATUS: GuildStatus = 'active';
