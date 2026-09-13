CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Progress',
  risk TEXT NOT NULL DEFAULT 'Low',
  budget_cr NUMERIC(14,2) NOT NULL CHECK (budget_cr >= 0),
  released_cr NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (released_cr >= 0),
  physical_progress NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (physical_progress BETWEEN 0 AND 100),
  target_progress NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (target_progress BETWEEN 0 AND 100),
  schedule_lag_days INTEGER NOT NULL DEFAULT 0,
  estimated_completion DATE,
  revised_completion DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  planned_progress NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (planned_progress BETWEEN 0 AND 100),
  actual_progress NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (actual_progress BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'Not Started',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_signals (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS progress_updates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  physical_progress NUMERIC(5,2) NOT NULL CHECK (physical_progress BETWEEN 0 AND 100),
  released_cr NUMERIC(14,2) NOT NULL CHECK (released_cr >= 0),
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assistant_conversations (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_risk_idx ON projects(risk);
CREATE INDEX IF NOT EXISTS milestones_project_idx ON milestones(project_id);
CREATE INDEX IF NOT EXISTS alerts_project_status_idx ON alerts(project_id, status);
CREATE INDEX IF NOT EXISTS audit_signals_project_idx ON audit_signals(project_id);
