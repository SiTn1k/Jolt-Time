-- Migration: Create bot_users table
-- Description: Stores Telegram bot user data separate from game users
-- This table tracks bot-specific user data for Telegram interactions

CREATE TABLE IF NOT EXISTS bot_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Telegram identification
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    
    -- Language preference
    language_code VARCHAR(10) DEFAULT 'en',
    
    -- Chat tracking
    chat_id BIGINT NOT NULL,
    
    -- Bot-specific flags
    is_bot_started BOOLEAN DEFAULT false,
    is_blocked BOOLEAN DEFAULT false,
    
    -- Game account linking
    -- If NULL, user hasn't linked their game account yet
    linked_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_bot_users_telegram_id ON bot_users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_bot_users_chat_id ON bot_users(chat_id);
CREATE INDEX IF NOT EXISTS idx_bot_users_linked_user_id ON bot_users(linked_user_id);
CREATE INDEX IF NOT EXISTS idx_bot_users_language_code ON bot_users(language_code);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bot_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS bot_users_updated_at ON bot_users;
CREATE TRIGGER bot_users_updated_at
    BEFORE UPDATE ON bot_users
    FOR EACH ROW
    EXECUTE FUNCTION update_bot_users_updated_at();
