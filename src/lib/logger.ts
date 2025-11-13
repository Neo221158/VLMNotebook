/**
 * Logger utility for development and production environments
 * 
 * In development: Logs to console with colored prefixes
 * In production: Only logs errors to console
 */

const isDevelopment = process.env.NODE_ENV === 'development';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private logToConsole(level: LogLevel, message: string, ...args: unknown[]) {
    const prefix = '[' + level.toUpperCase() + ']';

    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'info':
        if (isDevelopment) {
          console.log(prefix, message, ...args);
        }
        break;
      case 'debug':
        if (isDevelopment) {
          console.log(prefix, message, ...args);
        }
        break;
    }
  }

  /**
   * Log info message (development only)
   */
  info(message: string, ...args: unknown[]) {
    this.logToConsole('info', message, ...args);
  }

  /**
   * Log warning message (development only)
   */
  warn(message: string, ...args: unknown[]) {
    if (isDevelopment) {
      this.logToConsole('warn', message, ...args);
    }
  }

  /**
   * Log error message (always logged)
   */
  error(message: string, ...args: unknown[]) {
    this.logToConsole('error', message, ...args);
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, ...args: unknown[]) {
    this.logToConsole('debug', message, ...args);
  }
}

export const logger = new Logger();
