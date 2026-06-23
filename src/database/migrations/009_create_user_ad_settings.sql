-- Migration: Create user_ad_settings table
-- Description: Per-user ad preferences and tracking
--
-- Stores user preferences for ads and tracking for frequency balancing.

CREATE TABLE IF NOT EXISTS user_ad_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- User preferences
    ads_enabled BOOLEAN DEFAULT true,          -- Master switch for ads
    reward_ads_enabled BOOLEAN DEFAULT true,   -- Show reward ads
    
    -- Premium users see fewer ads
    is_premium BOOLEAN DEFAULT false,
    
    -- Last ad shown timestamp (for frequency balancing)
    last_ad_shown_at TIMESTAMP WITH TIME ZONE,
    
    -- Consecutive ad views (for engagement tracking)
    consecutive_ad_days INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One setting per user
    UNIQUE(user_id)
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_user_ad_settings_user_id ON user_ad_settings(user_id);

-- Index for finding users with ads enabled
CREATE INDEX IF NOT EXISTS idx_user_ad_settings_enabled ON user_ad_settings(ads_enabled) WHERE ads_enabled = true;

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_user_ad_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS user_ad_settings_updated_at ON user_ad_settings;
CREATE TRIGGER user_ad_settings_updated_at
    BEFORE UPDATE ON user_ad_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_ad_settings_updated_at();
