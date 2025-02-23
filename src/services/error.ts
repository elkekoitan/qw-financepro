import { logger } from './logger';

// Temel hata sınıfı
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public metadata: Record<string, any> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Doğrulama hatası
export class ValidationError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'VALIDATION_ERROR', 400, metadata);
  }
}

// Kimlik doğrulama hatası
export class AuthenticationError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'AUTHENTICATION_ERROR', 401, metadata);
  }
}

// Yetkilendirme hatası
export class AuthorizationError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'AUTHORIZATION_ERROR', 403, metadata);
  }
}

// Bulunamadı hatası
export class NotFoundError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'NOT_FOUND_ERROR', 404, metadata);
  }
}

// Çakışma hatası
export class ConflictError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'CONFLICT_ERROR', 409, metadata);
  }
}

// Rate limit hatası
export class RateLimitError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'RATE_LIMIT_ERROR', 429, metadata);
  }
}

// Veritabanı hatası
export class DatabaseError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'DATABASE_ERROR', 500, metadata);
  }
}

// Dış servis hatası
export class ExternalServiceError extends AppError {
  constructor(message: string, metadata: Record<string, any> = {}) {
    super(message, 'EXTERNAL_SERVICE_ERROR', 502, metadata);
  }
}

// Hata işleme servisi
class ErrorService {
  // Hata logla ve formatla
  handleError(error: Error | AppError): {
    message: string;
    code: string;
    statusCode: number;
  } {
    let formattedError;

    if (error instanceof AppError) {
      formattedError = {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      };

      // Hata detaylarını logla
      logger.logError(error.message, {
        errorCode: error.code,
        statusCode: error.statusCode,
        metadata: error.metadata,
        error,
      });
    } else {
      formattedError = {
        message: 'Bir hata oluştu',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      };

      // Beklenmeyen hatayı logla
      logger.logError('Beklenmeyen hata', {
        error,
      });
    }

    return formattedError;
  }

  // Validasyon hatası oluştur
  validationError(message: string, metadata?: Record<string, any>): ValidationError {
    return new ValidationError(message, metadata);
  }

  // Kimlik doğrulama hatası oluştur
  authenticationError(message: string, metadata?: Record<string, any>): AuthenticationError {
    return new AuthenticationError(message, metadata);
  }

  // Yetkilendirme hatası oluştur
  authorizationError(message: string, metadata?: Record<string, any>): AuthorizationError {
    return new AuthorizationError(message, metadata);
  }

  // Bulunamadı hatası oluştur
  notFoundError(message: string, metadata?: Record<string, any>): NotFoundError {
    return new NotFoundError(message, metadata);
  }

  // Çakışma hatası oluştur
  conflictError(message: string, metadata?: Record<string, any>): ConflictError {
    return new ConflictError(message, metadata);
  }

  // Rate limit hatası oluştur
  rateLimitError(message: string, metadata?: Record<string, any>): RateLimitError {
    return new RateLimitError(message, metadata);
  }

  // Veritabanı hatası oluştur
  databaseError(message: string, metadata?: Record<string, any>): DatabaseError {
    return new DatabaseError(message, metadata);
  }

  // Dış servis hatası oluştur
  externalServiceError(message: string, metadata?: Record<string, any>): ExternalServiceError {
    return new ExternalServiceError(message, metadata);
  }
}

// Singleton instance
export const errorService = new ErrorService(); 