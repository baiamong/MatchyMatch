# Concurrency Semaphore Implementation Summary

## What Changed

The job processor now limits how many jobs can run at the same time. Previously, when new work arrived—either through database notifications or the periodic safety check—the system would start processing immediately without any cap. This meant that a sudden burst of 100 jobs could spawn 100 concurrent operations, overwhelming the worker.

Now, the system uses a **semaphore** (a gatekeeper pattern) that enforces a maximum number of concurrent jobs. The default limit is **3 simultaneous jobs**, configurable via the `MAX_CONCURRENT_JOBS` environment variable. When all slots are occupied, new work waits in a queue rather than being dropped or rejected. As jobs complete and free up slots, queued work automatically proceeds.

## Why This Matters

**Before**: Unbounded concurrency could exhaust system resources (memory, database connections, CPU) during traffic spikes, leading to crashes or degraded performance across all jobs.

**After**: The worker maintains stable resource usage regardless of queue depth. Three jobs run at a time (or your configured limit), ensuring predictable performance and preventing resource exhaustion. The queue ensures no work is lost—everything processes eventually, just in a controlled manner.

## How It Works

### The Semaphore

The `Semaphore` class tracks available execution slots:

- **Initialization**: Reads `MAX_CONCURRENT_JOBS` from the environment (defaults to 3 if missing or invalid)
- **Acquire**: Before starting a job, the worker requests a slot. If one is available, it's granted immediately. If all slots are occupied, the request joins a first-in-first-out queue
- **Release**: When a job completes (success or failure), its slot is released. If any requests are queued, the next one immediately receives the freed slot
- **Validation**: Non-positive numbers, NaN, or Infinity all fall back to the safe default of 3

### Integration Points

Both ways that jobs enter the system now respect the semaphore:

1. **NOTIFY Handler** — the immediate path: When a new job is inserted into the database, PostgreSQL sends a notification. The listener receives it and attempts to claim and run the job, but only after acquiring a semaphore slot. If all slots are full, the attempt queues until a slot frees up.

2. **Periodic Drain** — the safety net: Every 5 seconds, the system attempts to claim up to 10 pending jobs (in case any notifications were missed). Each of these attempts also goes through the semaphore, so even if 10 claims are fired, only the configured maximum will run concurrently.

### Database Atomicity Preserved

The semaphore is an **in-process** concurrency control. It does not replace the database-level job claiming mechanism. Each worker still uses `SELECT ... FOR UPDATE SKIP LOCKED` to atomically claim a job, preventing multiple workers from grabbing the same job. The semaphore simply controls how many claims a single worker attempts simultaneously.

### Logging

All logging uses structured JSON format (no console.* calls):

- **Debug level**: Slot acquisition, slot release, queue depth, available slots
- **Info level**: Job claimed, job completed, throttling active (when queue builds up), stuck jobs reaped
- **Error level**: Job execution failures, handler errors

Example:
```json
{"timestamp":"2024-01-15T10:30:00.000Z","level":"info","maxConcurrentJobs":3,"message":"Job listener started with concurrency control"}
{"timestamp":"2024-01-15T10:30:01.000Z","level":"debug","queueDepth":0,"availableSlots":2,"capacity":3,"message":"Acquired job slot"}
```

## Testing

The test suite verifies:

- **Concurrency cap**: When N jobs (N > limit) are fired simultaneously, the system never runs more than the configured maximum concurrently
- **Queue processing**: Queued jobs run as slots free up, maintaining FIFO order
- **Fallback behavior**: Invalid `MAX_CONCURRENT_JOBS` values (0, -1, NaN, "invalid") all fall back to 3
- **Entry point coverage**: Both NOTIFY handler and periodic drain respect the semaphore
- **Atomicity**: Database claim mechanism with SKIP LOCKED remains unchanged

Run tests with:
```bash
cd apps/forge-orchestrator
npm test
```

## Configuration

Set the concurrency limit via environment variable:

```bash
# Allow up to 5 concurrent jobs
MAX_CONCURRENT_JOBS=5
```

If not set, or if set to an invalid value, the system defaults to 3.

## Files Changed

### New Files
- `apps/forge-orchestrator/src/semaphore.ts` — Semaphore implementation
- `apps/forge-orchestrator/src/semaphore.test.ts` — Semaphore unit tests
- `apps/forge-orchestrator/src/logger.ts` — Structured logger
- `apps/forge-orchestrator/src/listener.ts` — Job listener with semaphore integration
- `apps/forge-orchestrator/src/listener.test.ts` — Integration tests
- `apps/forge-orchestrator/package.json` — Dependencies and scripts
- `apps/forge-orchestrator/tsconfig.json` — TypeScript configuration
- `apps/forge-orchestrator/jest.config.js` — Test configuration
- `apps/forge-orchestrator/.env.example` — Environment variable documentation
- `apps/forge-orchestrator/README.md` — Complete usage documentation
- `docs/pg-queue-processor-spec.md` — Specification requirements

## Specification Compliance

This implementation satisfies:

- **§7.2**: Semaphore-based concurrency control with configurable `MAX_CONCURRENT_JOBS` (default 3)
- **§11**: In-process semaphore works alongside database atomic claims (SKIP LOCKED)
- **Logging requirement**: Structured JSON logs only (import { log }), no console.* calls
- **Safety requirement**: Periodic drain remains as safety net, no NOTIFY is lost

## Recommended Next Step

**Review and merge the pull request** after verifying CI passes. The CI pipeline should run:

1. **Linting**: Ensures code style consistency
2. **Type checking**: Verifies TypeScript types are correct
3. **Unit tests**: Confirms semaphore behavior and concurrency limits
4. **Integration tests**: Validates listener integration with both entry points

**Watch-outs for non-technical reviewers:**

- This change affects **how many jobs run at once**, not **which jobs run** or **when they start**. The queue still processes all jobs, just in a controlled manner.
- The default limit of 3 is conservative. If your workload can handle more concurrent jobs without resource issues, increase `MAX_CONCURRENT_JOBS` after deployment.
- Existing jobs in the database are unaffected—this only changes the worker's behavior, not the job data or schema.
- The periodic drain (5-second interval) remains unchanged as a safety mechanism. It will attempt to claim jobs even if notifications are missed, but the semaphore ensures it doesn't overwhelm the system.

Once merged, monitor the structured logs for:
- `"message":"Job listener started with concurrency control"` — confirms semaphore is active
- `"message":"Job queue building, throttling active"` — indicates demand exceeds capacity (may want to increase limit)
- Job completion rates — should remain stable even during traffic spikes
