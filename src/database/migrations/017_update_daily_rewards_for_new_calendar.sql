-- Migration: Update daily rewards schema for new reward calendar
-- Description: Updates the schema to support the new reward calendar with specific rewards
--
-- New Reward Calendar:
-- Day 1: 50 Energy
-- Day 2: 100 Coins
-- Day 3: 1 Common Capsule
-- Day 4: 150 Coins
-- Day 5: 100 Energy
-- Day 6: 1 Rare Capsule
-- Day 7: Chrono Chest (Special)
--
-- Changes:
-- 1. Add current_day to user_daily_rewards to track position in cycle
-- 2. Add reward_type, capsule_type, is_special to daily_rewards
-- 3. Add reward_type, capsule_type, is_special to daily_reward_history

-- Add current_day column to user_daily_rewards
ALTER TABLE user_daily_rewards
ADD COLUMN IF NOT EXISTS current_day INTEGER DEFAULT 1;

-- Update current_day index comment
COMMENT ON COLUMN user_daily_rewards.current_day IS 'Current day in the reward cycle (1-7)';

-- Drop old indexes if they exist (for recreation)
DROP INDEX IF EXISTS idx_daily_rewards_day;
DROP INDEX IF EXISTS idx_daily_rewards_day_number;

-- Add new columns to daily_rewards for reward type tracking
ALTER TABLE daily_rewards
ADD COLUMN IF NOT EXISTS reward_type VARCHAR(50) DEFAULT 'coins',
ADD COLUMN IF NOT EXISTS reward_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS capsule_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS is_special BOOLEAN DEFAULT false;

-- Update existing rows to set reward_type based on existing rewards
UPDATE daily_rewards 
SET 
    reward_type = CASE 
        WHEN coins_reward > 0 AND energy_reward = 0 THEN 'coins'
        WHEN energy_reward > 0 AND coins_reward = 0 THEN 'energy'
        WHEN booster_type IS NOT NULL THEN 'booster'
        ELSE 'coins'
    END,
    reward_amount = GREATEST(coins_reward, energy_reward, booster_amount),
    is_special = (day_number = 7)
WHERE reward_type IS NULL;

-- Make reward_type NOT NULL after update
ALTER TABLE daily_rewards
ALTER COLUMN reward_type SET NOT NULL;

-- Create index for looking up current day rewards
CREATE INDEX IF NOT EXISTS idx_daily_rewards_day_type ON daily_rewards(day_number, reward_type);

-- Add new columns to daily_reward_history
ALTER TABLE daily_reward_history
ADD COLUMN IF NOT EXISTS reward_type VARCHAR(50) DEFAULT 'coins',
ADD COLUMN IF NOT EXISTS capsule_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS is_special BOOLEAN DEFAULT false;

-- Drop old indexes if they exist
DROP INDEX IF EXISTS idx_daily_reward_history_day;

-- Create new composite index for analytics
CREATE INDEX IF NOT EXISTS idx_daily_reward_history_reward_type ON daily_reward_history(reward_type);

-- Create view for reward analytics
CREATE OR REPLACE VIEW daily_reward_analytics AS
SELECT 
    DATE(claimed_at) as claim_date,
    reward_type,
    COUNT(*) as total_claims,
    COUNT(DISTINCT user_id) as unique_users,
    SUM(CASE WHEN reward_type = 'energy' THEN energy_amount ELSE 0 END) as total_energy,
    SUM(CASE WHEN reward_type = 'coins' THEN coins_amount ELSE 0 END) as total_coins,
    SUM(CASE WHEN capsule_type IS NOT NULL THEN 1 ELSE 0 END) as total_capsules,
    AVG(streak_at_claim) as avg_streak
FROM daily_reward_history
GROUP BY DATE(claimed_at), reward_type
ORDER BY claim_date DESC, reward_type;

-- Insert default reward calendar (overwrite if exists)
DELETE FROM daily_rewards WHERE event_id IS NULL;

INSERT INTO daily_rewards (day_number, reward_type, reward_amount, coins_reward, energy_reward, capsule_type, is_special, is_premium_only) VALUES
(1, 'energy', 50, 0, 50, NULL, false, false),
(2, 'coins', 100, 100, 0, NULL, false, false),
(3, 'capsule', 1, 0, 0, 'common', false, false),
(4, 'coins', 150, 150, 0, NULL, false, false),
(5, 'energy', 100, 0, 100, NULL, false, false),
(6, 'capsule', 1, 0, 0, 'rare', false, false),
(7, 'chrono_chest', 1, 0, 0, NULL, true, false)
ON CONFLICT (day_number, event_id) DO UPDATE SET
    reward_type = EXCLUDED.reward_type,
    reward_amount = EXCLUDED.reward_amount,
    coins_reward = EXCLUDED.coins_reward,
    energy_reward = EXCLUDED.energy_reward,
    capsule_type = EXCLUDED.capsule_type,
    is_special = EXCLUDED.is_special;

-- Grant permissions (adjust role name as needed)
-- GRANT SELECT, INSERT, UPDATE ON daily_rewards TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON user_daily_rewards TO authenticated;
-- GRANT SELECT, INSERT ON daily_reward_history TO authenticated;
-- GRANT SELECT ON daily_reward_analytics TO authenticated;
-- GRANT SELECT ON daily_reward_stats TO authenticated;
