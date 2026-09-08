# Database Schema Documentation

## Tables

### users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Display name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| avatar | VARCHAR(255) | NULL | Avatar URL or identifier |
| is_admin | BOOLEAN | DEFAULT FALSE | Admin privileges flag |
| is_banned | BOOLEAN | DEFAULT FALSE | Ban status |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_users_username` on username
- `idx_users_email` on email
- `idx_users_is_banned` on is_banned

**Triggers:**
- `update_users_updated_at` - Auto-updates updated_at on row changes

---

### puzzles
Stores puzzle definitions with categories and words.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique puzzle identifier |
| title | VARCHAR(255) | NOT NULL | Puzzle title/name |
| categories | JSONB | NOT NULL | Array of category objects |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Categories JSONB Structure:**
```json
[
  {
    "id": "yellow",
    "color": "yellow",
    "title": "Category name",
    "words": ["WORD1", "WORD2", "WORD3", "WORD4"]
  }
]
```

**Indexes:**
- `idx_puzzles_categories` GIN index on categories (for JSONB queries)

**Triggers:**
- `update_puzzles_updated_at` - Auto-updates updated_at on row changes

---

### matches
Stores completed and in-progress multiplayer matches.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique match identifier |
| puzzle_id | INTEGER | FOREIGN KEY → puzzles(id) | Reference to puzzle used |
| puzzle_snapshot | JSONB | NOT NULL | Snapshot of puzzle at match start |
| difficulty | VARCHAR(20) | NOT NULL, CHECK | Difficulty level |
| player1_id | INTEGER | FOREIGN KEY → users(id) | First player |
| player2_id | INTEGER | FOREIGN KEY → users(id) | Second player |
| winner_id | INTEGER | FOREIGN KEY → users(id) | Winning player |
| result | VARCHAR(20) | CHECK | Match outcome |
| player1_guesses | JSONB | DEFAULT '[]' | Player 1's guess history |
| player2_guesses | JSONB | DEFAULT '[]' | Player 2's guess history |
| player1_time_ms | INTEGER | NULL | Player 1's completion time |
| player2_time_ms | INTEGER | NULL | Player 2's completion time |
| started_at | TIMESTAMP | NULL | Match start time |
| completed_at | TIMESTAMP | NULL | Match completion time |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |

**Valid difficulty values:**
- `easy` (7 lives)
- `normal` (5 lives)
- `hard` (3 lives)
- `expert` (1 life)

**Valid result values:**
- `player1_win`
- `player2_win`
- `draw`
- `abandoned`

**Indexes:**
- `idx_matches_player1` on player1_id
- `idx_matches_player2` on player2_id
- `idx_matches_winner` on winner_id
- `idx_matches_difficulty` on difficulty
- `idx_matches_completed` on completed_at
- `idx_matches_puzzle` on puzzle_id

---

### session
Stores Express session data (managed by connect-pg-simple).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| sid | VARCHAR | PRIMARY KEY | Session ID |
| sess | JSON | NOT NULL | Session data |
| expire | TIMESTAMP(6) | NOT NULL | Expiration time |

**Indexes:**
- `IDX_session_expire` on expire

**Session Configuration:**
- Max age: 7 days
- HttpOnly: true
- Secure: true (production only)
- SameSite: strict

---

## Materialized Views

### leaderboard
Aggregated player statistics by difficulty level.

| Column | Type | Description |
|--------|------|-------------|
| user_id | INTEGER | User identifier |
| username | VARCHAR(50) | Display name |
| avatar | VARCHAR(255) | Avatar URL |
| difficulty | VARCHAR(20) | Difficulty level |
| wins | BIGINT | Number of wins |
| games_played | BIGINT | Total games played |
| best_time_ms | INTEGER | Best completion time (wins only) |

**Indexes:**
- `idx_leaderboard_user_difficulty` UNIQUE on (user_id, difficulty)
- `idx_leaderboard_wins` on (difficulty, wins DESC, best_time_ms ASC)
- `idx_leaderboard_difficulty` on difficulty

**Refresh Function:**
```sql
SELECT refresh_leaderboard();
```

**Note:** Materialized view must be refreshed after matches complete to update rankings.

---

## Functions

### update_updated_at_column()
Trigger function that automatically updates the `updated_at` timestamp.

**Usage:** Applied to users and puzzles tables.

### refresh_leaderboard()
Refreshes the leaderboard materialized view concurrently.

**Usage:**
```sql
SELECT refresh_leaderboard();
```

---

## Relationships

```
users (1) ──< (N) matches [player1_id]
users (1) ──< (N) matches [player2_id]
users (1) ──< (N) matches [winner_id]
puzzles (1) ──< (N) matches [puzzle_id]
```

---

## Data Seeding

The database is seeded with 20 puzzles from `src/data/puzzles.js`:
- Each puzzle has 5 categories
- Each category has 4 words
- Categories: yellow, green, blue, purple, pink
- Puzzles cover various themes (food, geography, wordplay, etc.)

---

## Admin Setup

First admin must be manually provisioned:

```sql
UPDATE users SET is_admin = TRUE WHERE id = 1;
```

---

## Banned Users

Users can be banned by setting `is_banned = TRUE`:

```sql
UPDATE users SET is_banned = TRUE WHERE id = <user_id>;
```

Banned users:
- Cannot login
- Have existing sessions invalidated on next request
- Are blocked by `requireAuth` middleware
