# Database Migrations Strategy

**Document Version:** 1.0  
**Last Updated:** 2026-06-25  
**Project:** Jolt Time  
**Platform:** Telegram Mini App + Telegram Bot  
**Backend:** Supabase PostgreSQL  

---

## Table of Contents

1. [Migration Categories](#1-migration-categories)
2. [Migration Philosophy](#2-migration-philosophy)
3. [Environment Strategy](#3-environment-strategy)
4. [Migration Lifecycle](#4-migration-lifecycle)
5. [Schema Migration Standards](#5-schema-migration-standards)
6. [Data Migration Standards](#6-data-migration-standards)
7. [Index Migration Standards](#7-index-migration-standards)
8. [Security Migration Standards](#8-security-migration-standards)
9. [Rollback Philosophy](#9-rollback-philosophy)
10. [Versioning Standards](#10-versioning-standards)
11. [Testing Standards](#11-testing-standards)
12. [Supabase Integration Notes](#12-supabase-integration-notes)
13. [AdsGram Data Notes](#13-adsgram-data-notes)
14. [Monitoring Philosophy](#14-monitoring-philosophy)
15. [Future Expansion Notes](#15-future-expansion-notes)
16. [Long-Term Philosophy](#16-long-term-philosophy)

---

## 1. Migration Categories

The Jolt Time database migration system supports five primary categories, each addressing specific aspects of database evolution.

### 1.1 Schema Migrations

Schema migrations handle structural changes to the database definition. These include table creation, column modifications, relationship updates, and constraint definitions. Schema migrations are the foundation of database evolution and must be planned carefully to maintain data integrity.

**Typical Operations:**
- CREATE TABLE statements for new entities
- ALTER TABLE for adding/removing columns
- CREATE/DROP indexes for performance tuning
- Foreign key constraints for relationship enforcement
- CHECK constraints for data validation

**File Location:** `src/database/migrations/`  
**Naming Pattern:** `{number}_{brief_description}.sql`

### 1.2 Data Migrations

Data migrations handle the movement, transformation, and correction of data within existing structures. These migrations are essential when schema changes require corresponding data updates, normalization efforts need to be applied, or historical data requires backfilling for new features.

**Typical Operations:**
- UPDATE statements with transformation logic
- INSERT INTO ... SELECT for data migration
- DELETE with complex WHERE clauses for data cleanup
- Batch processing for large dataset operations

**Safety Requirements:**
- Must support re-execution without data corruption
- Require validation checkpoints for large operations
- Must be compatible with ongoing production traffic

### 1.3 Index Migrations

Index migrations manage the creation, modification, and removal of database indexes. Indexes are critical for query performance but must be handled carefully to avoid locking issues and storage bloat.

**Typical Operations:**
- CREATE INDEX for new query patterns
- DROP INDEX for unused or duplicate indexes
- CONCURRENTLY flag for production-safe index operations
- Partial indexes for filtered data access

**Performance Considerations:**
- Index creation should use CONCURRENTLY in production
- Large index builds should be scheduled during low-traffic periods
- Index usage should be monitored post-deployment

### 1.4 Security Migrations

Security migrations manage Row Level Security (RLS) policies, permissions, role definitions, and access control updates. These migrations protect data access and ensure compliance with security requirements.

**Typical Operations:**
- CREATE POLICY / ALTER POLICY for RLS
- GRANT / REVOKE for permissions
- CREATE ROLE / ALTER ROLE for user management
- Security policy validations and audits

**Compliance Requirements:**
- All security changes require review before deployment
- RLS policies must be tested against all user roles
- Security migrations should be version-controlled separately

### 1.5 Performance Migrations

Performance migrations address query optimization, table partitioning, material views, and other performance-related changes. These migrations ensure the database scales with user growth.

**Typical Operations:**
- Table partitioning for large datasets
- Materialized views for complex aggregations
- Query rewrites for optimization
- Connection pooling configurations

---

## 2. Migration Philosophy

The Jolt Time migration system is built on four core principles that ensure safe, traceable, and maintainable database evolution.

### 2.1 Repeatable Migrations

All migrations must be designed for safe re-execution. A migration run twice should produce the same result as running it once.

**Implementation Requirements:**
- Use `IF NOT EXISTS` for creating objects
- Use `IF EXISTS` for dropping objects
- Prefer `UPSERT` patterns over `INSERT` for data migrations
- Include idempotent checks before destructive operations

**Example Pattern:**
```sql
-- Safe column addition
ALTER TABLE users ADD COLUMN IF NOT EXISTS new_field TEXT;

-- Safe index creation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_new_field ON users(new_field);
```

### 2.2 Traceable Migrations

Every migration must be traceable from creation through deployment to production execution.

**Traceability Requirements:**
- Sequential numbering for clear ordering
- Descriptive names explaining purpose
- Author documentation in migration header
- Linked tickets or documentation references

**Documentation Standard:**
```sql
-- Migration: 018_create_player_stats.sql
-- Purpose: Add player statistics tracking for analytics
-- Author: Dev Team
-- Ticket: JOLT-123
-- Date: 2026-06-25
```

### 2.3 Reversible Migrations

Where possible, migrations should be reversible, allowing rollback to a previous state without data loss.

**Reversibility Requirements:**
- Forward and backward migration pairs for significant changes
- Data migrations must have corresponding rollback data
- Constraint changes must preserve existing data
- Index removals must not break existing queries

**Reversibility Limitations:**
- Certain operations are inherently irreversible (DROP, DELETE)
- Large data migrations may not have practical rollback
- Schema changes that alter data type semantics

### 2.4 Production-Safe Migrations

Production deployments must minimize downtime, avoid locking issues, and preserve data integrity.

**Production Safety Requirements:**
- Use `CONCURRENTLY` for all index operations
- Batch large data operations to prevent long locks
- Schedule significant changes during low-traffic windows
- Have rollback plans ready before deployment

---

## 3. Environment Strategy

The migration workflow spans three environments, each with specific requirements and approval gates.

### 3.1 Local Development Environment

The local environment is where all migrations are developed and initially tested. Developers work independently without affecting shared systems.

**Workflow:**
1. Create migration file with appropriate category prefix
2. Run migration against local Supabase instance
3. Validate changes with local test suite
4. Submit pull request with migration files

**Local Tools:**
- Supabase CLI for local database management
- Migration files in `src/database/migrations/`
- Local validation scripts

**Protection Measures:**
- Local database can be reset freely
- No production data exposure risk
- Independent development per feature

### 3.2 Staging Environment

The staging environment mirrors production configuration and serves as the final validation step before production deployment.

**Workflow:**
1. Apply migrations to staging database automatically on PR merge
2. Run integration tests against migrated schema
3. Execute performance validation queries
4. Manual approval gate before production promotion

**Staging Tools:**
- Staging Supabase project
- Automated test suite
- Performance monitoring dashboards

**Validation Requirements:**
- All unit tests pass
- Integration tests pass with new schema
- No performance degradation observed
- RLS policies validated for all roles

### 3.3 Production Environment

Production is the live environment serving real users. Migrations must be executed with extreme caution.

**Workflow:**
1. Schedule migration during low-traffic window
2. Pre-migration backup verification
3. Execute migration with monitoring active
4. Post-migration validation
5. Rollback readiness maintained for required duration

**Production Safety:**
- DDL locks must not block reads or writes
- Large operations must be batched
- Immediate rollback capability required
- Health checks after each major step

---

## 4. Migration Lifecycle

Each migration passes through five distinct stages from initial planning through production verification.

### 4.1 Planning Stage

Migration planning establishes the need, scope, and approach for database changes.

**Planning Activities:**
- Define the problem or enhancement requiring schema change
- Document the proposed solution with alternatives considered
- Assess impact on existing data and queries
- Estimate development and testing effort
- Identify rollback strategy and contingencies

**Planning Outputs:**
- Migration specification document
- Impact analysis report
- Rollback procedure document
- Timeline estimate

**Review Requirements:**
- Technical lead approval for architecture changes
- Product owner awareness for data model changes
- Security review for access control changes

### 4.2 Development Stage

Migration development creates the migration files and supporting code.

**Development Activities:**
- Write migration SQL with proper numbering
- Create corresponding rollback migration if reversible
- Update TypeScript types for new schema
- Add database seed updates for new entities
- Write unit tests for migration logic

**Code Standards:**
- Follow naming conventions strictly
- Include comprehensive comments
- Use transaction wrappers appropriately
- Apply security best practices

### 4.3 Testing Stage

Testing validates that migrations work correctly across all scenarios.

**Testing Activities:**
- Execute migrations against local database
- Run test suite with new schema
- Verify data integrity after migration
- Test rollback procedures
- Validate performance impact

**Test Categories:**
- Local unit tests
- Integration tests
- Load tests for large migrations
- Security validation tests

### 4.4 Deployment Stage

Deployment executes migrations in target environments with appropriate safeguards.

**Deployment Activities:**
- Merge to main branch triggers staging deployment
- Manual promotion to production after staging validation
- Execute migrations in correct order
- Monitor for errors during execution
- Verify application compatibility

**Deployment Gates:**
- All tests passing
- Staging validation complete
- Rollback plan confirmed
- Team notified of deployment

### 4.5 Verification Stage

Verification confirms that migrations achieved their intended purpose.

**Verification Activities:**
- Validate schema matches expectations
- Confirm data integrity preserved
- Verify application functionality
- Check performance metrics
- Monitor error rates post-deployment

**Verification Outputs:**
- Migration completion report
- Post-deployment health check
- Performance comparison data
- Rollback readiness confirmation

---

## 5. Schema Migration Standards

Schema migrations define the structure of the database and must be handled with care to preserve existing data.

### 5.1 Table Creation

New tables require careful planning to ensure proper relationships, constraints, and performance characteristics.

**Standards for Table Creation:**
- Always include primary key column
- Define appropriate data types for columns
- Add NOT NULL constraints where data is required
- Include created_at and updated_at timestamps
- Document table purpose in header comment

**Required Elements:**
```sql
-- Table: player_stats
-- Purpose: Track player statistics for analytics and leaderboards
-- Author: Dev Team
-- Date: 2026-06-25

CREATE TABLE player_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    stat_type TEXT NOT NULL,
    stat_value INTEGER NOT NULL DEFAULT 0,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(player_id, stat_type, period_start)
);

CREATE INDEX idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX idx_player_stats_period ON player_stats(period_start, period_end);
```

### 5.2 Table Updates

Modifying existing tables requires careful consideration of existing data and application compatibility.

**Standards for Table Updates:**
- Use ADD COLUMN with IF NOT EXISTS for additions
- Use DROP COLUMN with IF EXISTS for removals
- Use ALTER COLUMN for type changes with data conversion
- Always backup data before destructive changes
- Prefer non-breaking changes when possible

**Backward Compatibility:**
- Add nullable columns before making them required
- Add new columns at the end of existing columns
- Avoid renaming columns; add new and deprecate old
- Maintain old data formats during transitions

**Example Pattern:**
```sql
-- Safe column addition
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ;

-- Safe column rename (multi-step)
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
-- Step 2: Copy data (in data migration)
UPDATE users SET display_name = username WHERE display_name IS NULL;
-- Step 3: Deprecate old column (separate migration later)
COMMENT ON COLUMN users.username IS 'Deprecated: use display_name instead';
```

### 5.3 Relationship Changes

Foreign key relationships define how tables connect and must be modified carefully to maintain referential integrity.

**Standards for Relationship Changes:**
- Add foreign keys with validation disabled initially
- Backfill existing violating data before enabling constraints
- Use ON DELETE and ON UPDATE actions appropriately
- Consider performance impact of enforced constraints

**Relationship Patterns:**
```sql
-- Adding a foreign key safely
ALTER TABLE player_stats ADD COLUMN IF NOT EXISTS stat_category_id UUID;

-- Backfill any missing references
UPDATE player_stats SET stat_category_id = 'default-category-id' 
WHERE stat_category_id IS NULL;

-- Add constraint after data is clean
ALTER TABLE player_stats 
ADD CONSTRAINT fk_player_stats_category 
FOREIGN KEY (stat_category_id) REFERENCES stat_categories(id);
```

### 5.4 Constraint Changes

Constraints enforce data integrity and must be modified carefully to avoid locking issues.

**Standards for Constraint Changes:**
- Add constraints as NOT VALID initially
- Validate existing data separately
- Mark constraints as valid after backfill
- Use shorter transactions for constraint validation

**Lock Prevention:**
```sql
-- Add check constraint without locking
ALTER TABLE users ADD CONSTRAINT chk_users_energy_positive 
CHECK (energy >= 0) NOT VALID;

-- Validate in separate statement
ALTER TABLE users VALIDATE CONSTRAINT chk_users_energy_positive;
```

---

## 6. Data Migration Standards

Data migrations transform, normalize, or correct data within the database. These are often the most risky migrations as they modify existing data.

### 6.1 Data Transformation

Data transformation converts data from one format or structure to another.

**Standards for Data Transformation:**
- Write transformations to be idempotent
- Process in batches to prevent long locks
- Include checkpoint commits for large operations
- Validate data before and after transformation

**Batch Processing Pattern:**
```sql
-- Migration: Transform player preferences to new format
-- Purpose: Convert JSON preferences to normalized columns
-- Author: Dev Team
-- Date: 2026-06-25

DO $$
DECLARE
    batch_size INTEGER := 1000;
    offset_val INTEGER := 0;
    rows_updated INTEGER := 0;
BEGIN
    LOOP
        UPDATE users
        SET 
            notification_enabled = (preferences->>'notifications')::BOOLEAN,
            updated_at = NOW()
        WHERE id IN (
            SELECT id FROM users
            WHERE preferences IS NOT NULL
            OFFSET offset_val
            LIMIT batch_size
        );
        
        rows_updated := rows_updated + SQL%ROWCOUNT;
        
        EXIT WHEN SQL%ROWCOUNT = 0;
        offset_val := offset_val + batch_size;
        
        -- Checkpoint for large operations
        IF offset_val % 10000 = 0 THEN
            RAISE NOTICE 'Processed % rows', offset_val;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Total rows updated: %', rows_updated;
END $$;
```

### 6.2 Data Normalization

Data normalization restructures data to eliminate redundancy and improve integrity.

**Standards for Normalization:**
- Create new normalized tables first
- Backfill data from denormalized source
- Verify backfill accuracy
- Remove denormalized columns in separate migration

**Normalization Workflow:**
1. Add new normalized columns/tables
2. Create triggers or update logic for ongoing sync
3. Backfill historical data
4. Validate backfill accuracy
5. Remove denormalized storage (deferred)

### 6.3 Data Correction

Data correction fixes incorrect, corrupted, or inconsistent data.

**Standards for Data Correction:**
- Document the issue being corrected
- Provide evidence of the problem
- Ensure correction is safe and reversible where possible
- Validate correction achieved intended result

**Correction Safety:**
```sql
-- Migration: Correct negative energy values
-- Purpose: Fix corrupted energy data from bug in v1.2.3
-- Author: Dev Team
-- Ticket: JOLT-456
-- Date: 2026-06-25

-- Preview of affected rows (for verification)
SELECT COUNT(*) FROM users WHERE energy < 0;

-- Correction
UPDATE users SET energy = 0 WHERE energy < 0;

-- Verification
SELECT COUNT(*) FROM users WHERE energy < 0; -- Should return 0
```

### 6.4 Data Backfills

Backfills populate new columns or tables with data derived from existing sources.

**Standards for Backfills:**
- Process in configurable batch sizes
- Include progress logging
- Make backfills resumable if interrupted
- Validate backfill completeness

**Resumable Backfill Pattern:**
```sql
-- Migration: Backfill user engagement scores
-- Purpose: Calculate historical engagement for new leaderboard feature
-- Author: Dev Team
-- Date: 2026-06-25

DO $$
DECLARE
    batch_size INTEGER := 5000;
    offset_val INTEGER := 0;
    last_processed_id UUID;
    max_id UUID;
BEGIN
    -- Get the maximum ID to process
    SELECT MAX(id) INTO max_id FROM users;
    
    -- Get last checkpoint if exists
    SELECT value INTO last_processed_id 
    FROM migration_checkpoints 
    WHERE migration_name = 'backfill_engagement_scores';
    
    IF last_processed_id IS NOT NULL THEN
        offset_val := 1; -- Start from next
    END IF;
    
    LOOP
        UPDATE user_engagement ue
        SET engagement_score = (
            SELECT COALESCE(SUM(action_weight), 0)
            FROM user_actions ua
            WHERE ua.user_id = ue.user_id
        )
        FROM users u
        WHERE u.id = ue.user_id
        AND u.id > COALESCE(last_processed_id, '00000000-0000-0000-0000-000000000000'::UUID)
        ORDER BY u.id
        LIMIT batch_size;
        
        -- Get last processed ID
        SELECT MAX(user_id) INTO last_processed_id 
        FROM user_engagement 
        WHERE user_id > COALESCE(last_processed_id, '00000000-0000-0000-0000-000000000000'::UUID)
        LIMIT 1;
        
        -- Save checkpoint
        INSERT INTO migration_checkpoints (migration_name, value, updated_at)
        VALUES ('backfill_engagement_scores', last_processed_id, NOW())
        ON CONFLICT (migration_name) DO UPDATE SET value = EXCLUDED.value;
        
        EXIT WHEN last_processed_id >= max_id;
    END LOOP;
END $$;
```

---

## 7. Index Migration Standards

Indexes are critical for query performance but must be managed carefully to avoid locking and storage issues.

### 7.1 Index Creation

New indexes improve query performance but require careful deployment.

**Standards for Index Creation:**
- Always use `CONCURRENTLY` in production
- Name indexes consistently with pattern `idx_{table}_{columns}`
- Consider partial indexes for filtered data
- Test index impact before production deployment

**Naming Convention:**
```sql
-- Single column index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);

-- Multi-column index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_player_stats_type_period 
ON player_stats(stat_type, period_start, period_end);

-- Partial index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_players_premium 
ON players(telegram_id) WHERE is_premium = TRUE;
```

### 7.2 Index Updates

Index updates include rebuilding, renaming, or changing index parameters.

**Standards for Index Updates:**
- Use REINDEX CONCURRENTLY for rebuilds
- Rename by dropping and recreating
- Monitor index size before and after
- Validate query performance improvement

**Index Rebuild Pattern:**
```sql
-- Rebuild index without locking
REINDEX INDEX CONCURRENTLY idx_users_email;
```

### 7.3 Index Removal

Removing unused indexes frees storage and improves write performance.

**Standards for Index Removal:**
- Confirm index is unused before removal
- Test query performance without index
- Remove in stages if concerned about impact
- Keep index definition for potential reinstatement

**Safe Removal Pattern:**
```sql
-- Verify index is not used in any query plan
-- SELECT * FROM pg_stat_user_indexes WHERE indexname = 'idx_users_deprecated';

-- Remove index safely
DROP INDEX IF EXISTS idx_users_deprecated;
```

---

## 8. Security Migration Standards

Security migrations control access to data through RLS policies, permissions, and role definitions.

### 8.1 Row Level Security (RLS) Policies

RLS policies filter data based on user attributes, ensuring users only see their own data.

**Standards for RLS Policies:**
- Create policies with descriptive names
- Use SECURITY DEFINER for service functions
- Test policies with all user roles
- Document policy intent in comments

**Policy Template:**
```sql
-- Policy: Allow users to read their own profile
-- Purpose: Enable users to access their profile data
-- Author: Dev Team
-- Date: 2026-06-25

CREATE POLICY pol_users_select_own ON users
    FOR SELECT
    USING (auth.uid() = id);
```

### 8.2 Permissions Management

Permissions control what actions users and roles can perform on database objects.

**Standards for Permissions:**
- Grant minimum required permissions
- Use role hierarchy for permission groups
- Document permission changes
- Test after permission changes

**Permission Patterns:**
```sql
-- Grant read access to analytics role
GRANT SELECT ON player_stats TO analytics_role;

-- Grant execute on specific functions
GRANT EXECUTE ON FUNCTION get_leaderboard TO service_role;
```

### 8.3 Role Updates

Roles manage groups of permissions and user assignments.

**Standards for Role Updates:**
- Create roles with clear purpose
- Use role inheritance appropriately
- Document role membership requirements
- Audit role assignments regularly

### 8.4 Security Improvements

Security improvements address vulnerabilities or enhance protection.

**Security Migration Requirements:**
- Security team review required
- Document security rationale
- Test access control thoroughly
- Monitor after deployment

---

## 9. Rollback Philosophy

Rollback procedures are essential for recovering from failed migrations. However, not all migrations can be safely rolled back.

### 9.1 Rollback Planning

Every migration that modifies data or schema must have a documented rollback plan.

**Rollback Plan Requirements:**
- Document rollback steps before deployment
- Include data recovery procedures
- Specify rollback timing limitations
- Identify what cannot be rolled back

**Rollback Plan Template:**
```
## Rollback Plan for Migration 018

### Reversible Operations
- Drop new columns: `ALTER TABLE users DROP COLUMN new_field;`
- Remove new indexes: `DROP INDEX idx_users_new_field;`

### Data Recovery
- Data backed up to migration_018_backup table before update
- Restore with: `INSERT INTO users SELECT * FROM migration_018_backup;`

### Non-Reversible Operations
- Data transformation (keeps transformed data)
- Data deletion (requires backup restore)

### Rollback Time Limit
- Must rollback within 24 hours before dependent code deploys
```

### 9.2 Rollback Limitations

Certain operations cannot be safely rolled back and require alternative recovery strategies.

**Inherently Non-Reversible Operations:**
- DROP TABLE (data loss is permanent)
- DELETE without backup (data loss is permanent)
- TRUNCATE (data loss is permanent)
- Data type conversions that truncate data

**Alternative Recovery Strategies:**
- Restore from database backup
- Re-run migration with corrected logic
- Data reconstruction from application logs

### 9.3 Emergency Recovery Procedures

Critical failures require immediate response following documented procedures.

**Emergency Response Steps:**
1. Assess scope of failure
2. Determine if rollback is possible and safer than forward
3. Execute rollback if applicable
4. Notify team of issue and status
5. Document incident and resolution
6. Plan corrective migration

**Emergency Contacts:**
- Database admin on-call
- Backend lead
- Product owner for production issues

---

## 10. Versioning Standards

Consistent versioning enables tracking, ordering, and auditing of all database changes.

### 10.1 Migration Numbering

Migrations use sequential numbering to ensure correct execution order.

**Numbering Rules:**
- Use zero-padded three-digit format (001, 002, ... 999)
- Numbers are assigned sequentially
- No skipping or reusing numbers
- Category prefixes are optional

**File Naming Pattern:**
```
{number}_{category}_{brief_description}.sql
```

**Examples:**
- `001_schema_create_players.sql`
- `002_data_migrate_timestamps.sql`
- `003_index_add_player_lookup.sql`
- `004_security_add_rls_policies.sql`

### 10.2 Migration Tracking

All migrations must be tracked in the migration history table.

**Tracking Table Schema:**
```sql
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT,
    rollback_sql TEXT,
    status VARCHAR(50) DEFAULT 'applied'
);
```

**Tracking Implementation:**
```sql
-- After successful migration
INSERT INTO schema_migrations (version, description, rollback_sql)
VALUES ('018', 'Add player engagement scores', 
        'DROP INDEX idx_player_engagement; DROP TABLE player_engagement;');
```

### 10.3 Migration History

Migration history provides an audit trail of all database changes.

**History Retention:**
- Keep all migration records indefinitely
- Archive old migration files but retain references
- Maintain backup of migration history table

---

## 11. Testing Standards

Comprehensive testing ensures migrations work correctly and don't break existing functionality.

### 11.1 Local Validation

Local testing validates migrations against a local database instance.

**Local Test Requirements:**
- Run migration from clean state
- Verify schema changes applied correctly
- Confirm data integrity maintained
- Test rollback procedures

**Validation Queries:**
```sql
-- Verify table creation
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'player_stats';

-- Verify column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'player_stats' AND column_name = 'engagement_score';

-- Verify index exists
SELECT indexname FROM pg_indexes 
WHERE tablename = 'player_stats' AND indexname = 'idx_player_stats_player_id';
```

### 11.2 Staging Validation

Staging validation confirms migrations work in a production-like environment.

**Staging Test Requirements:**
- Apply migrations to staging database
- Run full integration test suite
- Validate query performance
- Test with production-equivalent data volume

**Performance Validation:**
```sql
-- Check query plans for affected queries
EXPLAIN ANALYZE SELECT * FROM player_stats 
WHERE player_id = 'test-id' ORDER BY period_start DESC;
```

### 11.3 Production Readiness Checks

Pre-production checks ensure migrations are safe to deploy.

**Production Readiness Checklist:**
- [ ] Migration tested locally
- [ ] Migration tested in staging
- [ ] Rollback plan documented
- [ ] Backup verified
- [ ] Monitoring configured
- [ ] Team notified of deployment window
- [ ] On-call support arranged

---

## 12. Supabase Integration Notes

Supabase provides specific features and workflows that influence migration strategy.

### 12.1 Migrations Workflow

Supabase migrations follow the Supabase CLI workflow for consistency.

**Supabase CLI Commands:**
```bash
# Apply migrations
supabase db push

# Reset local database
supabase db reset

# Generate migration from diff
supabase migration new {migration_name}
```

**Workflow Integration:**
- Migration files stored in `src/database/migrations/`
- Supabase CLI configured for local development
- CI/CD pipeline applies migrations on merge

### 12.2 Database Synchronization

Keeping local, staging, and production databases synchronized requires careful process.

**Synchronization Strategy:**
- Local: Reset and re-apply migrations for fresh start
- Staging: Auto-sync on main branch merge
- Production: Manual promotion with validation gates

### 12.3 Deployment Consistency

Consistent deployment ensures all environments evolve together.

**Consistency Requirements:**
- Same migration files applied to all environments
- Environment-specific configuration via secrets
- Deterministic deployment order

---

## 13. AdsGram Data Notes

AdsGram is a primary revenue system for Jolt Time. Migrations affecting ad data must be handled with extra care.

### 13.1 Monetization Tables

Monetization tables track advertising revenue and ad serving data.

**Key Tables:**
- `ads_views` - Record of ad impressions
- `ads_statistics` - Aggregated ad performance
- `user_ad_settings` - User preferences for ads

**Migration Safety:**
- Never delete records from ads_views
- Backfill with care to preserve historical revenue data
- Coordinate with AdsGram before schema changes

### 13.2 Reward Tracking Tables

Reward tracking ensures users receive promised compensation for ad views.

**Key Tables:**
- `ad_rewards` - Individual reward records
- `user_rewards_balance` - Current reward balances
- `reward_history` - Historical reward transactions

**Data Integrity:**
- All reward changes must be transactional
- Audit trail must be complete and immutable
- Balance calculations must be verifiable

### 13.3 Analytics Structures

Analytics structures aggregate ad data for business intelligence.

**Design Considerations:**
- Separate hot and cold data storage
- Partition large analytics tables by time
- Index for common reporting queries

---

## 14. Monitoring Philosophy

Monitoring tracks migration success, failures, and execution history.

### 14.1 Migration Success Tracking

Successful migrations must be recorded and monitored.

**Success Metrics:**
- Migration completion time
- Database operation latency
- Post-migration query performance

### 14.2 Migration Failure Detection

Failures must be detected quickly and responded to appropriately.

**Failure Detection:**
- Alert on migration job failures
- Monitor for schema inconsistencies
- Track migration duration anomalies

### 14.3 Execution History

Complete execution history enables auditing and troubleshooting.

**History Data:**
- Who executed each migration
- When migration was applied
- How long migration took
- Any warnings or errors

---

## 15. Future Expansion Notes

As Jolt Time evolves, new migration categories may become relevant.

### 15.1 AI Data Migrations

Future AI features may require specialized data structures.

**Potential Requirements:**
- Training data storage
- Model versioning tables
- Inference logging

**Status:** Future concept only, not currently planned.

### 15.2 Web3 Migrations

Blockchain integration may require wallet and transaction tracking.

**Potential Requirements:**
- Wallet address storage
- Transaction verification tables
- Token balance tracking

**Status:** Future concept only, not currently planned.

### 15.3 NFT Migrations

NFT features may require digital asset tracking.

**Potential Requirements:**
- NFT metadata storage
- Ownership tracking
- Marketplace transaction logs

**Status:** Future concept only, not currently planned.

### 15.4 Creator Economy Migrations

Creator features may require content and payout tracking.

**Potential Requirements:**
- Creator profile tables
- Content metadata storage
- Revenue share calculations

**Status:** Future concept only, not currently planned.

### 15.5 Esports Migrations

Competitive features may require tournament and match tracking.

**Potential Requirements:**
- Tournament brackets
- Match results
- Ranking calculations

**Status:** Future concept only, not currently planned.

---

## 16. Long-Term Philosophy

The migration system serves Jolt Time's long-term growth and stability.

### 16.1 Data Integrity Protection

Every migration must preserve data integrity as a non-negotiable requirement.

**Integrity Principles:**
- Never lose data without explicit user action
- Validate data before and after migrations
- Maintain referential integrity at all times
- Backup before destructive operations

### 16.2 Scalability Support

Migrations must support growing data volumes and user counts.

**Scalability Considerations:**
- Batch processing for large operations
- Index strategy for query performance
- Table partitioning for time-series data
- Archival strategies for historical data

### 16.3 Simplified Deployments

The migration system must enable confident, low-risk deployments.

**Simplification Goals:**
- Single command deployment process
- Clear success/failure feedback
- Automated rollback on failure
- Minimal manual intervention required

### 16.4 Operational Risk Reduction

Migrations must minimize risk to production systems.

**Risk Reduction Strategies:**
- Extensive testing before production
- Incremental rollouts when possible
- Quick rollback capability
- Comprehensive monitoring

---

## Related Documentation

- **API Architecture:** `.openhands/knowledge/api-client-layer.md`
- **Database Schema:** `src/database/`
- **Supabase Configuration:** Supabase project settings
- **Security Standards:** `.openhands/knowledge/security.md`

---

*Document maintained by the Jolt Time Development Team*
