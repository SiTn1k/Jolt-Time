/**
 * Daily Rewards API
 * 
 * RESTful API endpoints for daily rewards functionality.
 * 
 * Base URL: /api/v1/daily-rewards
 * 
 * Endpoints:
 * - GET  /calendar     - Get reward calendar for user
 * - GET  /can-claim     - Check if user can claim today
 * - POST /claim         - Claim daily reward
 * - GET  /history       - Get user's claim history
 * - GET  /analytics     - Get reward analytics (admin)
 */

import type { Request, Response } from 'express';
import { getDailyRewardService } from '../services/DailyRewardService';
import { DEFAULT_WEEKLY_REWARDS, getRewardDisplayInfo } from '../types/daily-rewards';

/**
 * GET /api/v1/daily-rewards/calendar
 * 
 * Get the reward calendar with current status for a user.
 * 
 * Request:
 *   - Headers: x-user-id (required)
 * 
 * Response:
 *   - 200: { rewards, currentDay, canClaimToday, streak }
 *   - 400: { error }
 *   - 500: { error }
 */
export async function getRewardCalendar(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      res.status(400).json({ error: 'Missing x-user-id header' });
      return;
    }

    const service = getDailyRewardService();
    const calendar = await service.getRewardCalendar(userId);

    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    console.error('API Error - getRewardCalendar:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

/**
 * GET /api/v1/daily-rewards/can-claim
 * 
 * Check if the user can claim their daily reward.
 * 
 * Request:
 *   - Headers: x-user-id (required)
 * 
 * Response:
 *   - 200: { canClaim, currentDay, currentStreak, nextClaimTime?, reason? }
 *   - 400: { error }
 *   - 500: { error }
 */
export async function canClaimReward(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      res.status(400).json({ error: 'Missing x-user-id header' });
      return;
    }

    const service = getDailyRewardService();
    const result = await service.canClaimReward(userId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('API Error - canClaimReward:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

/**
 * POST /api/v1/daily-rewards/claim
 * 
 * Claim the daily reward.
 * 
 * Request:
 *   - Headers: x-user-id (required)
 *   - Body: { multiplier?: number } (optional)
 * 
 * Response:
 *   - 200: { success, dayNumber, streak, rewards, message }
 *   - 400: { error }
 *   - 409: { error } - Already claimed today
 *   - 500: { error }
 */
export async function claimReward(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.headers['x-user-id'] as string;
    const multiplier = req.body?.multiplier || 1.0;
    
    if (!userId) {
      res.status(400).json({ error: 'Missing x-user-id header' });
      return;
    }

    if (typeof multiplier !== 'number' || multiplier < 0) {
      res.status(400).json({ error: 'Invalid multiplier value' });
      return;
    }

    const service = getDailyRewardService();
    const result = await service.claimReward(userId, multiplier);

    if (!result.success) {
      if (result.error?.includes('Already claimed')) {
        res.status(409).json({ success: false, error: result.error });
        return;
      }
      res.status(400).json({ success: false, error: result.error });
      return;
    }

    res.json({
      success: true,
      data: {
        dayNumber: result.dayNumber,
        streak: result.streak,
        rewards: result.rewards,
        message: result.message
      }
    });
  } catch (error) {
    console.error('API Error - claimReward:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

/**
 * GET /api/v1/daily-rewards/history
 * 
 * Get the user's reward claim history.
 * 
 * Request:
 *   - Headers: x-user-id (required)
 *   - Query: limit (optional, default 30)
 * 
 * Response:
 *   - 200: { success, history }
 *   - 400: { error }
 *   - 500: { error }
 */
export async function getHistory(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.headers['x-user-id'] as string;
    const limit = parseInt(req.query.limit as string) || 30;
    
    if (!userId) {
      res.status(400).json({ error: 'Missing x-user-id header' });
      return;
    }

    if (limit < 1 || limit > 100) {
      res.status(400).json({ error: 'Limit must be between 1 and 100' });
      return;
    }

    const service = getDailyRewardService();
    const result = await service.getUserHistory(userId, limit);

    res.json({
      success: true,
      data: {
        history: result.history
      }
    });
  } catch (error) {
    console.error('API Error - getHistory:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

/**
 * GET /api/v1/daily-rewards/analytics
 * 
 * Get reward analytics (admin endpoint).
 * 
 * Request:
 *   - Headers: x-admin-key (required)
 * 
 * Response:
 *   - 200: { success, analytics }
 *   - 401: { error } - Unauthorized
 *   - 500: { error }
 */
export async function getAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const adminKey = req.headers['x-admin-key'] as string;
    
    // Simple admin key check (in production, use proper auth)
    if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const service = getDailyRewardService();
    const analytics = await service.getAnalytics();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('API Error - getAnalytics:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

/**
 * GET /api/v1/daily-rewards/template
 * 
 * Get the reward template (public endpoint).
 * 
 * Response:
 *   - 200: { success, rewards }
 */
export async function getRewardTemplate(req: Request, res: Response): Promise<void> {
  try {
    const rewards = DEFAULT_WEEKLY_REWARDS.map((reward) => {
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
        capsuleType: reward.capsuleType,
      };
    });

    res.json({
      success: true,
      data: { rewards }
    });
  } catch (error) {
    console.error('API Error - getRewardTemplate:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}

/**
 * POST /api/v1/daily-rewards/reset
 * 
 * Reset a user's streak (admin endpoint).
 * 
 * Request:
 *   - Headers: x-admin-key (required)
 *   - Body: { userId }
 * 
 * Response:
 *   - 200: { success }
 *   - 400: { error }
 *   - 401: { error } - Unauthorized
 *   - 500: { error }
 */
export async function resetStreak(req: Request, res: Response): Promise<void> {
  try {
    const adminKey = req.headers['x-admin-key'] as string;
    const { userId } = req.body;
    
    if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const service = getDailyRewardService();
    const success = await service.resetStreak(userId);

    if (!success) {
      res.status(500).json({ success: false, error: 'Failed to reset streak' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('API Error - resetStreak:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
