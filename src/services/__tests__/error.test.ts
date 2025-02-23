import { errorService, AppError } from '../error';

describe('Error Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    it('should format AppError correctly', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 400, { foo: 'bar' });
      const formattedError = errorService.handleError(error);

      expect(formattedError).toEqual({
        message: 'Test error',
        code: 'TEST_ERROR',
        statusCode: 400,
      });
    });

    it('should format generic Error correctly', () => {
      const error = new Error('Something went wrong');
      const formattedError = errorService.handleError(error);

      expect(formattedError).toEqual({
        message: 'Bir hata oluştu',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      });
    });
  });

  describe('error factories', () => {
    it('should create validation error', () => {
      const error = errorService.validationError('Invalid input', { field: 'email' });

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.metadata).toEqual({ field: 'email' });
    });

    it('should create authentication error', () => {
      const error = errorService.authenticationError('Invalid credentials');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Invalid credentials');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(401);
    });

    it('should create authorization error', () => {
      const error = errorService.authorizationError('Insufficient permissions');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Insufficient permissions');
      expect(error.code).toBe('AUTHORIZATION_ERROR');
      expect(error.statusCode).toBe(403);
    });

    it('should create not found error', () => {
      const error = errorService.notFoundError('Resource not found');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe('NOT_FOUND_ERROR');
      expect(error.statusCode).toBe(404);
    });

    it('should create conflict error', () => {
      const error = errorService.conflictError('Resource already exists');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Resource already exists');
      expect(error.code).toBe('CONFLICT_ERROR');
      expect(error.statusCode).toBe(409);
    });

    it('should create rate limit error', () => {
      const error = errorService.rateLimitError('Too many requests');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Too many requests');
      expect(error.code).toBe('RATE_LIMIT_ERROR');
      expect(error.statusCode).toBe(429);
    });

    it('should create database error', () => {
      const error = errorService.databaseError('Database connection failed');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Database connection failed');
      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
    });

    it('should create external service error', () => {
      const error = errorService.externalServiceError('External API failed');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('External API failed');
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(error.statusCode).toBe(502);
    });
  });

  describe('AppError class', () => {
    it('should set default status code to 500', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      expect(error.statusCode).toBe(500);
    });

    it('should set default metadata to empty object', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      expect(error.metadata).toEqual({});
    });

    it('should capture stack trace', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      expect(error.stack).toBeDefined();
    });

    it('should set error name to constructor name', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      expect(error.name).toBe('AppError');
    });
  });
}); 