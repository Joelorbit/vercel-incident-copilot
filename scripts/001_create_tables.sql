-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID NOT NULL REFERENCES logs(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  root_cause TEXT NOT NULL,
  suggested_fix TEXT NOT NULL,
  runtime TEXT NOT NULL,
  confidence TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS incidents_log_id_idx ON incidents(log_id);

-- Enable RLS with public access policies (no auth required per PRD)
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Allow public access to logs
CREATE POLICY "Allow public read on logs" ON logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on logs" ON logs FOR INSERT WITH CHECK (true);

-- Allow public access to incidents
CREATE POLICY "Allow public read on incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Allow public insert on incidents" ON incidents FOR INSERT WITH CHECK (true);
