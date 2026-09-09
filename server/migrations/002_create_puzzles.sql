-- Create puzzles table
CREATE TABLE puzzles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  categories JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create GIN index for JSONB categories column
CREATE INDEX idx_puzzles_categories ON puzzles USING GIN(categories);

-- Create trigger for puzzles table
CREATE TRIGGER update_puzzles_updated_at BEFORE UPDATE ON puzzles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
