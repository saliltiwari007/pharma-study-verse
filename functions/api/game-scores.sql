CREATE TABLE IF NOT EXISTS game_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL CHECK(score >= 0 AND score <= 1000),
  mode TEXT NOT NULL CHECK(mode IN ('beginner','medium','expert')),
  correct INTEGER NOT NULL DEFAULT 0 CHECK(correct >= 0 AND correct <= 200),
  wrong INTEGER NOT NULL DEFAULT 0 CHECK(wrong >= 0 AND wrong <= 200),
  completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_game_scores_completed_score ON game_scores(completed, score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_name_score ON game_scores(name, score DESC);
