# PostgreSQL Queue Processor Specification

## 7.2 Concurrency Control

The job processor MUST implement a semaphore-based concurrency control mechanism to limit the number of simultaneously executing jobs.

**Requirements:**
- Default maximum concurrent jobs: 3
- Configurable via `MAX_CONCURRENT_JOBS` environment variable
- Invalid values (non-positive, NaN) MUST fall back to default of 3
- The semaphore MUST queue excess work rather than dropping or rejecting it
- All entry points (NOTIFY handler and periodic drain) MUST respect the concurrency limit

## 11. Implementation Notes

### Semaphore Pattern

The semaphore implementation MUST:
1. Track available slots (initialized to MAX_CONCURRENT_JOBS)
2. Maintain a FIFO queue for pending acquisitions
3. Block on `acquire()` when all slots are occupied
4. Release slots and process queued work on `release()`
5. Never allow more than MAX_CONCURRENT_JOBS tasks to run concurrently

### Integration Points

Both job entry points must be wrapped:
- **NOTIFY handler**: Immediate job claims triggered by database notifications
- **Periodic drain**: Safety net that processes pending jobs on a timer

The semaphore is an in-process concurrency control and does NOT replace the database-level atomic claim mechanism (WHERE status = 'pending' with SKIP LOCKED).

### Logging

Use structured logging (import { log }) for:
- Debug: slot acquisition, queue depth
- Info: throttling events when queue builds up
- No console.* calls permitted
