import { NextRequest, NextResponse } from 'next/server';
import type { AppError, RateLimitError } from '@/services/error';
import { logger } from '@/services/logger';

// Hata işleme middleware'i
export async function errorHandler(error: AppError, request: NextRequest) {
  // Hata detaylarını hazırla
  const errorDetails = {
    path: request.nextUrl?.pathname,
    method: request.method,
    timestamp: new Date().toISOString(),
    requestId: request.headers.get('x-request-id') ?? undefined,
    userId: request.headers.get('x-user-id') ?? undefined,
    error: {
      code: error.code,
      message: error.message,
      stack: error.stack
    }
  };

  // Hatayı logla
  logger.logError(error.message, errorDetails);

  // Hata yanıtını hazırla
  return NextResponse.json(
    {
      error: {
        code: error.code,
        message: error.message
      }
    },
    { status: error.statusCode }
  );
}

// Not Found middleware'i
export async function notFoundHandler(request: NextRequest) {
  logger.logError('Endpoint bulunamadı', {
    path: request.nextUrl?.pathname,
    method: request.method,
  });

  return NextResponse.json(
    {
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint bulunamadı'
      }
    },
    { status: 404 }
  );
}

// Rate limit middleware'i
export async function rateLimitHandler(error: RateLimitError) {
  return NextResponse.json(
    {
      error: {
        code: error.code,
        message: error.message
      }
    },
    {
      status: 429,
      headers: new Headers({
        'Retry-After': '60',
        'Content-Type': 'application/json'
      })
    }
  );
}

// Validasyon middleware'i
export async function validationHandler(request: NextRequest, errors: any[]) {
  logger.logError('Validasyon hatası', {
    path: request.nextUrl.pathname,
    method: request.method,
    errors,
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Validasyon hatası',
        code: 'VALIDATION_ERROR',
        errors,
      },
    },
    { status: 400 }
  );
}

// Kimlik doğrulama middleware'i
export async function authenticationHandler(request: NextRequest) {
  logger.logError('Kimlik doğrulama hatası', {
    path: request.nextUrl.pathname,
    method: request.method,
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Bu işlem için giriş yapmanız gerekiyor',
        code: 'AUTHENTICATION_REQUIRED',
      },
    },
    { status: 401 }
  );
}

// Yetkilendirme middleware'i
export async function authorizationHandler(request: NextRequest) {
  logger.logError('Yetkilendirme hatası', {
    path: request.nextUrl.pathname,
    method: request.method,
    userId: request.headers.get('x-user-id') ?? undefined,
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Bu işlem için yetkiniz yok',
        code: 'AUTHORIZATION_REQUIRED',
      },
    },
    { status: 403 }
  );
} 