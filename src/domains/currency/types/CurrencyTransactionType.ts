/**
 * Currency Transaction Type
 *
 * Defines all types of currency transactions in the system.
 */

/**
 * Transaction types for currency movements.
 */
export enum CurrencyTransactionType {
  /** Currency earned through gameplay */
  EARNED = 'earned',
  /** Currency spent on purchases */
  SPENT = 'spent',
  /** Currency awarded as reward */
  REWARD = 'reward',
  /** Currency from purchase (premium) */
  PURCHASE = 'purchase',
  /** Currency refunded */
  REFUND = 'refund',
  /** Currency expired (e.g., event tokens) */
  EXPIRED = 'expired',
  /** Currency converted from another type */
  CONVERTED = 'converted',
  /** Currency transferred between players */
  TRANSFER_IN = 'transfer_in',
  /** Currency transferred to another player */
  TRANSFER_OUT = 'transfer_out',
  /** Currency gifted to another player */
  GIFT_SENT = 'gift_sent',
  /** Currency received as gift */
  GIFT_RECEIVED = 'gift_received',
  /** Initial currency grant (new player) */
  INITIAL_GRANT = 'initial_grant',
  /** Daily reward */
  DAILY_REWARD = 'daily_reward',
  /** Quest completion reward */
  QUEST_REWARD = 'quest_reward',
  /** Battle pass reward */
  BATTLE_PASS_REWARD = 'battle_pass_reward',
  /** Expedition completion reward */
  EXPEDITION_REWARD = 'expedition_reward',
  /** Achievement reward */
  ACHIEVEMENT_REWARD = 'achievement_reward',
  /** Ad watching reward */
  AD_REWARD = 'ad_reward',
  /** Energy purchase */
  ENERGY_PURCHASE = 'energy_purchase',
  /** Item purchase */
  ITEM_PURCHASE = 'item_purchase',
  /** Upgrade purchase */
  UPGRADE_PURCHASE = 'upgrade_purchase',
  /** Museum action */
  MUSEUM_ACTION = 'museum_action',
  /** Academy operation */
  ACADEMY_OPERATION = 'academy_operation',
  /** Guild donation */
  GUILD_DONATION = 'guild_donation',
  /** Guild reward */
  GUILD_REWARD = 'guild_reward',
  /** Tournament entry fee */
  TOURNAMENT_ENTRY = 'tournament_entry',
  /** Tournament prize */
  TOURNAMENT_PRIZE = 'tournament_prize',
  /** Boss battle entry */
  BOSS_BATTLE_ENTRY = 'boss_battle_entry',
  /** Boss battle reward */
  BOSS_BATTLE_REWARD = 'boss_battle_reward',
  /** Admin adjustment (manual) */
  ADMIN_ADJUSTMENT = 'admin_adjustment',
  /** Correction/rollback */
  CORRECTION = 'correction',
}

/**
 * Categories of transaction types.
 */
export enum TransactionCategory {
  /** Income transactions */
  INCOME = 'income',
  /** Expense transactions */
  EXPENSE = 'expense',
  /** Transfer transactions */
  TRANSFER = 'transfer',
  /** Adjustment transactions */
  ADJUSTMENT = 'adjustment',
}

/**
 * Gets the category for a transaction type.
 * @param type The transaction type
 * @returns The transaction category
 */
export function getTransactionCategory(type: CurrencyTransactionType): TransactionCategory {
  const incomeTypes = [
    CurrencyTransactionType.EARNED,
    CurrencyTransactionType.REWARD,
    CurrencyTransactionType.PURCHASE,
    CurrencyTransactionType.REFUND,
    CurrencyTransactionType.CONVERTED,
    CurrencyTransactionType.TRANSFER_IN,
    CurrencyTransactionType.GIFT_RECEIVED,
    CurrencyTransactionType.INITIAL_GRANT,
    CurrencyTransactionType.DAILY_REWARD,
    CurrencyTransactionType.QUEST_REWARD,
    CurrencyTransactionType.BATTLE_PASS_REWARD,
    CurrencyTransactionType.EXPEDITION_REWARD,
    CurrencyTransactionType.ACHIEVEMENT_REWARD,
    CurrencyTransactionType.AD_REWARD,
    CurrencyTransactionType.GUILD_REWARD,
    CurrencyTransactionType.TOURNAMENT_PRIZE,
    CurrencyTransactionType.BOSS_BATTLE_REWARD,
  ];

  const expenseTypes = [
    CurrencyTransactionType.SPENT,
    CurrencyTransactionType.CONVERTED,
    CurrencyTransactionType.TRANSFER_OUT,
    CurrencyTransactionType.GIFT_SENT,
    CurrencyTransactionType.ENERGY_PURCHASE,
    CurrencyTransactionType.ITEM_PURCHASE,
    CurrencyTransactionType.UPGRADE_PURCHASE,
    CurrencyTransactionType.MUSEUM_ACTION,
    CurrencyTransactionType.ACADEMY_OPERATION,
    CurrencyTransactionType.GUILD_DONATION,
    CurrencyTransactionType.TOURNAMENT_ENTRY,
    CurrencyTransactionType.BOSS_BATTLE_ENTRY,
  ];

  if (incomeTypes.includes(type)) return TransactionCategory.INCOME;
  if (expenseTypes.includes(type)) return TransactionCategory.EXPENSE;
  return TransactionCategory.ADJUSTMENT;
}

/**
 * Checks if a transaction type represents an income.
 * @param type The transaction type
 * @returns true if income
 */
export function isIncomeTransaction(type: CurrencyTransactionType): boolean {
  return getTransactionCategory(type) === TransactionCategory.INCOME;
}

/**
 * Checks if a transaction type represents an expense.
 * @param type The transaction type
 * @returns true if expense
 */
export function isExpenseTransaction(type: CurrencyTransactionType): boolean {
  return getTransactionCategory(type) === TransactionCategory.EXPENSE;
}
