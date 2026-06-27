/**
 * Inventory Item Status Type
 *
 * Defines the possible statuses for an inventory item.
 */

/**
 * Inventory item status values.
 */
export enum InventoryItemStatus {
  /** Item is in active use */
  ACTIVE = 'active',
  
  /** Item is equipped or deployed */
  EQUIPPED = 'equipped',
  
  /** Item is in a storage vault */
  VAULTED = 'vaulted',
  
  /** Item is listed on the marketplace */
  LISTED = 'listed',
  
  /** Item is being traded */
  TRADING = 'trading',
  
  /** Item is locked and cannot be used */
  LOCKED = 'locked',
  
  /** Item has expired */
  EXPIRED = 'expired',
  
  /** Item is pending confirmation */
  PENDING = 'pending',
}

/**
 * Statuses that indicate an item is available for use.
 */
export const AVAILABLE_STATUSES: readonly InventoryItemStatus[] = [
  InventoryItemStatus.ACTIVE,
  InventoryItemStatus.EQUIPPED,
] as const;

/**
 * Statuses that indicate an item is not available.
 */
export const UNAVAILABLE_STATUSES: readonly InventoryItemStatus[] = [
  InventoryItemStatus.VAULTED,
  InventoryItemStatus.LISTED,
  InventoryItemStatus.TRADING,
  InventoryItemStatus.LOCKED,
  InventoryItemStatus.EXPIRED,
  InventoryItemStatus.PENDING,
] as const;

/**
 * Checks if a status indicates the item is available.
 * @param status The status to check
 * @returns true if the item is available
 */
export function isItemAvailable(status: InventoryItemStatus): boolean {
  return AVAILABLE_STATUSES.includes(status);
}

/**
 * Checks if a status indicates the item is unavailable.
 * @param status The status to check
 * @returns true if the item is unavailable
 */
export function isItemUnavailable(status: InventoryItemStatus): boolean {
  return UNAVAILABLE_STATUSES.includes(status);
}