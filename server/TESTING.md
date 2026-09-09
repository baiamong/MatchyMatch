# Backend Testing Guide

## Quick Start

1. **Verify setup:**
```bash
cd server
node verify-setup.js
```

2. **Start PostgreSQL:**
```bash
docker-compose up -d
```

3. **Install dependencies:**
```bash
npm install
```

4. **Run migrations:**
```bash
npm run migrate:up
```

5. **Start server:**
```bash
npm run dev
```

## Testing Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Verification

### Connect to PostgreSQL
```bash
docker exec -it matchymatch-server-postgres-1 psql -U postgres -d matchymatch
```

### Verify Tables
```sql
\dt
```

Should show:
- users
- puzzles
- matches
- session

### Verify Materialized View
```sql
\dm
```

Should show:
- leaderboard

### Check Seeded Puzzles
```sql
SELECT id, title FROM puzzles;
```

Should return 20 puzzles.

### Sample Puzzle Query
```sql
SELECT id, title, categories->0->>'title' as first_category 
FROM puzzles 
LIMIT 5;
```

## Session Testing

Sessions are stored in the `session` table. After implementing auth routes, you can verify:

```sql
SELECT sid, sess->>'userId' as user_id, expire 
FROM session;
```

## Migration Management

### Check migration status
```bash
npm run migrate:up -- --dry-run
```

### Rollback last migration
```bash
npm run migrate:down
```

### Rollback all migrations
```bash
npm run migrate:down -- --count 5
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Min 32 characters for production
- `NODE_ENV` - development or production
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend origin for CORS

## Common Issues

### Port 5432 already in use
```bash
# Stop existing PostgreSQL
docker-compose down

# Or use different port in docker-compose.yml
ports:
  - "5433:5432"
```

### Migration errors
```bash
# Reset database (WARNING: destroys all data)
docker-compose down -v
docker-compose up -d
npm run migrate:up
```

### Session not persisting
- Check that `session` table exists
- Verify `SESSION_SECRET` is set
- Check cookie settings in browser DevTools

## Next Steps (Future Sessions)

- [ ] Auth routes (register, login, logout)
- [ ] Puzzle routes (list, get random)
- [ ] Match routes (create, join, update)
- [ ] Leaderboard routes (get rankings)
- [ ] Admin routes (ban users, manage puzzles)
- [ ] WebSocket server for real-time multiplayer
