-- Migration: Create notification_cooldowns table
-- Description: Tracks when each notification type was last sent to each user to enforce cooldown periods

CREATE TABLE IF NOT EXISTS notification_cooldowns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification type that has a cooldown
    notification_type VARCHAR(50) NOT NULL,
    
    -- When the cooldown expires (can send next notification after this time)
    cooldown_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint: one cooldown record per user per notification type
    UNIQUE(user_id, notification_type)
);

-- Index for checking active cooldowns efficiently
CREATE INDEX IF NOT EXISTS idx_notification_cooldowns_user_type ON notification_cooldowns(user_id, notification_type);

-- Index for finding expired cooldowns (cleanup)
CREATE INDEX IF NOT EXISTS idx_notification_cooldowns_expires ON notification_cooldowns(cooldown_expires_at);
