-- Migration: Add Telegram fields to users table
-- Description: Adds required Telegram identification and notification tracking fields to the users table

-- Add telegram_id column if not exists (telegram user ID)
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE;

-- Add username column (telegram username)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- Add chat_id column (telegram chat ID for sending messages)
ALTER TABLE users ADD COLUMN IF NOT EXISTS chat_id BIGINT;

-- Add notifications_enabled flag (global notification toggle)
ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true;

-- Add last_notification_at timestamp (tracks when last notification was sent)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_notification_at TIMESTAMP WITH TIME ZONE;

-- Add last_active_at timestamp (tracks user last activity for inactive reminders)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for efficient user lookup by telegram_id
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Create index for efficient user lookup by chat_id
CREATE INDEX IF NOT EXISTS idx_users_chat_id ON users(chat_id);

-- Create index for finding inactive users
CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON users(last_active_at);
