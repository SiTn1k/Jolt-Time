-- Migration: Add energy fields to users table
-- Description: Adds energy-related fields to track player energy state
--
-- Fields:
-- - current_energy: Player's current energy amount
-- - max_energy: Player's maximum energy cap
-- - last_energy_update: When energy was last updated (for offline recovery)
-- - total_energy_spent: Lifetime energy spent (analytics)
-- - total_energy_restored: Lifetime energy restored (analytics)

ALTER TABLE users ADD COLUMN IF NOT EXISTS current_energy INTEGER DEFAULT 100;
ALTER TABLE users ADD COLUMN IF NOT EXISTS max_energy INTEGER DEFAULT 100;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_energy_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_energy_spent INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_energy_restored INTEGER DEFAULT 0;

-- Constraints
ALTER TABLE users ADD CONSTRAINT users_current_energy_positive CHECK (current_energy >= 0);
ALTER TABLE users ADD CONSTRAINT users_max_energy_positive CHECK (max_energy >= 0);
ALTER TABLE users ADD CONSTRAINT users_current_not_exceed_max CHECK (current_energy <= max_energy);

-- Index for energy-based queries (finding players with low energy, etc.)
CREATE INDEX IF NOT EXISTS idx_users_energy ON users(current_energy, max_energy);
CREATE INDEX IF NOT EXISTS idx_users_last_energy_update ON users(last_energy_update);
