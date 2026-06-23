/**
 * DailyRewardScreen
 * 
 * Premium reward screen with horizontal cards displaying the weekly reward calendar.
 * 
 * Features:
 * - Horizontal scrollable cards showing all 7 days
 * - Current day highlighted with glow effect
 * - Already claimed rewards marked with checkmark
 * - Animated claim button
 * - Blue neon style from ui-style.md
 * - Mobile-first layout
 * 
 * Reward Calendar:
 * Day 1: 50 Energy
 * Day 2: 100 Coins
 * Day 3: 1 Common Capsule
 * Day 4: 150 Coins
 * Day 5: 100 Energy
 * Day 6: 1 Rare Capsule
 * Day 7: Chrono Chest (Special)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DailyRewardType, getRewardDisplayInfo, DEFAULT_WEEKLY_REWARDS } from '../types/daily-rewards';

// Types for the component
interface DailyRewardScreenProps {
  userId: string;
  onClose?: () => void;
}

interface RewardCard {
  dayNumber: number;
  rewardType: DailyRewardType;
  rewardAmount: number;
  label: string;
  icon: string;
  isSpecial: boolean;
  description: string;
}

interface DailyRewardState {
  currentDay: number;
  canClaimToday: boolean;
  streak: number;
  claimedDays: Set<number>;
  isLoading: boolean;
  isClaiming: boolean;
  error: string | null;
}

// CSS styles as constants (inline styles for portability)
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0A0E17 0%, #131B2E 100%)',
    padding: '16px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#FFFFFF',
    overflow: 'hidden',
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: '#B8C5D6',
    marginTop: '4px',
  } as React.CSSProperties,
  streakBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(0, 255, 229, 0.1))',
    border: '1px solid rgba(0, 217, 255, 0.3)',
    borderRadius: '20px',
    padding: '8px 16px',
    marginTop: '12px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#00D9FF',
  } as React.CSSProperties,
  cardsContainer: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '16px',
    marginBottom: '16px',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
  } as React.CSSProperties,
  card: {
    flexShrink: 0,
    width: '140px',
    padding: '16px',
    borderRadius: '16px',
    background: '#131B2E',
    border: '1px solid rgba(0, 217, 255, 0.1)',
    textAlign: 'center' as const,
    transition: 'all 0.3s ease',
    scrollSnapAlign: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  cardCurrent: {
    border: '2px solid #00D9FF',
    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3), inset 0 0 20px rgba(0, 217, 255, 0.05)',
  } as React.CSSProperties,
  cardClaimed: {
    opacity: 0.6,
    border: '1px solid rgba(0, 255, 136, 0.3)',
  } as React.CSSProperties,
  cardSpecial: {
    background: 'linear-gradient(135deg, #131B2E, rgba(255, 215, 0, 0.1))',
    border: '1px solid rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,
  cardDay: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6B7A8F',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  } as React.CSSProperties,
  cardIcon: {
    fontSize: '36px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 0 8px currentColor)',
  } as React.CSSProperties,
  cardLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: '4px',
  } as React.CSSProperties,
  cardAmount: {
    fontSize: '12px',
    color: '#B8C5D6',
  } as React.CSSProperties,
  cardCheckmark: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#00FF88',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#0A0E17',
    fontWeight: 700,
  } as React.CSSProperties,
  cardCurrentBadge: {
    position: 'absolute' as const,
    top: '8px',
    left: '8px',
    background: 'linear-gradient(135deg, #00D9FF, #00FFE5)',
    borderRadius: '8px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#0A0E17',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  claimButton: {
    width: '100%',
    height: '56px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #00D9FF, #00FFE5)',
    color: '#0A0E17',
    fontSize: '18px',
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 20px rgba(0, 217, 255, 0.3)',
  } as React.CSSProperties,
  claimButtonDisabled: {
    background: 'linear-gradient(135deg, #3A4556, #2A3545)',
    color: '#6B7A8F',
    cursor: 'not-allowed',
    boxShadow: 'none',
  } as React.CSSProperties,
  claimButtonLoading: {
    background: 'linear-gradient(135deg, #00A8C6, #00CCB8)',
    cursor: 'wait',
  } as React.CSSProperties,
  errorMessage: {
    textAlign: 'center' as const,
    color: '#FF4757',
    fontSize: '14px',
    marginTop: '12px',
    padding: '12px',
    background: 'rgba(255, 71, 87, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 71, 87, 0.2)',
  } as React.CSSProperties,
  successOverlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(10, 14, 23, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    animation: 'fadeIn 0.3s ease',
  } as React.CSSProperties,
  successContent: {
    background: '#131B2E',
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center' as const,
    border: '2px solid #00D9FF',
    boxShadow: '0 0 40px rgba(0, 217, 255, 0.3)',
    maxWidth: '300px',
    animation: 'scaleIn 0.3s ease',
  } as React.CSSProperties,
  successIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  } as React.CSSProperties,
  successTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '8px',
  } as React.CSSProperties,
  successMessage: {
    fontSize: '16px',
    color: '#B8C5D6',
    marginBottom: '24px',
  } as React.CSSProperties,
  successRewards: {
    background: 'rgba(0, 217, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
  } as React.CSSProperties,
  successRewardItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: 600,
    color: '#00D9FF',
  } as React.CSSProperties,
  closeButton: {
    width: '100%',
    height: '48px',
    borderRadius: '12px',
    border: '2px solid #00D9FF',
    background: 'transparent',
    color: '#00D9FF',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
};

// Keyframe animations as a style tag
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 217, 255, 0.3); }
    50% { box-shadow: 0 0 40px rgba(0, 217, 255, 0.5); }
  }
  
  .claim-button:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 217, 255, 0.4);
  }
  
  .claim-button:not(:disabled):active {
    transform: scale(0.98);
  }
  
  .current-card {
    animation: glow 2s ease-in-out infinite;
  }
  
  .cards-container::-webkit-scrollbar {
    height: 6px;
  }
  
  .cards-container::-webkit-scrollbar-track {
    background: #0A0E17;
    border-radius: 3px;
  }
  
  .cards-container::-webkit-scrollbar-thumb {
    background: #00D9FF;
    border-radius: 3px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .current-card,
    .claim-button {
      animation: none;
    }
  }
`;

/**
 * DailyRewardScreen Component
 */
export const DailyRewardScreen: React.FC<DailyRewardScreenProps> = ({ userId, onClose }) => {
  const [state, setState] = useState<DailyRewardState>({
    currentDay: 1,
    canClaimToday: true,
    streak: 0,
    claimedDays: new Set<number>(),
    isLoading: true,
    isClaiming: false,
    error: null,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [claimedReward, setClaimedReward] = useState<RewardCard | null>(null);

  // Build reward cards from DEFAULT_WEEKLY_REWARDS
  const rewardCards: RewardCard[] = DEFAULT_WEEKLY_REWARDS.map((reward) => {
    const displayInfo = getRewardDisplayInfo({
      id: `default-${reward.dayNumber}`,
      dayNumber: reward.dayNumber,
      rewardType: reward.rewardType,
      rewardAmount: reward.rewardAmount,
      coinsReward: reward.coinsReward,
      energyReward: reward.energyReward,
      capsuleType: reward.capsuleType,
      isSpecial: reward.isSpecial,
      isPremiumOnly: false,
      eventId: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      dayNumber: reward.dayNumber,
      rewardType: reward.rewardType,
      rewardAmount: reward.rewardAmount,
      label: displayInfo.label,
      icon: displayInfo.icon,
      isSpecial: displayInfo.isSpecial,
      description: displayInfo.description,
    };
  });

  // Load initial state (simulated - in production would call API)
  useEffect(() => {
    const loadState = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, initialize with day 1 available
      setState({
        currentDay: 1,
        canClaimToday: true,
        streak: 0,
        claimedDays: new Set<number>(),
        isLoading: false,
        isClaiming: false,
        error: null,
      });
    };

    loadState();
  }, [userId]);

  // Handle claiming a reward
  const handleClaim = useCallback(async () => {
    if (!state.canClaimToday || state.isClaiming) return;

    setState(prev => ({ ...prev, isClaiming: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const currentReward = rewardCards.find(c => c.dayNumber === state.currentDay);
      
      if (!currentReward) {
        throw new Error('Invalid day');
      }

      // Update state to mark as claimed
      setState(prev => ({
        ...prev,
        canClaimToday: false,
        streak: prev.streak + 1,
        claimedDays: new Set([...prev.claimedDays, prev.currentDay]),
        isClaiming: false,
      }));

      // Show success overlay
      setClaimedReward(currentReward);
      setShowSuccess(true);

    } catch (error) {
      setState(prev => ({
        ...prev,
        isClaiming: false,
        error: error instanceof Error ? error.message : 'Failed to claim reward',
      }));
    }
  }, [state.canClaimToday, state.isClaiming, state.currentDay, rewardCards]);

  // Close success overlay and reset
  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
    setClaimedReward(null);
    
    // Advance to next day for demo purposes
    setState(prev => ({
      ...prev,
      currentDay: (prev.currentDay % 7) + 1,
      canClaimToday: true,
    }));
  }, []);

  // Get button text
  const getButtonText = () => {
    if (state.isClaiming) return 'Claiming...';
    if (!state.canClaimToday) return 'Claimed Today';
    return `Claim Day ${state.currentDay}`;
  };

  // Get card style based on state
  const getCardStyle = (card: RewardCard): React.CSSProperties => {
    const isCurrent = card.dayNumber === state.currentDay;
    const isClaimed = state.claimedDays.has(card.dayNumber) || (!state.canClaimToday && isCurrent);

    return {
      ...styles.card,
      ...(isCurrent && !isClaimed ? styles.cardCurrent : {}),
      ...(isClaimed ? styles.cardClaimed : {}),
      ...(card.isSpecial && !isClaimed ? styles.cardSpecial : {}),
    };
  };

  if (state.isLoading) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div style={styles.header}>
          <h1 style={styles.title}>Daily Rewards</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Daily Rewards</h1>
        <p style={styles.subtitle}>Claim your daily rewards every day!</p>
        {state.streak > 0 && (
          <div style={styles.streakBadge}>
            🔥 {state.streak} Day Streak
          </div>
        )}
      </div>

      {/* Error Message */}
      {state.error && (
        <div style={styles.errorMessage}>
          {state.error}
        </div>
      )}

      {/* Reward Cards */}
      <div style={styles.cardsContainer} className="cards-container">
        {rewardCards.map((card) => {
          const isCurrent = card.dayNumber === state.currentDay;
          const isClaimed = state.claimedDays.has(card.dayNumber);
          const showCheckmark = isClaimed || (!state.canClaimToday && isCurrent);

          return (
            <div
              key={card.dayNumber}
              style={getCardStyle(card)}
              className={isCurrent && !isClaimed ? 'current-card' : ''}
            >
              {/* Current Day Badge */}
              {isCurrent && !isClaimed && (
                <div style={styles.cardCurrentBadge}>Today</div>
              )}

              {/* Checkmark */}
              {showCheckmark && (
                <div style={styles.cardCheckmark}>✓</div>
              )}

              {/* Card Content */}
              <div style={styles.cardDay}>Day {card.dayNumber}</div>
              <div style={styles.cardIcon}>{card.icon}</div>
              <div style={styles.cardLabel}>{card.label}</div>
              <div style={styles.cardAmount}>{card.description}</div>

              {/* Special indicator */}
              {card.isSpecial && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#FFD700',
                  textTransform: 'uppercase',
                }}>
                  ⭐ Special
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Claim Button */}
      <button
        className="claim-button"
        style={{
          ...styles.claimButton,
          ...(!state.canClaimToday || state.isClaiming ? styles.claimButtonDisabled : {}),
          ...(state.isClaiming ? styles.claimButtonLoading : {}),
        }}
        onClick={handleClaim}
        disabled={!state.canClaimToday || state.isClaiming}
      >
        {state.isClaiming ? (
          <>
            <span>⏳</span>
            Claiming...
          </>
        ) : (
          <>
            <span>🎁</span>
            {getButtonText()}
          </>
        )}
      </button>

      {/* Close Button */}
      {onClose && (
        <button
          style={{
            ...styles.closeButton,
            marginTop: '12px',
          }}
          onClick={onClose}
        >
          Close
        </button>
      )}

      {/* Success Overlay */}
      {showSuccess && claimedReward && (
        <div style={styles.successOverlay} onClick={handleCloseSuccess}>
          <div style={styles.successContent} onClick={e => e.stopPropagation()}>
            <div style={styles.successIcon}>🎉</div>
            <div style={styles.successTitle}>Reward Claimed!</div>
            <div style={styles.successMessage}>
              You've received your Day {claimedReward.dayNumber} reward
            </div>
            <div style={styles.successRewards}>
              <div style={styles.successRewardItem}>
                <span>{claimedReward.icon}</span>
                {claimedReward.description}
              </div>
            </div>
            <button
              style={styles.closeButton}
              onClick={handleCloseSuccess}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyRewardScreen;
