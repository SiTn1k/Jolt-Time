/**
 * Guild Domain Dependency Injection Registration
 *
 * Registers all guild domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseGuildRepository } from './repositories/SupabaseGuildRepository';
import { GuildService, createGuildService } from './services/GuildService';
import { GuildMapper } from './mappers/GuildMapper';
import { MemberMapper } from './mappers/MemberMapper';
import { RoleMapper } from './mappers/RoleMapper';
import { GuildValidator, GuildMemberValidator, GuildRoleValidator } from './validators';

/**
 * Guild Domain DI configuration keys.
 */
export const GUILD_TOKENS = {
  GUILD_REPOSITORY: Symbol.for('SupabaseGuildRepository'),
  GUILD_SERVICE: Symbol.for('GuildService'),
  GUILD_MAPPER: Symbol.for('GuildMapper'),
  MEMBER_MAPPER: Symbol.for('MemberMapper'),
  ROLE_MAPPER: Symbol.for('RoleMapper'),
  GUILD_VALIDATOR: Symbol.for('GuildValidator'),
  GUILD_MEMBER_VALIDATOR: Symbol.for('GuildMemberValidator'),
  GUILD_ROLE_VALIDATOR: Symbol.for('GuildRoleValidator'),
} as const;

/**
 * Register all guild domain dependencies with the container.
 */
export function registerGuildDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(GuildValidator, new GuildValidator());
  container.registerInstance(GuildMemberValidator, new GuildMemberValidator());
  container.registerInstance(GuildRoleValidator, new GuildRoleValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(GuildMapper, new GuildMapper());
  container.registerInstance(MemberMapper, new MemberMapper());
  container.registerInstance(RoleMapper, new RoleMapper());

  // Repository (Singleton)
  container.register(SupabaseGuildRepository, { lifetime: Lifetime.Singleton });

  // Service (Singleton - depends on repository)
  container.registerFactory(
    GuildService,
    () => createGuildService(new SupabaseGuildRepository()),
    { lifetime: Lifetime.Singleton }
  );
}

/**
 * Quick setup function for guild domain.
 * Creates and configures all guild domain components.
 */
export function setupGuildDomain(): {
  guildRepository: SupabaseGuildRepository;
  guildService: GuildService;
  guildMapper: GuildMapper;
  memberMapper: MemberMapper;
  roleMapper: RoleMapper;
  guildValidator: GuildValidator;
  guildMemberValidator: GuildMemberValidator;
  guildRoleValidator: GuildRoleValidator;
} {
  const guildValidator = new GuildValidator();
  const guildMemberValidator = new GuildMemberValidator();
  const guildRoleValidator = new GuildRoleValidator();
  const guildMapper = new GuildMapper();
  const memberMapper = new MemberMapper();
  const roleMapper = new RoleMapper();
  const guildRepository = new SupabaseGuildRepository();
  const guildService = createGuildService(guildRepository);

  return {
    guildRepository,
    guildService,
    guildMapper,
    memberMapper,
    roleMapper,
    guildValidator,
    guildMemberValidator,
    guildRoleValidator,
  };
}
