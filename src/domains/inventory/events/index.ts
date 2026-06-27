/**
 * Inventory Events
 *
 * Domain events for the inventory domain.
 */

export { createInventoryCreatedEvent } from './InventoryCreated.event';
export type { InventoryCreatedEvent, InventoryCreatedEventData } from './InventoryCreated.event';

export { createInventoryItemAddedEvent } from './InventoryItemAdded.event';
export type { InventoryItemAddedEvent, InventoryItemAddedEventData } from './InventoryItemAdded.event';

export { createInventoryItemUpdatedEvent } from './InventoryItemUpdated.event';
export type { InventoryItemUpdatedEvent, InventoryItemUpdatedEventData, InventoryItemUpdateType } from './InventoryItemUpdated.event';

export { createInventoryItemRemovedEvent, InventoryItemRemovalReason } from './InventoryItemRemoved.event';
export type { InventoryItemRemovedEvent, InventoryItemRemovedEventData } from './InventoryItemRemoved.event';