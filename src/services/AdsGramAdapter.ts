/**
 * AdsGramAdapter
 * 
 * Adapter interface and mock implementation for the AdsGram SDK.
 * 
 * This file provides:
 * 1. IAdsGramAdapter interface - defines the contract for SDK adapters
 * 2. MockAdsGramAdapter - mock implementation for development/testing
 * 3. Placeholder for real AdsGram SDK integration
 * 
 * TO INTEGRATE REAL ADSGRAM SDK:
 * 1. Install the AdsGram SDK package
 * 2. Create a new adapter class that implements IAdsGramAdapter
 * 3. Pass it to AdsGramService via setAdapter()
 * 4. No other code changes needed!
 * 
 * Example:
 * ```typescript
 * import { RealAdsGramAdapter } from './adapters/RealAdsGramAdapter';
 * 
 * const adsGramService = getAdsGramService(config);
 * adsGramService.setAdapter(new RealAdsGramAdapter());
 * ```
 */

import { AdCategory, AdReward, RewardType, IAdsGramAdapter } from '../types/ads';

/**
 * Mock AdsGram Adapter for development and testing.
 * 
 * This adapter simulates the AdsGram SDK behavior without
 * actually showing ads. Useful for:
 * - Development without AdsGram account
 * - Testing reward logic
 * - UI development
 */
export class MockAdsGramAdapter implements IAdsGramAdapter {
  private initialized = false;
  private mockDelay = 1000; // Simulated ad loading delay

  /**
   * Initialize the mock adapter.
   */
  async initialize(): Promise<void> {
    // Simulate initialization
    await this.delay(100);
    this.initialized = true;
    console.log('[MockAdsGram] Initialized');
  }

  /**
   * Show a mock ad.
   * Always returns true after a simulated delay.
   */
  async showAd(category: AdCategory): Promise<boolean> {
    if (!this.initialized) {
      throw new Error('Adapter not initialized');
    }

    // Simulate ad loading
    await this.delay(this.mockDelay);
    
    console.log(`[MockAdsGram] Ad shown for category: ${category}`);
    return true;
  }

  /**
   * Get mock reward for the last ad.
   */
  getReward(): AdReward {
    return {
      type: RewardType.COINS,
      amount: 100,
      description: 'Mock reward - 100 coins'
    };
  }

  /**
   * Mock always has ads available.
   */
  async isAdAvailable(category: AdCategory): Promise<boolean> {
    return true;
  }

  /**
   * Helper to simulate async delay.
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Real AdsGram Adapter Placeholder.
 * 
 * This class shows where the real AdsGram SDK would be integrated.
 * To implement:
 * 
 * 1. Install AdsGram SDK:
 *    npm install @adsgram/sdk
 * 
 * 2. Replace this class with actual implementation:
 * 
 * ```typescript
 * import AdsGram from '@adsgram/sdk';
 * 
 * export class RealAdsGramAdapter implements IAdsGramAdapter {
 *   private adsGram: typeof AdsGram;
 * 
 *   async initialize(): Promise<void> {
 *     this.adsGram = await AdsGram.init({
 *       token: process.env.ADSGRAM_TOKEN,
 *       debug: true
 *     });
 *   }
 * 
 *   async showAd(category: AdCategory): Promise<boolean> {
 *     // Map our categories to AdsGram ad types
 *     const adType = this.mapCategoryToAdType(category);
 *     
 *     const result = await this.adsGram.showAd({ type: adType });
 *     return result.success;
 *   }
 * 
 *   getReward(): AdReward {
 *     // Get reward from AdsGram SDK
 *     const reward = this.adsGram.getReward();
 *     return {
 *       type: this.mapAdsGramRewardToOurType(reward.type),
 *       amount: reward.amount,
 *       description: reward.description
 *     };
 *   }
 * 
 *   async isAdAvailable(category: AdCategory): Promise<boolean> {
 *     return this.adsGram.isAdAvailable(this.mapCategoryToAdType(category));
 *   }
 * }
 * ```
 */
export class RealAdsGramAdapterPlaceholder implements IAdsGramAdapter {
  /**
   * NOT YET IMPLEMENTED - Placeholder for real AdsGram SDK.
   */
  async initialize(): Promise<void> {
    // TODO: Initialize real AdsGram SDK
    console.log('[AdsGram] Placeholder - Real SDK not yet integrated');
    console.log('[AdsGram] To integrate: npm install @adsgram/sdk and implement RealAdsGramAdapter');
  }

  /**
   * NOT YET IMPLEMENTED
   */
  async showAd(category: AdCategory): Promise<boolean> {
    // TODO: Call real AdsGram SDK
    throw new Error('Real AdsGram SDK not yet integrated');
  }

  /**
   * NOT YET IMPLEMENTED
   */
  getReward(): AdReward {
    // TODO: Return real reward from SDK
    throw new Error('Real AdsGram SDK not yet integrated');
  }

  /**
   * NOT YET IMPLEMENTED
   */
  async isAdAvailable(category: AdCategory): Promise<boolean> {
    // TODO: Check with real SDK
    throw new Error('Real AdsGram SDK not yet integrated');
  }
}

/**
 * Factory function to create the appropriate adapter.
 * 
 * @param isProduction - If true, use real adapter (when available)
 */
export function createAdsGramAdapter(isProduction: boolean = false): IAdsGramAdapter {
  if (isProduction) {
    // When real SDK is available:
    // return new RealAdsGramAdapter();
    return new RealAdsGramAdapterPlaceholder();
  }
  
  // Use mock for development
  return new MockAdsGramAdapter();
}

/**
 * Adapter factory for different environments.
 */
export const Adapters = {
  /**
   * Create mock adapter for development.
   */
  mock(): IAdsGramAdapter {
    return new MockAdsGramAdapter();
  },

  /**
   * Create placeholder adapter for production (when real SDK unavailable).
   */
  placeholder(): IAdsGramAdapter {
    return new RealAdsGramAdapterPlaceholder();
  },

  /**
   * Create real adapter (when SDK is integrated).
   */
  real(): IAdsGramAdapter {
    // TODO: Replace with RealAdsGramAdapter when SDK is installed
    return new RealAdsGramAdapterPlaceholder();
  }
};
