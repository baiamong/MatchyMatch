/**
 * Semaphore for controlling concurrent job execution.
 * 
 * Limits the number of simultaneously running tasks to a configured maximum.
 * When all slots are occupied, additional acquire() calls queue and wait
 * until a slot becomes available via release().
 */
export class Semaphore {
  private available: number;
  private readonly maxConcurrent: number;
  private readonly queue: Array<() => void> = [];

  /**
   * Creates a new Semaphore.
   * 
   * @param maxConcurrent - Maximum number of concurrent operations.
   *                        Non-positive or NaN values fall back to 3.
   */
  constructor(maxConcurrent: number) {
    // Validate and apply fallback
    if (!Number.isFinite(maxConcurrent) || maxConcurrent <= 0) {
      this.maxConcurrent = 3;
      this.available = 3;
    } else {
      this.maxConcurrent = Math.floor(maxConcurrent);
      this.available = this.maxConcurrent;
    }
  }

  /**
   * Acquires a slot, waiting if necessary until one becomes available.
   * 
   * @returns Promise that resolves when a slot is acquired
   */
  async acquire(): Promise<void> {
    if (this.available > 0) {
      this.available--;
      return Promise.resolve();
    }

    // No slots available - queue and wait
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  /**
   * Releases a slot, allowing queued acquisitions to proceed.
   * 
   * If there are queued waiters, the next one is immediately granted a slot.
   * Otherwise, the available count is incremented.
   */
  release(): void {
    const next = this.queue.shift();
    if (next) {
      // Grant slot to next queued waiter
      next();
    } else {
      // No waiters - increment available count
      this.available++;
    }
  }

  /**
   * Returns the current number of tasks waiting for a slot.
   */
  get queueDepth(): number {
    return this.queue.length;
  }

  /**
   * Returns the current number of available slots.
   */
  get availableSlots(): number {
    return this.available;
  }

  /**
   * Returns the maximum concurrent operations allowed.
   */
  get capacity(): number {
    return this.maxConcurrent;
  }
}
