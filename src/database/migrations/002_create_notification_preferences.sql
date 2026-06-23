-- Migration: Create notification_preferences table
-- Description: Stores user notification preference switches for different notification categories

CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Individual notification category toggles
    daily_reminders BOOLEAN DEFAULT true,          -- Daily reward reminder
    events BOOLEAN DEFAULT true,                   -- Event started notifications
    research_complete BOOLEAN DEFAULT true,        -- Academy research completed
    energy_restored BOOLEAN DEFAULT true,         -- Energy restored notifications
    building_complete BOOLEAN DEFAULT true,        -- Building upgrade completed
    marketing BOOLEAN DEFAULT false,               -- Marketing notifications (off by default)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one preferences record per user
    UNIQUE(user_id)
);

-- Index for quick lookup by user_id
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
