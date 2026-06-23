-- Migration: Create user_daily_rewards table
-- Description: Tracks each user's daily reward progress and streak
--
-- Key concepts:
-- - current_streak: Consecutive days user has claimed rewards
-- - last_claim_date: When user last claimed a daily reward
-- - total_claims: Lifetime count of claimed rewards
--
-- Streak logic:
-- - If user claims today and last_claim was yesterday: streak++
-- - If user misses a day (last_claim was before yesterday): streak resets to 1
-- - Day 7 special reward requires 7 consecutive days

CREATE TABLE IF NOT EXISTS user_daily_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Current streak count (resets if user misses a day)
    current_streak INTEGER DEFAULT 0,
    
    -- Last successful claim date (date only, not datetime)
    last_claim_date DATE,
    
    -- Lifetime total claims (for analytics)
    total_claims INTEGER DEFAULT 0,
    
    -- Highest streak achieved (for achievements)
    highest_streak INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One record per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_daily_rewards_user_id ON user_daily_rewards(user_id);

-- Index for finding users who haven't claimed today (for notifications)
CREATE INDEX IF NOT EXISTS idx_user_daily_rewards_last_claim ON user_daily_rewards(last_claim_date);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_user_daily_rewards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS user_daily_rewards_updated_at ON user_daily_rewards;
CREATE TRIGGER user_daily_rewards_updated_at
    BEFORE UPDATE ON user_daily_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_user_daily_rewards_updated_at();
