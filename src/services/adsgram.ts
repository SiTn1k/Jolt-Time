/**
 * AdsGram SDK Service for Virtual Museum Tapper Game
 *
 * Provides integration with AdsGram Reward Video Ads.
 * 
 * TUNED FOR TELEGRAM APPROVAL:
 * - Exclusive rewards not found elsewhere (x3 XP boost, rare artifacts)
 * - Clear value proposition for watching ads
 * - Anti-abuse: server-side validation, daily limits
 * - 30-second non-skippable chest ads every 10 chests
 * 
 * Block ID: 35644
 * Token: e73dc047768d42dba4d64432274c05c1
 */

// AdsGram Block ID for reward ads (Telegram-approved exclusive block)
export const ADSGRAM_BLOCK_ID = '35644';
// AdsGram Token
export const ADSGRAM_TOKEN = 'e73dc047768d42dba4d64432274c05c1';

// XP Boost configuration - EXCLUSIVE reward (cannot be bought)
export const XP_BOOST_MULTIPLIER = 3;
export const XP_BOOST_DURATION_MS = 30 * 60 * 1000; // 30 minutes (fixed, not extendable)

// Supabase Edge Function URL for granting rewards (server-side validation)
const getEdgeFunctionUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/adsgram-reward`;
};

/**
 * Result of ad show attempt
 */
export interface AdShowResult {
  success: boolean;
  error?: string;
  boostActivated?: boolean;
  alreadyActive?: boolean;
  userId?: string;
}

/**
 * AdsGram SDK types (Sad API)
 */
interface SadConfig {
  blockId: string;
  token: string;
  onReward?: () => void;
  onError?: (error: { message: string }) => void;
  onClose?: () => void;
}

interface Sad {
  showRewardedAd: (config: SadConfig) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    SAD?: Sad;
  }
}

// Store SDK instance
let sdkInstance: Sad | null = null;

/**
 * Check if AdsGram SDK is loaded
 */
export function isAdsgramLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.SAD;
}

/**
 * Wait for AdsGram SDK to load (polling with timeout)
 * Solves the race condition between defer script loading and React init
 */
export async function waitForAdsgramSDK(timeoutMs: number = 10000): Promise<Sad | null> {
  console.log('[adsgram] Waiting for SDK to load...');
  const startTime = Date.now();

  // First check if already loaded
  if (window.SAD) {
    console.log('[adsgram] SDK already loaded (SAD)');
    sdkInstance = window.SAD;
    return window.SAD;
  }

  // Wait for SDK
  while (Date.now() - startTime < timeoutMs) {
    if (window.SAD) {
      console.log('[adsgram] SDK loaded after', Date.now() - startTime, 'ms');
      sdkInstance = window.SAD;
      return window.SAD;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.error('[adsgram] SDK timeout after', timeoutMs, 'ms');
  
  // Try to load SDK dynamically as fallback
  console.log('[adsgram] Trying to load SDK dynamically...');
  await loadAdsgramSDK();
  
  if (window.SAD) {
    sdkInstance = window.SAD;
    return window.SAD;
  }
  
  return null;
}

/**
 * Dynamically load AdsGram SDK
 */
export async function loadAdsgramSDK(): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.SAD) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="adsgram"]')) {
      // Wait for existing script
      const checkInterval = setInterval(() => {
        if (window.SAD) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 10000);
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://sad.adsgram.ai/js/sad.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('[adsgram] Script loaded');
      setTimeout(() => {
        if (window.SAD) {
          console.log('[adsgram] SDK available after dynamic load');
          resolve(true);
        } else {
          console.warn('[adsgram] Script loaded but SDK not available');
          resolve(false);
        }
      }, 500);
    };
    
    script.onerror = (err) => {
      console.error('[adsgram] Failed to load SDK script:', err);
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

/**
 * Initialize AdsGram SDK (Sad API)
 */
export function initAdsgram(): Sad | null {
  console.log('[adsgram] initAdsgram called');
  console.log('[adsgram] window.SAD exists:', !!window.SAD);
  console.log('[adsgram] cached sdkInstance:', !!sdkInstance);

  // Return cached instance if available
  if (sdkInstance) {
    return sdkInstance;
  }

  if (!window.SAD) {
    console.warn('[adsgram] SDK not loaded - need to wait');
    return null;
  }

  console.log('[adsgram] SDK found and initialized!');
  sdkInstance = window.SAD;
  return window.SAD;
}

/**
 * Grant XP boost via server
 * Server-side validation ensures boost cannot be forged
 */
export async function grantXpBoostFromServer(telegramId: number): Promise<{ success: boolean; error?: string; alreadyActive?: boolean }> {
  const url = getEdgeFunctionUrl();
  
  if (!url || url.includes('undefined') || url.includes('null')) {
    console.error('[adsgram] Edge function URL not configured:', url);
    return {
      success: false,
      error: 'Boost service is not configured. Please try again later.',
    };
  }

  console.log('[adsgram] Granting XP boost from server...');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: telegramId.toString(),
        ad_id: `ad_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        reward_type: 'xp_boost',
      }),
    });

    const data = await response.json();
    console.log('[adsgram] Server response:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to grant boost',
        alreadyActive: data.already_active || false,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('[adsgram] Failed to grant XP boost:', err);
    return {
      success: false,
      error: 'Network error - please try again',
    };
  }
}

/**
 * Show reward ad and handle completion (Sad API)
 */
export async function showRewardAd(
  sad: Sad,
  telegramId: number
): Promise<AdShowResult> {
  return new Promise((resolve) => {
    console.log('[adsgram] Showing reward ad...');
    
    sad.showRewardedAd({
      blockId: ADSGRAM_BLOCK_ID,
      token: ADSGRAM_TOKEN,
      onReward: async () => {
        console.log('[adsgram] Ad watched, granting reward via server...');
        const grantResult = await grantXpBoostFromServer(telegramId);
        console.log('[adsgram] Grant result:', JSON.stringify(grantResult));

        if (grantResult.success) {
          resolve({
            success: true,
            boostActivated: true,
          });
        } else {
          resolve({
            success: false,
            error: grantResult.error || 'Failed to grant reward',
            alreadyActive: grantResult.alreadyActive,
          });
        }
      },
      onError: (error) => {
        console.error('[adsgram] Ad error:', error);
        resolve({
          success: false,
          error: error?.message || 'Сталася помилка при відтворенні реклами',
        });
      },
      onClose: () => {
        console.log('[adsgram] Ad closed before completion');
        resolve({
          success: false,
          error: 'Рекламу закрито до завершення',
        });
      },
    });
  });
}

/**
 * Check if XP boost is currently active (x3 multiplier)
 */
export function isXpBoostActive(activeBoosters: { xp_boost_end?: number | null; xp_boost_mult?: number } | null): boolean {
  const xpBoostEnd = activeBoosters?.xp_boost_end as number | undefined;
  const xpBoostMult = activeBoosters?.xp_boost_mult as number | undefined;

  if (!xpBoostEnd || !xpBoostMult) return false;

  // Only x3 boost counts (x2 is from Stars purchases)
  return xpBoostEnd > Date.now() && xpBoostMult >= XP_BOOST_MULTIPLIER;
}

/**
 * Get remaining time for XP boost in milliseconds
 */
export function getXpBoostRemainingTime(activeBoosters: { xp_boost_end?: number | null } | null): number {
  const xpBoostEnd = activeBoosters?.xp_boost_end as number | undefined;

  if (!xpBoostEnd) return 0;

  return Math.max(0, xpBoostEnd - Date.now());
}

/**
 * Format remaining time as human-readable string (MM:SS or HH:MM:SS)
 */
export function formatRemainingTime(ms: number): string {
  if (ms <= 0) return '0:00';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
