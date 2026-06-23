-- Migration: Create energy_history table
-- Description: Tracks all energy-related transactions for audit and analytics
--
-- operation_type values:
-- - consume: Energy spent on game actions
-- - restore: Energy restored (natural regeneration)
-- - daily_reward: Energy from daily login reward
-- - ads_reward: Energy from watching AdsGram ad
-- - event_reward: Energy from special events
-- - admin_reward: Energy granted by admin/manual adjustment
-- - offline_recovery: Energy restored based on time away
-- - booster_used: Energy from using a booster item

CREATE TABLE IF NOT EXISTS energy_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Operation type
    operation_type VARCHAR(50) NOT NULL,
    
    -- Amount (positive for restore, positive for consume)
    amount INTEGER NOT NULL,
    
    -- Balance after this operation
    balance_after INTEGER NOT NULL,
    
    -- Optional context (e.g., expedition_id, ad_id, event_id)
    context VARCHAR(255),
    
    -- When the operation occurred
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_energy_history_user_id ON energy_history(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_history_type ON energy_history(operation_type);
CREATE INDEX IF NOT EXISTS idx_energy_history_created_at ON energy_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_energy_history_user_type ON energy_history(user_id, operation_type, created_at DESC);

-- Composite index for user balance queries
CREATE INDEX IF NOT EXISTS idx_energy_history_user_balance ON energy_history(user_id, created_at DESC);

-- Constraint: amount should be positive
ALTER TABLE energy_history ADD CONSTRAINT energy_history_amount_positive CHECK (amount > 0);

-- Create view for energy analytics
CREATE OR REPLACE VIEW energy_analytics AS
SELECT 
    DATE(created_at) as date,
    operation_type,
    COUNT(*) as operation_count,
    SUM(amount) as total_amount,
    COUNT(DISTINCT user_id) as unique_users
FROM energy_history
GROUP BY DATE(created_at), operation_type
ORDER BY date DESC, operation_type;
