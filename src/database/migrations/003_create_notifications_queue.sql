-- Migration: Create notifications_queue table
-- Description: Queue for managing notification delivery with status tracking

CREATE TABLE IF NOT EXISTS notifications_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification type (references notification category)
    type VARCHAR(50) NOT NULL,
    
    -- Notification content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Status tracking: pending, sent, failed
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    
    -- Scheduling and delivery timestamps
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Error tracking for failed notifications
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Deduplication: unique identifier to prevent duplicate notifications
    -- This is a hash of notification type + user_id + key parameters
    -- Example: "expedition_finished_123_456" for expedition 456
    deduplication_key VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Index for processing pending notifications efficiently
CREATE INDEX IF NOT EXISTS idx_notifications_queue_status ON notifications_queue(status);

-- Index for fetching user's notifications
CREATE INDEX IF NOT EXISTS idx_notifications_queue_user_id ON notifications_queue(user_id);

-- Index for scheduled notifications ordering
CREATE INDEX IF NOT EXISTS idx_notifications_queue_scheduled_at ON notifications_queue(scheduled_at);

-- Index for deduplication check (prevents duplicate notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_queue_deduplication_key ON notifications_queue(deduplication_key) WHERE deduplication_key IS NOT NULL;

-- Composite index for processing: get pending notifications scheduled for now or earlier
CREATE INDEX IF NOT EXISTS idx_notifications_queue_process ON notifications_queue(status, scheduled_at) WHERE status = 'pending';
