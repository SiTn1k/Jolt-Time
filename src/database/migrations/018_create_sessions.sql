-- Migration: Create sessions table for session management
-- Task: #164 - Production Authentication System Implementation

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    internal_user_id TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    provider TEXT NOT NULL DEFAULT 'telegram',
    status TEXT NOT NULL DEFAULT 'active',
    telegram_id BIGINT,
    device_info TEXT,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    refreshed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for session queries
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_internal_user_id ON sessions(internal_user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_telegram_id ON sessions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Comment
COMMENT ON TABLE sessions IS 'User sessions for authentication tracking';