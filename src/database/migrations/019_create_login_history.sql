-- Migration: Create login_history table for tracking login attempts
-- Task: #164 - Production Authentication System Implementation

CREATE TABLE IF NOT EXISTS login_history (
    id TEXT PRIMARY KEY,
    internal_user_id TEXT NOT NULL,
    telegram_id BIGINT,
    provider TEXT NOT NULL DEFAULT 'telegram',
    success BOOLEAN NOT NULL DEFAULT true,
    ip_address TEXT,
    user_agent TEXT,
    device_info TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for login history queries
CREATE INDEX IF NOT EXISTS idx_login_history_internal_user_id ON login_history(internal_user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_telegram_id ON login_history(telegram_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON login_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_success ON login_history(success);

-- Comment
COMMENT ON TABLE login_history IS 'Tracks user login attempts for security auditing';