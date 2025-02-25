import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

// Test ve geliştirme ortamı için mock logger
const mockLogger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
  fatal: (...args: any[]) => console.error('[FATAL]', ...args)
};

// Base logger instance
const baseLogger = isTest ? mockLogger : pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Extended logger with custom methods
export const logger = {
  ...baseLogger,
  logRequest: (message: string, metadata: any) => baseLogger.info(metadata, message),
  logResponse: (message: string, metadata: any) => baseLogger.info(metadata, message),
  logError: (message: string, metadata: any) => baseLogger.error(metadata, message),
  logPerformance: (message: string, metadata: any) => baseLogger.info(metadata, message),
  logSecurity: (message: string, metadata: any) => baseLogger.warn(metadata, message),
  logAudit: (message: string, metadata: any) => baseLogger.info(metadata, message)
};

// Log seviyeleri
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Log metadatası
export interface LogMetadata {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  error?: Error;
  duration?: number;
  [key: string]: any;
}

// Pino logger instance'ı oluştur
const pinoLogger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

// Loglama servisi
class LoggerService {
  private logger: typeof pinoLogger;

  constructor() {
    this.logger = pinoLogger;
  }

  // Genel log metodu
  private log(level: LogLevel, message: string, metadata: LogMetadata = {}): void {
    const logData = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      ...metadata,
    };

    this.logger[level]({ ...logData }, message);
  }

  // API istekleri için log
  logRequest(message: string, metadata: LogMetadata): void {
    this.log('info', message, {
      type: 'request',
      ...metadata,
    });
  }

  // API yanıtları için log
  logResponse(message: string, metadata: LogMetadata): void {
    this.log('info', message, {
      type: 'response',
      ...metadata,
    });
  }

  // Hata logları
  logError(message: string, metadata: LogMetadata): void {
    const { error, ...rest } = metadata;
    this.log('error', message, {
      type: 'error',
      errorName: error?.name,
      errorMessage: error?.message,
      errorStack: error?.stack,
      ...rest,
    });
  }

  // Performans logları
  logPerformance(message: string, metadata: LogMetadata): void {
    this.log('info', message, {
      type: 'performance',
      ...metadata,
    });
  }

  // Güvenlik logları
  logSecurity(message: string, metadata: LogMetadata): void {
    this.log('warn', message, {
      type: 'security',
      ...metadata,
    });
  }

  // Audit logları
  logAudit(message: string, metadata: LogMetadata): void {
    this.log('info', message, {
      type: 'audit',
      ...metadata,
    });
  }

  // Debug logları
  debug(message: string, metadata: LogMetadata = {}): void {
    this.log('debug', message, metadata);
  }

  // Info logları
  info(message: string, metadata: LogMetadata = {}): void {
    this.log('info', message, metadata);
  }

  // Uyarı logları
  warn(message: string, metadata: LogMetadata = {}): void {
    this.log('warn', message, metadata);
  }

  // Hata logları (kısa versiyon)
  error(message: string, metadata: LogMetadata = {}): void {
    this.log('error', message, metadata);
  }

  // Kritik hata logları
  fatal(message: string, metadata: LogMetadata = {}): void {
    this.log('fatal', message, metadata);
  }
}

// Singleton instance
export const loggerService = new LoggerService(); 