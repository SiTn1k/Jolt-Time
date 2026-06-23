-- Migration: Create ads_views table
-- Description: Tracks individual ad view events for users
-- 
-- IMPORTANT: This table tracks ad views for analytics and reward limits.
-- AdsGram revenue goes to Jolt Time - players earn in-game rewards only.

CREATE TABLE IF NOT EXISTS ads_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ad identification
    ad_type VARCHAR(50) NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    
    -- Reward given (for verification)
    reward_amount INTEGER NOT NULL DEFAULT 0,
    
    -- When the ad was shown
    shown_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional: AdsGram ad ID (for future integration)
    adsgram_ad_id VARCHAR(255),
    
    -- Optional: Session ID for deduplication
    session_id VARCHAR(255)
);

-- Indexes for efficient queries
-- By user: find all views for a user
CREATE INDEX IF NOT EXISTS idx_ads_views_user_id ON ads_views(user_id);

-- By time: find views within a time range (for daily limits)
CREATE INDEX IF NOT EXISTS idx_ads_views_shown_at ON ads_views(shown_at DESC);

-- By user and time: find today's views for a user
CREATE INDEX IF NOT EXISTS idx_ads_views_user_shown ON ads_views(user_id, shown_at DESC);

-- By ad type: analyze ad performance
CREATE INDEX IF NOT EXISTS idx_ads_views_ad_type ON ads_views(ad_type);

-- Composite index for daily limit checks
CREATE INDEX IF NOT EXISTS idx_ads_views_user_type_date ON ads_views(user_id, ad_type, shown_at DESC);

-- Constraint: reward_amount should be non-negative
ALTER TABLE ads_views ADD CONSTRAINT ads_views_reward_amount_positive 
    CHECK (reward_amount >= 0);
