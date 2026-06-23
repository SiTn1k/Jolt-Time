-- Migration: Create bot_logs table
-- Description: Stores bot interaction logs for analytics and debugging

CREATE TABLE IF NOT EXISTS bot_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Telegram user who triggered the event
    telegram_id BIGINT NOT NULL,
    
    -- Type of event logged
    event_type VARCHAR(50) NOT NULL,
    
    -- JSON payload with event details
    payload JSONB DEFAULT '{}',
    
    -- Optional message ID if related to a message
    message_id BIGINT,
    
    -- Optional chat ID
    chat_id BIGINT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_bot_logs_telegram_id ON bot_logs(telegram_id);
CREATE INDEX IF NOT EXISTS idx_bot_logs_event_type ON bot_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_bot_logs_created_at ON bot_logs(created_at DESC);

-- Composite index for user event queries
CREATE INDEX IF NOT EXISTS idx_bot_logs_user_event ON bot_logs(telegram_id, event_type, created_at DESC);

-- Event types enum (documented, not enforced)
COMMENT ON TABLE bot_logs IS 'Event types: command, callback, message, error, notification_sent';
