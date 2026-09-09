# MatchyMatch Server

Backend API server for MatchyMatch multiplayer puzzle game.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start PostgreSQL database:
```bash
docker-compose up -d
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Run migrations:
```bash
npm run migrate:up
```

5. Start development server:
```bash
npm run dev
```

## Environment Variables

See `.env.example` for required configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption (min 32 chars)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend origin for CORS

## Database Migrations

Migrations are managed with `node-pg-migrate`:

- Run all pending migrations: `npm run migrate:up`
- Rollback last migration: `npm run migrate:down`

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # PostgreSQL connection pool
│   │   ├── env.js       # Environment variables
│   │   └── constants.js # Game constants
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # Authentication middleware
│   │   └── errorHandler.js
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── migrations/         # Database migrations
├── docker-compose.yml  # PostgreSQL container
└── package.json
```

## Admin Setup

First admin must be manually provisioned via SQL:

```sql
UPDATE users SET is_admin = TRUE WHERE id = 1;
```

## Session Management

- Sessions stored in PostgreSQL via `connect-pg-simple`
- 7-day expiry
- HttpOnly cookies
- Secure flag in production
- SameSite=Strict

## Banned Users

Users with `is_banned = TRUE`:
- Cannot login
- Existing sessions are invalidated on next request
