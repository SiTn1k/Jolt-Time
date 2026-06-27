/**
 * Inventory Domain Dependency Injection Registration
 *
 * Registers all inventory domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseInventoryRepository, SupabaseInventoryItemRepository } from './repositories/SupabaseInventoryRepository';
import { InventoryMapper } from './mappers/InventoryMapper';
import { InventoryItemMapper } from './mappers/InventoryItemMapper';
import { InventoryCapacityValidator, InventoryQuantityValidator, InventoryItemValidator } from './validators';

/**
 * Inventory Domain DI configuration keys.
 */
export const INVENTORY_TOKENS = {
  INVENTORY_REPOSITORY: Symbol.for('SupabaseInventoryRepository'),
  INVENTORY_ITEM_REPOSITORY: Symbol.for('SupabaseInventoryItemRepository'),
  INVENTORY_MAPPER: Symbol.for('InventoryMapper'),
  INVENTORY_ITEM_MAPPER: Symbol.for('InventoryItemMapper'),
  INVENTORY_CAPACITY_VALIDATOR: Symbol.for('InventoryCapacityValidator'),
  INVENTORY_QUANTITY_VALIDATOR: Symbol.for('InventoryQuantityValidator'),
  INVENTORY_ITEM_VALIDATOR: Symbol.for('InventoryItemValidator'),
} as const;

/**
 * Register all inventory domain dependencies with the container.
 */
export function registerInventoryDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(InventoryCapacityValidator, new InventoryCapacityValidator());
  container.registerInstance(InventoryQuantityValidator, new InventoryQuantityValidator());
  container.registerInstance(InventoryItemValidator, new InventoryItemValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(InventoryMapper, new InventoryMapper());
  container.registerInstance(InventoryItemMapper, new InventoryItemMapper());

  // Repositories (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseInventoryRepository, { lifetime: Lifetime.Singleton });
  container.register(SupabaseInventoryItemRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for inventory domain.
 * Creates and configures all inventory domain components.
 */
export function setupInventoryDomain(): {
  inventoryRepository: SupabaseInventoryRepository;
  inventoryItemRepository: SupabaseInventoryItemRepository;
  inventoryMapper: InventoryMapper;
  inventoryItemMapper: InventoryItemMapper;
  inventoryCapacityValidator: InventoryCapacityValidator;
  inventoryQuantityValidator: InventoryQuantityValidator;
  inventoryItemValidator: InventoryItemValidator;
} {
  const inventoryCapacityValidator = new InventoryCapacityValidator();
  const inventoryQuantityValidator = new InventoryQuantityValidator();
  const inventoryItemValidator = new InventoryItemValidator();
  const inventoryMapper = new InventoryMapper();
  const inventoryItemMapper = new InventoryItemMapper();
  const inventoryRepository = new SupabaseInventoryRepository();
  const inventoryItemRepository = new SupabaseInventoryItemRepository();

  return {
    inventoryRepository,
    inventoryItemRepository,
    inventoryMapper,
    inventoryItemMapper,
    inventoryCapacityValidator,
    inventoryQuantityValidator,
    inventoryItemValidator,
  };
}