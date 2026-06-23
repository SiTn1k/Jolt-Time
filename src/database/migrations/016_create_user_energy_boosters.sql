-- Migration: Create user_energy_boosters table
-- Description: Tracks active/passive boosters for each user
--
-- This table stores:
-- - Active passive energy regen boosters
-- - Pending max energy boosts
-- - Booster purchase history

CREATE TABLE IF NOT EXISTS user_energy_boosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booster_id UUID NOT NULL REFERENCES energy_boosters(id) ON DELETE CASCADE,
    
    -- When booster expires (null = permanent or instant)
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- For passive boosters: energy remaining to be applied
    energy_remaining INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_energy_boosters_user ON user_energy_boosters(user_id);
CREATE INDEX IF NOT EXISTS idx_user_energy_boosters_expires ON user_energy_boosters(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_energy_boosters_active ON user_energy_boosters(user_id, is_active) WHERE is_active = true;
