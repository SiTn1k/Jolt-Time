-- Migration: Create release_candidates, release_checklists, and release_snapshots tables
-- Task: P-197.2 - Release Candidate Validation

-- Release Candidates Table
CREATE TABLE IF NOT EXISTS release_candidates (
    releaseId TEXT PRIMARY KEY,
    version TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    stage TEXT NOT NULL DEFAULT 'release_candidate',
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approvedAt TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}',
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for release_candidates
CREATE INDEX IF NOT EXISTS idx_release_candidates_status ON release_candidates(status);
CREATE INDEX IF NOT EXISTS idx_release_candidates_stage ON release_candidates(stage);
CREATE INDEX IF NOT EXISTS idx_release_candidates_version ON release_candidates(version);
CREATE INDEX IF NOT EXISTS idx_release_candidates_createdAt ON release_candidates(createdAt DESC);

-- Release Checklists Table
CREATE TABLE IF NOT EXISTS release_checklists (
    checklistId TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    owner TEXT NOT NULL DEFAULT '',
    completedAt TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}',
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for release_checklists
CREATE INDEX IF NOT EXISTS idx_release_checklists_status ON release_checklists(status);
CREATE INDEX IF NOT EXISTS idx_release_checklists_owner ON release_checklists(owner);
CREATE INDEX IF NOT EXISTS idx_release_checklists_createdAt ON release_checklists(createdAt DESC);

-- Release Snapshots Table
CREATE TABLE IF NOT EXISTS release_snapshots (
    snapshotId TEXT PRIMARY KEY,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    backendVersion TEXT NOT NULL,
    databaseVersion TEXT NOT NULL,
    gitCommit TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'
);

-- Indexes for release_snapshots
CREATE INDEX IF NOT EXISTS idx_release_snapshots_gitCommit ON release_snapshots(gitCommit);
CREATE INDEX IF NOT EXISTS idx_release_snapshots_backendVersion ON release_snapshots(backendVersion);
CREATE INDEX IF NOT EXISTS idx_release_snapshots_createdAt ON release_snapshots(createdAt DESC);

-- Comments
COMMENT ON TABLE release_candidates IS 'Release candidates for managing releases';
COMMENT ON TABLE release_checklists IS 'Release checklist items for validation';
COMMENT ON TABLE release_snapshots IS 'Release snapshots for point-in-time system state';
