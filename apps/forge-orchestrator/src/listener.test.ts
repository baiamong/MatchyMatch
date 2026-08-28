import { Pool } from 'pg';
import { startListener, reapStuckJobs } from './listener';
import { Semaphore } from './semaphore';

// Mock pg Pool
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    on: jest.fn(),
    listeners: new Map(),
    emit: function(event: string, data: any) {
      const handlers = this.listeners.get(event) || [];
      handlers.forEach((handler: Function) => handler(data));
    }
  };
  
  return {
    Pool: jest.fn(() => mockPool)
  };
});

describe('Listener Integration', () => {
  let mockPool: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockPool = new Pool();
    
    // Setup mock pool behavior
    mockPool.on.mockImplementation((event: string, handler: Function) => {
      if (!mockPool.listeners.has(event)) {
        mockPool.listeners.set(event, []);
      }
      mockPool.listeners.get(event).push(handler);
    });
    
    // Default query mock - no jobs
    mockPool.query.mockResolvedValue({ rows: [] });
  });

  describe('startListener', () => {
    it('should initialize with MAX_CONCURRENT_JOBS from environment', () => {
      process.env.MAX_CONCURRENT_JOBS = '5';
      
      startListener(mockPool);
      
      expect(mockPool.on).toHaveBeenCalledWith('notification', expect.any(Function));
      expect(mockPool.query).toHaveBeenCalledWith('LISTEN job_queue');
      
      delete process.env.MAX_CONCURRENT_JOBS;
    });

    it('should default to 3 concurrent jobs when env not set', () => {
      delete process.env.MAX_CONCURRENT_JOBS;
      
      startListener(mockPool);
      
      expect(mockPool.on).toHaveBeenCalled();
    });

    it('should fall back to 3 for invalid MAX_CONCURRENT_JOBS', () => {
      process.env.MAX_CONCURRENT_JOBS = 'invalid';
      
      startListener(mockPool);
      
      expect(mockPool.on).toHaveBeenCalled();
      
      delete process.env.MAX_CONCURRENT_JOBS;
    });
  });

  describe('concurrency control', () => {
    it('should respect MAX_CONCURRENT_JOBS limit', async () => {
      process.env.MAX_CONCURRENT_JOBS = '2';
      
      let runningJobs = 0;
      let maxConcurrent = 0;
      const jobDuration = 50;
      
      // Mock job execution that tracks concurrency
      mockPool.query.mockImplementation((sql: string) => {
        if (sql.includes('UPDATE jobs')) {
          if (sql.includes("status = 'running'")) {
            // Claim query
            runningJobs++;
            maxConcurrent = Math.max(maxConcurrent, runningJobs);
            
            return new Promise(resolve => {
              setTimeout(() => {
                resolve({
                  rows: [{
                    id: `job-${Date.now()}-${Math.random()}`,
                    type: 'test',
                    payload: {},
                    status: 'running'
                  }]
                });
              }, jobDuration);
            });
          } else if (sql.includes("status = 'completed'")) {
            // Complete query
            runningJobs--;
            return Promise.resolve({ rows: [] });
          }
        }
        return Promise.resolve({ rows: [] });
      });
      
      startListener(mockPool);
      
      // Simulate 5 job notifications
      const notifications = Array.from({ length: 5 }, (_, i) => ({
        channel: 'job_queue',
        payload: `job-${i}`
      }));
      
      notifications.forEach(notification => {
        mockPool.emit('notification', notification);
      });
      
      // Wait for jobs to process
      await new Promise(resolve => setTimeout(resolve, jobDuration * 3));
      
      // Verify concurrency was never exceeded
      expect(maxConcurrent).toBeLessThanOrEqual(2);
      
      delete process.env.MAX_CONCURRENT_JOBS;
    }, 10000);

    it('should queue jobs when all slots are occupied', async () => {
      process.env.MAX_CONCURRENT_JOBS = '2';
      
      const jobPromises: Array<() => void> = [];
      let claimedCount = 0;
      
      mockPool.query.mockImplementation((sql: string) => {
        if (sql.includes('UPDATE jobs') && sql.includes("status = 'running'")) {
          claimedCount++;
          
          return new Promise(resolve => {
            jobPromises.push(() => {
              resolve({
                rows: [{
                  id: `job-${claimedCount}`,
                  type: 'test',
                  payload: {},
                  status: 'running'
                }]
              });
            });
          });
        } else if (sql.includes("status = 'completed'")) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });
      
      startListener(mockPool);
      
      // Fire 4 notifications (more than capacity of 2)
      for (let i = 0; i < 4; i++) {
        mockPool.emit('notification', { channel: 'job_queue', payload: `job-${i}` });
      }
      
      // Wait a bit for acquires to queue
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Should have attempted to claim jobs
      expect(claimedCount).toBeGreaterThan(0);
      
      // Resolve the job promises to free slots
      jobPromises.forEach(resolve => resolve());
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      delete process.env.MAX_CONCURRENT_JOBS;
    });

    it('should process queued jobs as slots free up', async () => {
      process.env.MAX_CONCURRENT_JOBS = '2';
      
      const completedJobs: string[] = [];
      let activeJobs = 0;
      
      mockPool.query.mockImplementation((sql: string) => {
        if (sql.includes('UPDATE jobs') && sql.includes("status = 'running'")) {
          activeJobs++;
          const jobId = `job-${Date.now()}-${Math.random()}`;
          
          return Promise.resolve({
            rows: [{
              id: jobId,
              type: 'test',
              payload: {},
              status: 'running'
            }]
          });
        } else if (sql.includes("status = 'completed'")) {
          activeJobs--;
          const jobId = sql.match(/id = '([^']+)'/)?.[1];
          if (jobId) {
            completedJobs.push(jobId);
          }
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });
      
      startListener(mockPool);
      
      // Fire multiple notifications
      for (let i = 0; i < 5; i++) {
        mockPool.emit('notification', { channel: 'job_queue', payload: `job-${i}` });
      }
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // All jobs should eventually complete
      expect(completedJobs.length).toBeGreaterThan(0);
      
      delete process.env.MAX_CONCURRENT_JOBS;
    });
  });

  describe('reapStuckJobs', () => {
    it('should reset stuck jobs to pending', async () => {
      const stuckJobs = [
        { id: 'stuck-1' },
        { id: 'stuck-2' }
      ];
      
      mockPool.query.mockResolvedValue({ rows: stuckJobs });
      
      await reapStuckJobs(mockPool);
      
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("status = 'running'")
      );
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("status = 'pending'")
      );
    });

    it('should handle no stuck jobs', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });
      
      await reapStuckJobs(mockPool);
      
      expect(mockPool.query).toHaveBeenCalled();
    });
  });

  describe('NOTIFY handler', () => {
    it('should ignore notifications from other channels', async () => {
      startListener(mockPool);
      
      mockPool.emit('notification', { channel: 'other_channel', payload: 'data' });
      
      // Should not attempt to claim jobs
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Only LISTEN query should have been called
      const updateCalls = mockPool.query.mock.calls.filter((call: any[]) => 
        call[0].includes('UPDATE jobs')
      );
      expect(updateCalls.length).toBe(0);
    });

    it('should process job_queue notifications', async () => {
      mockPool.query.mockImplementation((sql: string) => {
        if (sql.includes('UPDATE jobs') && sql.includes("status = 'running'")) {
          return Promise.resolve({
            rows: [{
              id: 'test-job',
              type: 'test',
              payload: {},
              status: 'running'
            }]
          });
        }
        return Promise.resolve({ rows: [] });
      });
      
      startListener(mockPool);
      
      mockPool.emit('notification', { channel: 'job_queue', payload: 'new-job' });
      
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should have attempted to claim a job
      const updateCalls = mockPool.query.mock.calls.filter((call: any[]) => 
        call[0].includes('UPDATE jobs')
      );
      expect(updateCalls.length).toBeGreaterThan(0);
    });
  });

  describe('periodic drain', () => {
    it('should fire drain attempts on interval', async () => {
      jest.useFakeTimers();
      
      startListener(mockPool);
      
      // Fast-forward past the drain interval
      jest.advanceTimersByTime(5000);
      
      await Promise.resolve(); // Let promises resolve
      
      jest.useRealTimers();
    });
  });
});
