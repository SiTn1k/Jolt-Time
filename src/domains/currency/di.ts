/**
 * Currency Domain Dependency Injection Registration
 *
 * Registers all currency domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseCurrencyRepository } from './repositories/SupabaseCurrencyRepository';
import { CurrencyMapper } from './mappers/CurrencyMapper';
import { CurrencyAmountValidator, CurrencyTypeValidator, WalletValidator } from './validators';

/**
 * Currency Domain DI configuration keys.
 */
export const CURRENCY_TOKENS = {
  CURRENCY_REPOSITORY: Symbol.for('SupabaseCurrencyRepository'),
  CURRENCY_MAPPER: Symbol.for('CurrencyMapper'),
  CURRENCY_AMOUNT_VALIDATOR: Symbol.for('CurrencyAmountValidator'),
  CURRENCY_TYPE_VALIDATOR: Symbol.for('CurrencyTypeValidator'),
  WALLET_VALIDATOR: Symbol.for('WalletValidator'),
} as const;

/**
 * Register all currency domain dependencies with the container.
 */
export function registerCurrencyDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(CurrencyAmountValidator, new CurrencyAmountValidator());
  container.registerInstance(CurrencyTypeValidator, new CurrencyTypeValidator());
  container.registerInstance(WalletValidator, new WalletValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(CurrencyMapper, new CurrencyMapper());

  // Repositories (Singleton for simplicity - can be changed to Scoped if needed)
  container.register(SupabaseCurrencyRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for currency domain.
 * Creates and configures all currency domain components.
 */
export function setupCurrencyDomain(): {
  currencyRepository: SupabaseCurrencyRepository;
  currencyMapper: CurrencyMapper;
  currencyAmountValidator: CurrencyAmountValidator;
  currencyTypeValidator: CurrencyTypeValidator;
  walletValidator: WalletValidator;
} {
  const currencyAmountValidator = new CurrencyAmountValidator();
  const currencyTypeValidator = new CurrencyTypeValidator();
  const walletValidator = new WalletValidator();
  const currencyMapper = new CurrencyMapper();
  const currencyRepository = new SupabaseCurrencyRepository();

  return {
    currencyRepository,
    currencyMapper,
    currencyAmountValidator,
    currencyTypeValidator,
    walletValidator,
  };
}
