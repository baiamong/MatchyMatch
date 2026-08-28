# Forge Orchestrator

PostgreSQL-based job queue processor with bounded concurrency control.

## Features

- **Bounded Concurrency**: Configurable limit on simultaneous job execution via `MAX_CONCURRENT_JOBS`
- **Semaphore-based Queueing**: Jobs queue when capacity is reached, processing as slots free up
- **Dual Entry Points**: NOTIFY-based immediate processing + periodic drain safety net
- **Atomic Job Claims**: Database-level locking with `SKIP LOCKED` prevents race conditions
- **Stuck Job Recovery**: Automatic reaping of jobs stuck in running state
- **Structured Logging**: JSON-formatted logs with configurable levels

## Configuration

Set environment variables to configure the orchestrator:

```bash
# Maximum concurrent jobs (default: 3)
MAX_CONCURRENT_JOBS=5

# Database connection
DATABASE_URL=postgresql://user:password@localhost:5432/forge_db

# Log level (default: info)
LOG_LEVEL=debug
```

See `.env.example` for all available options.

## Architecture

### Concurrency Control

The orchestrator implements a **Semaphore** pattern to cap concurrent job execution:

1. **Semaphore Initialization**: On startup, reads `MAX_CONCURRENT_JOBS` (default 3)
2. **Slot Acquisition**: Each job attempt acquires a semaphore slot before running
3. **Queueing**: When all slots are occupied, new jobs queue in-memory (FIFO)
4. **Slot Release**: Completed jobs release their slot, allowing queued jobs to proceed

This is an **in-process** concurrency control that works alongside database-level atomicity.

### Job Entry Points

Jobs enter the system through two paths, both semaphore-controlled:

#### 1. NOTIFY Handler (Immediate)
- Listens on PostgreSQL `job_queue` channel
- Triggers immediate job claim attempt on notification
- Respects semaphore limit - queues when capacity reached

#### 2. Periodic Drain (Safety Net)
- Runs every 5 seconds
- Attempts to claim up to 10 pending jobs
- Catches any missed NOTIFY events
- Also respects semaphore limit

### Atomic Job Claims

Job claims use PostgreSQL row-level locking:

```sql
UPDATE jobs 
SET status = 'running', started_at = NOW() 
WHERE id = (
  SELECT id FROM jobs 
  WHERE status = 'pending' 
  ORDER BY created_at 
  FOR UPDATE SKIP LOCKED 
  LIMIT 1
) 
RETURNING *
```

- `FOR UPDATE SKIP LOCKED`: Prevents multiple workers from claiming the same job
- Semaphore controls **how many** jobs run concurrently
- Database lock controls **which** job each worker gets

### Stuck Job Reaper

Automatically resets jobs stuck in `running` state:

- Runs periodically (configurable interval)
- Finds jobs running longer than threshold (default: 5 minutes)
- Resets status to `pending` for retry
- Logs count of reaped jobs

## Usage

```typescript
import { Pool } from 'pg';
import { startListener, reapStuckJobs } from './listener';

// Initialize database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Start the job listener
startListener(pool);

// Start stuck job reaper (optional, recommended)
setInterval(() => {
  reapStuckJobs(pool).catch(err => {
    console.error('Reaper error:', err);
  });
}, 60000); // Every minute
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Test Coverage

The test suite verifies:

- ✅ Semaphore respects max concurrent limit
- ✅ Jobs queue when capacity is exceeded
- ✅ Queued jobs process as slots free up
- ✅ FIFO queue ordering
- ✅ Invalid MAX_CONCURRENT_JOBS falls back to 3
- ✅ NOTIFY handler triggers job processing
- ✅ Periodic drain catches missed jobs
- ✅ Stuck job reaper resets long-running jobs

## Specification Compliance

This implementation satisfies:

- **§7.2**: Semaphore-based concurrency control with configurable `MAX_CONCURRENT_JOBS`
- **§11**: In-process semaphore works alongside database atomic claims
- **Logging**: Structured JSON logs (no console.* calls)
- **Safety**: Periodic drain ensures no NOTIFY is permanently lost

See `docs/pg-queue-processor-spec.md` for full specification.

## Logging

All logs are structured JSON with the following levels:

- **debug**: Slot acquisition/release, queue depth, no pending jobs
- **info**: Job claimed/completed, throttling active, stuck jobs reaped
- **warn**: (reserved for warnings)
- **error**: Job execution failures, handler errors

Example log output:

```json
{"timestamp":"2024-01-15T10:30:00.000Z","level":"info","maxConcurrentJobs":3,"message":"Job listener started with concurrency control"}
{"timestamp":"2024-01-15T10:30:01.000Z","level":"debug","queueDepth":0,"availableSlots":2,"capacity":3,"message":"Acquired job slot"}
{"timestamp":"2024-01-15T10:30:01.100Z","level":"info","jobId":"job-123","jobType":"email","message":"Claimed and executing job"}
{"timestamp":"2024-01-15T10:30:02.000Z","level":"info","jobId":"job-123","message":"Job completed successfully"}
{"timestamp":"2024-01-15T10:30:02.050Z","level":"debug","availableSlots":3,"queueDepth":0,"message":"Released job slot"}
```

## Troubleshooting

### Jobs not processing

1. Check database connection: `DATABASE_URL` is set correctly
2. Verify LISTEN is active: Check logs for "Job listener started"
3. Check for stuck jobs: Run reaper manually or check `started_at` timestamps
4. Verify jobs exist: Query `SELECT * FROM jobs WHERE status = 'pending'`

### Concurrency not limited

1. Verify `MAX_CONCURRENT_JOBS` is set and valid
2. Check logs for "Job listener started with concurrency control" - shows actual limit
3. Enable debug logging: `LOG_LEVEL=debug` to see slot acquisition

### Jobs stuck in running state

1. Check if reaper is running: Should log "Reaped stuck jobs" periodically
2. Verify reaper threshold: Default 5 minutes, may need adjustment
3. Check for worker crashes: Jobs may be stuck if worker died mid-execution

## License

MIT
