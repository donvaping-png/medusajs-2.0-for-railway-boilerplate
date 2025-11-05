-- Migration: Global Meta Fields System
-- Creates tables for meta field definitions and values

-- Table for meta field definitions (schema)
CREATE TABLE IF NOT EXISTS meta_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope TEXT NOT NULL,
    key TEXT NOT NULL,
    label TEXT,
    type TEXT NOT NULL CHECK (type IN ('text', 'richtext', 'number', 'boolean', 'date', 'select', 'json', 'image')),
    required BOOLEAN DEFAULT FALSE,
    options JSONB,
    default_value JSONB,
    validations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(scope, key)
);

-- Table for meta field values
CREATE TABLE IF NOT EXISTS meta_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope TEXT NOT NULL,
    scope_id TEXT NOT NULL,
    def_id UUID NOT NULL REFERENCES meta_definitions(id) ON DELETE CASCADE,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(scope, scope_id, def_id)
);

-- Index for efficient lookups by scope and scope_id
CREATE INDEX IF NOT EXISTS idx_meta_values_scope ON meta_values(scope, scope_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_meta_definitions_updated_at BEFORE UPDATE ON meta_definitions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meta_values_updated_at BEFORE UPDATE ON meta_values
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
