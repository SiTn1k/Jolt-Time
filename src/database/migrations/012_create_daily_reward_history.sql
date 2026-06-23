-- Migration: Create daily_reward_history table
-- Description: Records every reward claim for audit and analytics
--
-- This table provides:
-- - Complete audit trail of all claims
-- - Analytics data for reward popularity
-- - User history for achievements
-- - Prevention of duplicate claims

CREATE TABLE IF NOT EXISTS daily_reward_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Which day in the cycle this reward was for
    reward_day INTEGER NOT NULL,
    
    -- The streak value when claimed (snapshot for analytics)
    streak_at_claim INTEGER NOT NULL,
    
    -- Reward breakdown
    coins_amount INTEGER DEFAULT 0,
    energy_amount INTEGER DEFAULT 0,
    time_shards_amount INTEGER DEFAULT 0,
    booster_type VARCHAR(50),
    booster_amount INTEGER DEFAULT 0,
    
    -- Total value for analytics
    total_value INTEGER DEFAULT 0,
    
    -- If reward was boosted by event or AdsGram
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    
    -- When claimed
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional event reference
    event_id VARCHAR(50)
);

-- Index for user history lookups
CREATE INDEX IF NOT EXISTS idx_daily_reward_history_user_id ON daily_reward_history(user_id);

-- Index for date-based analytics
CREATE INDEX IF NOT EXISTS idx_daily_reward_history_claimed_at ON daily_reward_history(claimed_at DESC);

-- Index for finding duplicate claims (same user + same day)
CREATE INDEX IF NOT EXISTS idx_daily_reward_history_user_day ON daily_reward_history(user_id, reward_day, claimed_at);

-- Index for analytics aggregations
CREATE INDEX IF NOT EXISTS idx_daily_reward_history_day ON daily_reward_history(reward_day);

-- Create view for claim statistics
CREATE OR REPLACE VIEW daily_reward_stats AS
SELECT 
    DATE(claimed_at) as claim_date,
    COUNT(*) as total_claims,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(coins_amount) as total_coins,
    SUM(energy_amount) as total_energy,
    AVG(streak_at_claim) as avg_streak
FROM daily_reward_history
GROUP BY DATE(claimed_at)
ORDER BY claim_date DESC;
