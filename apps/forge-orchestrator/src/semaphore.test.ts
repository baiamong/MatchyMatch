import { Semaphore } from './semaphore';

describe('Semaphore', () => {
  describe('constructor', () => {
    it('should initialize with valid maxConcurrent', () => {
      const sem = new Semaphore(5);
      expect(sem.capacity).toBe(5);
      expect(sem.availableSlots).toBe(5);
      expect(sem.queueDepth).toBe(0);
    });

    it('should fall back to 3 for non-positive values', () => {
      expect(new Semaphore(0).capacity).toBe(3);
      expect(new Semaphore(-1).capacity).toBe(3);
      expect(new Semaphore(-100).capacity).toBe(3);
    });

    it('should fall back to 3 for NaN', () => {
      expect(new Semaphore(NaN).capacity).toBe(3);
      expect(new Semaphore(Infinity).capacity).toBe(3);
      expect(new Semaphore(-Infinity).capacity).toBe(3);
    });

    it('should floor decimal values', () => {
      expect(new Semaphore(3.7).capacity).toBe(3);
      expect(new Semaphore(5.2).capacity).toBe(5);
    });
  });

  describe('acquire and release', () => {
    it('should acquire slots immediately when available', async () => {
      const sem = new Semaphore(3);
      
      await sem.acquire();
      expect(sem.availableSlots).toBe(2);
      
      await sem.acquire();
      expect(sem.availableSlots).toBe(1);
      
      await sem.acquire();
      expect(sem.availableSlots).toBe(0);
    });

    it('should queue when all slots are occupied', async () => {
      const sem = new Semaphore(2);
      
      // Occupy all slots
      await sem.acquire();
      await sem.acquire();
      expect(sem.availableSlots).toBe(0);
      
      // Next acquire should queue
      let acquired = false;
      const acquirePromise = sem.acquire().then(() => {
        acquired = true;
      });
      
      // Should not resolve immediately
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(acquired).toBe(false);
      expect(sem.queueDepth).toBe(1);
      
      // Release a slot - queued acquire should resolve
      sem.release();
      await acquirePromise;
      expect(acquired).toBe(true);
      expect(sem.queueDepth).toBe(0);
    });

    it('should process queue in FIFO order', async () => {
      const sem = new Semaphore(1);
      const order: number[] = [];
      
      // Occupy the single slot
      await sem.acquire();
      
      // Queue three acquisitions
      const p1 = sem.acquire().then(() => order.push(1));
      const p2 = sem.acquire().then(() => order.push(2));
      const p3 = sem.acquire().then(() => order.push(3));
      
      expect(sem.queueDepth).toBe(3);
      
      // Release and verify FIFO order
      sem.release();
      await p1;
      expect(order).toEqual([1]);
      
      sem.release();
      await p2;
      expect(order).toEqual([1, 2]);
      
      sem.release();
      await p3;
      expect(order).toEqual([1, 2, 3]);
    });

    it('should increment available when releasing with no queue', () => {
      const sem = new Semaphore(3);
      
      sem.release();
      expect(sem.availableSlots).toBe(4); // Can go above capacity
      
      sem.release();
      expect(sem.availableSlots).toBe(5);
    });
  });

  describe('concurrency control', () => {
    it('should never exceed max concurrent operations', async () => {
      const maxConcurrent = 3;
      const sem = new Semaphore(maxConcurrent);
      const totalTasks = 10;
      
      let currentlyRunning = 0;
      let maxObserved = 0;
      const results: number[] = [];
      
      const tasks = Array.from({ length: totalTasks }, async (_, i) => {
        await sem.acquire();
        
        currentlyRunning++;
        maxObserved = Math.max(maxObserved, currentlyRunning);
        
        // Simulate work
        await new Promise(resolve => setTimeout(resolve, 10));
        
        results.push(i);
        currentlyRunning--;
        
        sem.release();
      });
      
      await Promise.all(tasks);
      
      // Verify concurrency was never exceeded
      expect(maxObserved).toBeLessThanOrEqual(maxConcurrent);
      expect(maxObserved).toBe(maxConcurrent); // Should have hit the limit
      
      // Verify all tasks completed
      expect(results).toHaveLength(totalTasks);
      expect(new Set(results).size).toBe(totalTasks);
    });

    it('should handle rapid acquire/release cycles', async () => {
      const sem = new Semaphore(2);
      const iterations = 100;
      let completed = 0;
      
      const tasks = Array.from({ length: iterations }, async () => {
        await sem.acquire();
        try {
          await new Promise(resolve => setTimeout(resolve, 1));
          completed++;
        } finally {
          sem.release();
        }
      });
      
      await Promise.all(tasks);
      expect(completed).toBe(iterations);
    });

    it('should queue tasks when capacity is exceeded', async () => {
      const sem = new Semaphore(2);
      const taskCount = 5;
      
      let running = 0;
      let maxRunning = 0;
      
      const tasks = Array.from({ length: taskCount }, async (_, i) => {
        await sem.acquire();
        
        running++;
        maxRunning = Math.max(maxRunning, running);
        
        // Hold the slot for a bit
        await new Promise(resolve => setTimeout(resolve, 20));
        
        running--;
        sem.release();
      });
      
      // Check queue depth while tasks are running
      await new Promise(resolve => setTimeout(resolve, 5));
      expect(sem.queueDepth).toBeGreaterThan(0);
      
      await Promise.all(tasks);
      
      // Verify max concurrency was respected
      expect(maxRunning).toBe(2);
      expect(sem.queueDepth).toBe(0);
      expect(sem.availableSlots).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('should handle acquire without release', async () => {
      const sem = new Semaphore(2);
      
      await sem.acquire();
      await sem.acquire();
      
      expect(sem.availableSlots).toBe(0);
      
      // This should queue indefinitely
      let resolved = false;
      sem.acquire().then(() => {
        resolved = true;
      });
      
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(resolved).toBe(false);
      expect(sem.queueDepth).toBe(1);
    });

    it('should handle multiple releases', () => {
      const sem = new Semaphore(2);
      
      sem.release();
      sem.release();
      sem.release();
      
      expect(sem.availableSlots).toBe(5); // 2 + 3 releases
    });

    it('should handle concurrent acquires', async () => {
      const sem = new Semaphore(3);
      
      const acquires = [
        sem.acquire(),
        sem.acquire(),
        sem.acquire(),
        sem.acquire(),
        sem.acquire()
      ];
      
      // First 3 should resolve immediately
      await Promise.race([
        Promise.all(acquires.slice(0, 3)),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 100))
      ]);
      
      expect(sem.availableSlots).toBe(0);
      expect(sem.queueDepth).toBe(2);
      
      // Release to unblock queued
      sem.release();
      sem.release();
      
      await Promise.all(acquires);
      expect(sem.queueDepth).toBe(0);
    });
  });
});
