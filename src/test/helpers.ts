import type { NextRequest } from 'next/server';

export function createMockRequest(options: {
  method?: string;
  url: string;
  headers?: Record<string, string>;
}): NextRequest {
  const { method = 'GET', url, headers = {} } = options;

  return {
    method,
    url,
    nextUrl: new URL(url),
    headers: new Headers(headers),
  } as NextRequest;
} 