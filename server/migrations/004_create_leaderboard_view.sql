-- Create materialized view for leaderboard
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id AS user_id,
  u.username,
  u.avatar,
  m.difficulty,
  COUNT(CASE WHEN m.winner_id = u.id THEN 1 END) AS wins,
  COUNT(*) AS games_played,
  MIN(CASE 
    WHEN m.winner_id = u.id AND m.player1_id = u.id THEN m.player1_time_ms
    WHEN m.winner_id = u.id AND m.player2_id = u.id THEN m.player2_time_ms
  END) AS best_time_ms
FROM users u
LEFT JOIN matches m ON (u.id = m.player1_id OR u.id = m.player2_id)
WHERE m.completed_at IS NOT NULL
GROUP BY u.id, u.username, u.avatar, m.difficulty;

-- Create indexes on materialized view
CREATE UNIQUE INDEX idx_leaderboard_user_difficulty ON leaderboard(user_id, difficulty);
CREATE INDEX idx_leaderboard_wins ON leaderboard(difficulty, wins DESC, best_time_ms ASC);
CREATE INDEX idx_leaderboard_difficulty ON leaderboard(difficulty);

-- Create function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
END;
$$ LANGUAGE plpgsql;
