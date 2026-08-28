/**
 * Structured logger for the forge orchestrator.
 * Provides debug, info, warn, and error level logging with structured data.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogData {
  [key: string]: any;
}

class Logger {
  private logLevel: LogLevel = 'info';

  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  debug(data: LogData | string, message?: string): void {
    this.log('debug', data, message);
  }

  info(data: LogData | string, message?: string): void {
    this.log('info', data, message);
  }

  warn(data: LogData | string, message?: string): void {
    this.log('warn', data, message);
  }

  error(data: LogData | string, message?: string): void {
    this.log('error', data, message);
  }

  private log(level: LogLevel, data: LogData | string, message?: string): void {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    if (messageLevelIndex < currentLevelIndex) {
      return; // Skip logs below current level
    }

    const timestamp = new Date().toISOString();
    
    if (typeof data === 'string') {
      // Simple string message
      process.stdout.write(JSON.stringify({ timestamp, level, message: data }) + '\n');
    } else {
      // Structured data with optional message
      const logEntry = { timestamp, level, ...data };
      if (message) {
        logEntry.message = message;
      }
      process.stdout.write(JSON.stringify(logEntry) + '\n');
    }
  }
}

export const log = new Logger();
