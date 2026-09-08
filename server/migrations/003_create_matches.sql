-- Create matches table
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  puzzle_id INTEGER REFERENCES puzzles(id),
  puzzle_snapshot JSONB NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'normal', 'hard', 'expert')),
  player1_id INTEGER REFERENCES users(id),
  player2_id INTEGER REFERENCES users(id),
  winner_id INTEGER REFERENCES users(id),
  result VARCHAR(20) CHECK (result IN ('player1_win', 'player2_win', 'draw', 'abandoned')),
  player1_guesses JSONB DEFAULT '[]',
  player2_guesses JSONB DEFAULT '[]',
  player1_time_ms INTEGER,
  player2_time_ms INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for matches
CREATE INDEX idx_matches_player1 ON matches(player1_id);
CREATE INDEX idx_matches_player2 ON matches(player2_id);
CREATE INDEX idx_matches_winner ON matches(winner_id);
CREATE INDEX idx_matches_difficulty ON matches(difficulty);
CREATE INDEX idx_matches_completed ON matches(completed_at);
CREATE INDEX idx_matches_puzzle ON matches(puzzle_id);
