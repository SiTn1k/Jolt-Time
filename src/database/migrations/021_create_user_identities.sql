-- Migration: Create user_identities table for unified user identity
-- Task: #164 - Production Authentication System Implementation

CREATE TABLE IF NOT EXISTS user_identities (
    id TEXT PRIMARY KEY,
    internal_user_id TEXT NOT NULL UNIQUE,
    telegram_id BIGINT UNIQUE,
    provider TEXT NOT NULL DEFAULT 'telegram',
    username TEXT,
    display_name TEXT NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_authenticated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for user identity queries
CREATE INDEX IF NOT EXISTS idx_user_identities_internal_user_id ON user_identities(internal_user_id);
CREATE INDEX IF NOT EXISTS idx_user_identities_telegram_id ON user_identities(telegram_id);
CREATE INDEX IF NOT EXISTS idx_user_identities_username ON user_identities(username);
CREATE INDEX IF NOT EXISTS idx_user_identities_last_authenticated_at ON user_identities(last_authenticated_at DESC);

-- Comment
COMMENT ON TABLE user_identities IS 'Unified user identity across authentication providers';