-- Migration: ensure avatars has education_level and education_field columns
-- Run this against your development database with:
-- psql "$DATABASE_URL" -f database/ensure_avatars_columns.sql

ALTER TABLE avatars
    ADD COLUMN IF NOT EXISTS education_level VARCHAR(100);

ALTER TABLE avatars
    ADD COLUMN IF NOT EXISTS education_field VARCHAR(100);

-- Optionally set defaults for existing rows (uncomment to run)
-- UPDATE avatars SET education_level = 'none' WHERE education_level IS NULL;
-- UPDATE avatars SET education_field = 'none' WHERE education_field IS NULL;

-- Ensure `debt` exists (some older DBs may be missing this column)
ALTER TABLE avatars
    ADD COLUMN IF NOT EXISTS debt INT DEFAULT 0;
