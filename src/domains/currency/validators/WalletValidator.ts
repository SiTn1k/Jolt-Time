/**
 * Wallet Validator
 *
 * Validates wallet data according to game rules.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of wallet validation.
 */
export interface WalletValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for wallet data.
 */
export class WalletValidator {
  /**
   * Validates a wallet ID format.
   * @param walletId The wallet ID to validate
   * @returns true if valid UUID
   */
  public static isValidWalletId(walletId: string | null | undefined): boolean {
    if (!walletId || walletId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(walletId);
  }

  /**
   * Validates a player profile ID format.
   * @param playerProfileId The player profile ID to validate
   * @returns true if valid UUID
   */
  public static isValidPlayerProfileId(playerProfileId: string | null | undefined): boolean {
    if (!playerProfileId || playerProfileId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(playerProfileId);
  }

  /**
   * Validates a complete wallet operation.
   * @param data The data to validate
   * @returns Validation result with all errors
   */
  public static validate(data: {
    walletId?: string;
    playerProfileId?: string;
    currencyType?: string;
    amount?: number;
  }): WalletValidationResult {
    const errors: string[] = [];

    // Validate walletId
    if (data.walletId !== undefined) {
      if (!data.walletId || data.walletId.trim().length === 0) {
        errors.push('Wallet ID is required');
      } else if (!UUID_REGEX.test(data.walletId)) {
        errors.push('Wallet ID must be a valid UUID');
      }
    }

    // Validate playerProfileId
    if (data.playerProfileId !== undefined) {
      if (!data.playerProfileId || data.playerProfileId.trim().length === 0) {
        errors.push('Player profile ID is required');
      } else if (!UUID_REGEX.test(data.playerProfileId)) {
        errors.push('Player profile ID must be a valid UUID');
      }
    }

    // Validate currencyType
    if (data.currencyType !== undefined) {
      if (!data.currencyType || data.currencyType.trim().length === 0) {
        errors.push('Currency type is required');
      }
    }

    // Validate amount
    if (data.amount !== undefined) {
      if (typeof data.amount !== 'number' || isNaN(data.amount)) {
        errors.push('Amount must be a valid number');
      } else if (!Number.isInteger(data.amount)) {
        errors.push('Amount must be an integer');
      } else if (data.amount < 0) {
        errors.push('Amount cannot be negative');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates wallet data and throws if invalid.
   * @param data The data to validate
   * @throws Error with validation details if invalid
   */
  public static validateOrThrow(data: {
    walletId?: string;
    playerProfileId?: string;
    currencyType?: string;
    amount?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Wallet validation failed: ${result.errors.join('; ')}`);
    }
  }

  /**
   * Validates that a player owns a wallet.
   * @param walletOwnerId The owner ID stored in the wallet
   * @param requesterId The ID of the player making the request
   * @returns true if the requester owns the wallet
   */
  public static validateOwnership(walletOwnerId: string | null | undefined, requesterId: string | null | undefined): boolean {
    if (!walletOwnerId || !requesterId) {
      return false;
    }
    return walletOwnerId === requesterId;
  }

  /**
   * Validates ownership and throws if invalid.
   * @param walletOwnerId The owner ID stored in the wallet
   * @param requesterId The ID of the player making the request
   * @throws Error if requester doesn't own the wallet
   */
  public static validateOwnershipOrThrow(walletOwnerId: string | null | undefined, requesterId: string | null | undefined): void {
    if (!this.validateOwnership(walletOwnerId, requesterId)) {
      throw new Error('Wallet ownership validation failed: requester does not own this wallet');
    }
  }
}
