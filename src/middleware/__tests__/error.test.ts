import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, notFoundHandler, rateLimitHandler } from '../error';
import { AppError, RateLimitError } from '@/services/error';

describe('Error Middleware', () => {
  const mockRequest = new NextRequest('http://localhost:3000/api/test', {
    method: 'GET'
  });

  it('should handle AppError correctly', async () => {
    const error = new AppError('Test error', 'TEST_ERROR', 400);
    const response = await errorHandler(error, mockRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(400);
  });

  it('should handle RateLimitError correctly', async () => {
    const error = new RateLimitError('Too many requests');
    const response = await rateLimitHandler(error);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeDefined();
  });

  it('should handle not found correctly', async () => {
    const response = await notFoundHandler(mockRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(404);
  });
}); 