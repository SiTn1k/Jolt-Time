-- Migration: Create daily_rewards table
-- Description: Defines the reward structure for each day in the cycle
--
-- This is a template table that defines rewards for each day.
-- The cycle repeats weekly (7 days), but architecture supports:
-- - Weekly cycles (7 days)
-- - Monthly cycles (30 days) 
-- - Seasonal cycles (90 days)
--
-- To add special events, insert rows with event-specific rewards
-- that override the base cycle temporarily.

CREATE TABLE IF NOT EXISTS daily_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Day number in the cycle (1-7 for weekly, 1-30 for monthly, etc.)
    day_number INTEGER NOT NULL CHECK (day_number >= 1),
    
    -- Reward amounts
    coins_reward INTEGER DEFAULT 0,
    energy_reward INTEGER DEFAULT 0,
    time_shards_reward INTEGER DEFAULT 0,
    
    -- Optional booster type (e.g., 'expedition_boost', 'multiplier')
    booster_type VARCHAR(50),
    booster_amount INTEGER DEFAULT 0,
    
    -- Optional special event override
    -- If set, this reward is only available during the event
    event_id VARCHAR(50),
    
    -- Optional premium-only reward
    is_premium_only BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique day numbers per cycle type
    UNIQUE(day_number, event_id)
);

-- Index for looking up current day rewards
CREATE INDEX IF NOT EXISTS idx_daily_rewards_day ON daily_rewards(day_number);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_daily_rewards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS daily_rewards_updated_at ON daily_rewards;
CREATE TRIGGER daily_rewards_updated_at
    BEFORE UPDATE ON daily_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_rewards_updated_at();
