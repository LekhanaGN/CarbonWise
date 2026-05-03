-- Add source and activity_type columns to carbon_logs table
ALTER TABLE carbon_logs
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'extension')),
ADD COLUMN IF NOT EXISTS activity_type TEXT,
ADD COLUMN IF NOT EXISTS carbon_value DOUBLE PRECISION;

-- Create index on user_id for efficient queries
CREATE INDEX IF NOT EXISTS idx_carbon_logs_user_id ON carbon_logs(user_id);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS idx_carbon_logs_source ON carbon_logs(source);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_carbon_logs_created_at ON carbon_logs(created_at DESC);

-- Add comment to explain columns
COMMENT ON COLUMN carbon_logs.source IS 'Source of the carbon log - manual for user entries, extension for auto-tracked';
COMMENT ON COLUMN carbon_logs.activity_type IS 'Type of activity - food, transport, shopping, flights, streaming, etc.';
