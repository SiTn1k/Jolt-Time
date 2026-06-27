-- Migration: Create security_events table for security event logging
-- Task: #164 - Production Authentication System Implementation

CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    internal_user_id TEXT,
    telegram_id BIGINT,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    severity TEXT NOT NULL DEFAULT 'info',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for security event queries
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_internal_user_id ON security_events(internal_user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_telegram_id ON security_events(telegram_id);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);

-- Comment
COMMENT ON TABLE security_events IS 'Security-related events for auditing and monitoring';