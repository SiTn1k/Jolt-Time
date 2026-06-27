/**
 * Currency Domain Dependency Injection Registration
 *
 * Registers all currency domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseCurrencyRepository } from './repositories/SupabaseCurrencyRepository';
import { SupabaseCurrencyTransactionRepository } from './repositories/SupabaseCurrencyTransactionRepository';
import { CurrencyMapper } from './mappers/CurrencyMapper';
import { CurrencyAmountValidator, CurrencyTypeValidator, WalletValidator } from './validators';
import { CurrencyService } from '../../services/CurrencyService';

/**
 * Currency Domain DI configuration keys.
 */
export const CURRENCY_TOKENS = {
  CURRENCY_REPOSITORY: Symbol.for('SupabaseCurrencyRepository'),
  CURRENCY_TRANSACTION_REPOSITORY: Symbol.for('SupabaseCurrencyTransactionRepository'),
  CURRENCY_MAPPER: Symbol.for('CurrencyMapper'),
  CURRENCY_AMOUNT_VALIDATOR: Symbol.for('CurrencyAmountValidator'),
  CURRENCY_TYPE_VALIDATOR: Symbol.for('CurrencyTypeValidator'),
  WALLET_VALIDATOR: Symbol.for('WalletValidator'),
  CURRENCY_SERVICE: Symbol.for('CurrencyService'),
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
  container.register(SupabaseCurrencyTransactionRepository, { lifetime: Lifetime.Singleton });

  // Service (Singleton - depends on repositories)
  container.register(CurrencyService, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for currency domain.
 * Creates and configures all currency domain components.
 */
export function setupCurrencyDomain(): {
  currencyRepository: SupabaseCurrencyRepository;
  currencyTransactionRepository: SupabaseCurrencyTransactionRepository;
  currencyMapper: CurrencyMapper;
  currencyAmountValidator: CurrencyAmountValidator;
  currencyTypeValidator: CurrencyTypeValidator;
  walletValidator: WalletValidator;
  currencyService: CurrencyService;
} {
  const currencyAmountValidator = new CurrencyAmountValidator();
  const currencyTypeValidator = new CurrencyTypeValidator();
  const walletValidator = new WalletValidator();
  const currencyMapper = new CurrencyMapper();
  const currencyRepository = new SupabaseCurrencyRepository();
  const currencyTransactionRepository = new SupabaseCurrencyTransactionRepository();
  const currencyService = new CurrencyService(currencyRepository, currencyTransactionRepository);

  return {
    currencyRepository,
    currencyTransactionRepository,
    currencyMapper,
    currencyAmountValidator,
    currencyTypeValidator,
    walletValidator,
    currencyService,
  };
}
