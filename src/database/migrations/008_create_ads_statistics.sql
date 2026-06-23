-- Migration: Create ads_statistics table
-- Description: Aggregated daily statistics for ad performance tracking
-- 
-- This table is populated by a daily cron job that aggregates
-- data from ads_views for analytics dashboards.

CREATE TABLE IF NOT EXISTS ads_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Date of the statistics
    date DATE NOT NULL,
    
    -- Impression counts by ad type
    impressions INTEGER DEFAULT 0,
    reward_claims INTEGER DEFAULT 0,
    
    -- User counts
    unique_users INTEGER DEFAULT 0,
    
    -- Revenue tracking (Jolt Time revenue, not user earnings)
    -- Stored in cents to avoid floating point issues
    estimated_revenue_cents INTEGER DEFAULT 0,
    
    -- Breakdown by ad type (JSONB for flexibility)
    -- Example: {"rewarded": 100, "energy": 50, "expedition_boost": 25}
    breakdown_by_type JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per date
    UNIQUE(date)
);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_ads_statistics_date ON ads_statistics(date DESC);

-- Index for revenue queries
CREATE INDEX IF NOT EXISTS idx_ads_statistics_revenue ON ads_statistics(estimated_revenue_cents);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_ads_statistics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS ads_statistics_updated_at ON ads_statistics;
CREATE TRIGGER ads_statistics_updated_at
    BEFORE UPDATE ON ads_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_ads_statistics_updated_at();
