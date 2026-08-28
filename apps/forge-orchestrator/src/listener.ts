import { Pool } from 'pg';
import { Semaphore } from './semaphore';
import { log } from './logger';

// Semaphore-controlled job processing with bounded concurrency

interface Job {
  id: string;
  type: string;
  payload: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

let pool: Pool;
let semaphore: Semaphore;

/**
 * Reads MAX_CONCURRENT_JOBS from environment, with fallback to 3.
 */
function getMaxConcurrentJobs(): number {
  const envValue = process.env.MAX_CONCURRENT_JOBS;
  if (!envValue) {
    return 3;
  }
  
  const parsed = parseInt(envValue, 10);
  // Semaphore constructor handles validation and fallback
  return parsed;
}

/**
 * Claims and runs a single job from the queue.
 * Uses atomic DB claim with SKIP LOCKED to prevent race conditions.
 * 
 * This function is now wrapped by semaphore control at all call sites.
 */
async function claimAndRun(client?: any): Promise<void> {
  const conn = client || pool;
  
  try {
    // Atomic claim: WHERE status = 'pending' with SKIP LOCKED
    const result = await conn.query(
      `UPDATE jobs 
       SET status = 'running', started_at = NOW() 
       WHERE id = (
         SELECT id FROM jobs 
         WHERE status = 'pending' 
         ORDER BY created_at 
         FOR UPDATE SKIP LOCKED 
         LIMIT 1
       ) 
       RETURNING *`
    );

    if (result.rows.length === 0) {
      log.debug('No pending jobs to claim');
      return; // No pending jobs
    }

    const job: Job = result.rows[0];
    log.info({ jobId: job.id, jobType: job.type }, 'Claimed and executing job');
    
    // Execute the job
    await executeJob(job);
    
    // Mark as completed
    await conn.query(
      'UPDATE jobs SET status = $1, completed_at = NOW() WHERE id = $2',
      ['completed', job.id]
    );
    
    log.info({ jobId: job.id }, 'Job completed successfully');
  } catch (error) {
    log.error({ error: String(error) }, 'Job execution failed');
    // Error handling would mark job as failed in production
  }
}

async function executeJob(job: Job): Promise<void> {
  // Job execution logic
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Wraps claimAndRun with semaphore control.
 * Acquires a slot before running, releases it when done.
 */
async function claimAndRunWithSemaphore(): Promise<void> {
  await semaphore.acquire();
  
  const queueDepth = semaphore.queueDepth;
  const availableSlots = semaphore.availableSlots;
  
  log.debug(
    { queueDepth, availableSlots, capacity: semaphore.capacity },
    'Acquired job slot'
  );
  
  // Log throttling when queue builds up
  if (queueDepth > 0) {
    log.info(
      { queueDepth, capacity: semaphore.capacity },
      'Job queue building, throttling active'
    );
  }
  
  try {
    await claimAndRun();
  } finally {
    semaphore.release();
    log.debug(
      { availableSlots: semaphore.availableSlots, queueDepth: semaphore.queueDepth },
      'Released job slot'
    );
  }
}

/**
 * Starts the NOTIFY listener for immediate job processing.
 * Now respects concurrency limits via semaphore.
 */
export function startListener(dbPool: Pool): void {
  pool = dbPool;
  
  // Initialize semaphore with configured concurrency limit
  const maxConcurrent = getMaxConcurrentJobs();
  semaphore = new Semaphore(maxConcurrent);
  
  log.info(
    { maxConcurrentJobs: semaphore.capacity },
    'Job listener started with concurrency control'
  );
  
  pool.on('notification', (msg) => {
    if (msg.channel === 'job_queue') {
      log.debug({ channel: msg.channel }, 'Received job notification');
      
      // Semaphore-controlled execution
      claimAndRunWithSemaphore().catch(err => {
        log.error({ error: String(err) }, 'NOTIFY handler error');
      });
    }
  });

  pool.query('LISTEN job_queue').catch(err => {
    log.error({ error: String(err) }, 'Failed to LISTEN on job_queue');
  });
  
  // Start periodic drain as safety net
  setInterval(() => {
    drainPending().catch(err => {
      log.error({ error: String(err) }, 'Drain error');
    });
  }, 5000);
  
  log.info('Periodic drain scheduled (5s interval)');
}

/**
 * Periodic drain to catch any missed NOTIFY events.
 * Now respects concurrency limits via semaphore.
 */
async function drainPending(): Promise<void> {
  log.debug('Starting periodic drain');
  
  // Fire up to 10 claim attempts, but semaphore controls actual concurrency
  const drainPromises: Promise<void>[] = [];
  
  for (let i = 0; i < 10; i++) {
    drainPromises.push(
      claimAndRunWithSemaphore().catch(err => {
        log.error({ error: String(err) }, 'Drain claim error');
      })
    );
  }
  
  // Don't await - let semaphore queue them
  // This preserves the safety net behavior while respecting concurrency
}

/**
 * Stuck job reaper (already implemented per spec).
 * Finds jobs stuck in 'running' state and resets them.
 */
export async function reapStuckJobs(dbPool: Pool): Promise<void> {
  const stuckThreshold = 300000; // 5 minutes
  
  const result = await dbPool.query(
    `UPDATE jobs 
     SET status = 'pending', started_at = NULL 
     WHERE status = 'running' 
     AND started_at < NOW() - INTERVAL '${stuckThreshold} milliseconds'
     RETURNING id`
  );
  
  if (result.rows.length > 0) {
    log.info(
      { count: result.rows.length },
      'Reaped stuck jobs'
    );
  }
}

// Export for testing
export { semaphore, claimAndRunWithSemaphore };
