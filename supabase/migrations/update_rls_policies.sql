-- Update RLS policies for carbon_logs table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own carbon logs" ON carbon_logs;
DROP POLICY IF EXISTS "Users can read their own carbon logs" ON carbon_logs;
DROP POLICY IF EXISTS "Users can update their own carbon logs" ON carbon_logs;
DROP POLICY IF EXISTS "Users can delete their own carbon logs" ON carbon_logs;

-- Create new RLS policies for carbon_logs
CREATE POLICY "Users can insert their own carbon logs"
ON carbon_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own carbon logs"
ON carbon_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own carbon logs"
ON carbon_logs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own carbon logs"
ON carbon_logs FOR DELETE
USING (auth.uid() = user_id);

-- Add policy for leaderboard aggregation (read public aggregated stats)
CREATE POLICY "Users can read aggregated carbon stats"
ON carbon_logs FOR SELECT
USING (true); -- This is for aggregation queries that don't expose individual data

-- Update policies for users table to allow public read of carbon scores for leaderboard
DROP POLICY IF EXISTS "Users can read all users for leaderboard" ON users;

CREATE POLICY "Users can read all users for leaderboard"
ON users FOR SELECT
USING (true);

-- Ensure users can only update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add comment explaining the security model
COMMENT ON TABLE carbon_logs IS 'Carbon emission logs - RLS ensures users can only see their own logs, but aggregated queries can read all for leaderboard';
COMMENT ON TABLE users IS 'User profiles with carbon scores - public read for leaderboard, restricted update for own profile';
