-- Migration: Create energy_boosters table
-- Description: Defines available energy booster items
--
-- Boosters can be:
-- - One-time use: +X energy immediately
-- - Timed: +X energy per minute for Y minutes
-- - Passive: Increase max energy temporarily
--
-- Future support:
-- - VIP multipliers
-- - Seasonal modifiers
-- - Premium subscription boosts

CREATE TABLE IF NOT EXISTS energy_boosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Booster identification
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Energy amount
    energy_amount INTEGER NOT NULL,
    
    -- Duration in minutes (0 for instant, >0 for timed)
    duration_minutes INTEGER DEFAULT 0,
    
    -- Booster type
    booster_type VARCHAR(50) NOT NULL DEFAULT 'instant',
    -- Types: 'instant', 'passive', 'max_boost'
    
    -- Cost (if purchasable)
    cost_coins INTEGER,
    cost_gems INTEGER,
    
    -- Availability
    is_premium BOOLEAN DEFAULT false,
    is_limited BOOLEAN DEFAULT false,
    
    -- For seasonal/limited events
    event_id VARCHAR(50),
    available_until TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT positive_energy CHECK (energy_amount > 0),
    CONSTRAINT positive_duration CHECK (duration_minutes >= 0)
);

-- Index for finding available boosters
CREATE INDEX IF NOT EXISTS idx_energy_boosters_type ON energy_boosters(booster_type);
CREATE INDEX IF NOT EXISTS idx_energy_boosters_premium ON energy_boosters(is_premium);
CREATE INDEX IF NOT EXISTS idx_energy_boosters_event ON energy_boosters(event_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_energy_boosters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS energy_boosters_updated_at ON energy_boosters;
CREATE TRIGGER energy_boosters_updated_at
    BEFORE UPDATE ON energy_boosters
    FOR EACH ROW
    EXECUTE FUNCTION update_energy_boosters_updated_at();

-- Insert default boosters
INSERT INTO energy_boosters (name, description, energy_amount, booster_type, cost_coins) VALUES
('Small Energy Pack', 'Restores 50 energy instantly', 50, 'instant', 100),
('Medium Energy Pack', 'Restores 150 energy instantly', 150, 'instant', 250),
('Large Energy Pack', 'Restores 300 energy instantly', 300, 'instant', 500),
('Energy Surge', 'Restores 50 energy per minute for 10 minutes', 50, 'passive', 1000),
('Max Energy Boost', 'Increases max energy by 25 for 24 hours', 25, 'max_boost', 750)
ON CONFLICT DO NOTHING;
