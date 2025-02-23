import { NextRequest } from 'next/server';
import { rateLimitMiddleware } from '../rateLimit';
import { RateLimitError } from '@/services/error';

jest.mock('../../services/logger');

describe('Rate Limit Middleware', () => {
  let request: NextRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    request = new NextRequest('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'x-forwarded-for': '127.0.0.1'
      }
    });
  });

  it('should handle rate limit correctly', async () => {
    // İlk istek başarılı olmalı
    const firstResponse = await rateLimitMiddleware(request);
    expect(firstResponse.status).toBe(200);

    // Limit aşıldığında 429 dönmeli
    for (let i = 0; i < 60; i++) {
      await rateLimitMiddleware(request);
    }

    const lastResponse = await rateLimitMiddleware(request);
    expect(lastResponse.status).toBe(429);
    
    const responseBody = await lastResponse.json();
    expect(responseBody).toEqual({
      success: false,
      error: {
        code: 'RATE_LIMIT_ERROR',
        message: 'Too many requests'
      }
    });

    expect(lastResponse.headers.get('Retry-After')).toBe('60');
  });

  it('should allow requests within limit', async () => {
    // Limit içindeki istekler başarılı olmalı
    for (let i = 0; i < 50; i++) {
      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(200);
    }
  });

  it('should reset rate limit after time window', async () => {
    // İlk 50 istek
    for (let i = 0; i < 50; i++) {
      await rateLimitMiddleware(request);
    }

    // Zaman penceresinin geçmesini simüle et
    jest.advanceTimersByTime(60000);

    // Yeni istekler başarılı olmalı
    const response = await rateLimitMiddleware(request);
    expect(response.status).toBe(200);
  });
}); 