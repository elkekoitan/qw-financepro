import { logger } from '../logger';

jest.mock('pino', () => {
  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  };
  return jest.fn(() => mockLogger);
});

describe('Logger Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log request', () => {
    const message = 'Test request';
    const metadata = { path: '/test', requestId: '123' };
    
    logger.logRequest(message, metadata);
    
    expect(logger.info).toHaveBeenCalledWith(
      { ...metadata },
      message
    );
  });

  it('should log response', () => {
    const message = 'Test response';
    const metadata = { path: '/test', responseTime: 100 };
    
    logger.logResponse(message, metadata);
    
    expect(logger.info).toHaveBeenCalledWith(
      { ...metadata },
      message
    );
  });

  it('should log error', () => {
    const message = 'Test error';
    const metadata = { error: new Error('test'), stack: 'test stack' };
    
    logger.logError(message, metadata);
    
    expect(logger.error).toHaveBeenCalledWith(
      { ...metadata },
      message
    );
  });

  it('should log performance', () => {
    const message = 'Test performance';
    const metadata = { operation: 'test', duration: 100 };
    
    logger.logPerformance(message, metadata);
    
    expect(logger.info).toHaveBeenCalledWith(
      { ...metadata },
      message
    );
  });

  it('should log security', () => {
    const message = 'Test security';
    const metadata = { userId: '123', action: 'login' };
    
    logger.logSecurity(message, metadata);
    
    expect(logger.warn).toHaveBeenCalledWith(
      { ...metadata },
      message
    );
  });

  it('should log audit', () => {
    const message = 'Test audit';
    const metadata = { userId: '123', action: 'update' };
    
    logger.logAudit(message, metadata);
    
    expect(logger.info).toHaveBeenCalledWith(
      { ...metadata },
      message
    );
  });

  it('should log debug', () => {
    const message = 'Test debug';
    const metadata = { component: 'test', data: { foo: 'bar' } };
    
    logger.debug(message, metadata);
    
    expect(logger.debug).toHaveBeenCalledWith(
      message,
      { ...metadata }
    );
  });
}); 