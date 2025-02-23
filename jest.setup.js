require('@testing-library/jest-dom');

// Fake timers'ı etkinleştir
jest.useFakeTimers();

// Global tanımlamalar
global.setImmediate = jest.fn();

// Mock sınıflar
class MockHeaders {
  constructor(init = {}) {
    this._headers = new Map(Object.entries(init));
  }

  get(name) {
    return this._headers.get(name.toLowerCase()) || null;
  }

  set(name, value) {
    this._headers.set(name.toLowerCase(), value);
  }
}

class MockNextRequest {
  constructor(input, init = {}) {
    this.url = input;
    this.method = init.method || 'GET';
    this.headers = new MockHeaders(init.headers || {});
    this.nextUrl = new URL(input);
    this.cookies = new Map();
  }

  get ip() {
    return this.headers.get('x-forwarded-for') || '127.0.0.1';
  }
}

class MockNextResponse {
  constructor(body, init = {}) {
    this.status = init.status || 200;
    this.headers = new MockHeaders(init.headers);
    this.body = body;
  }

  static json(body, init) {
    return new MockNextResponse(body, init);
  }
}

// Redis mock
const mockRedis = {
  pipeline: jest.fn().mockReturnThis(),
  zremrangebyscore: jest.fn().mockReturnThis(),
  zadd: jest.fn().mockReturnThis(),
  zcard: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([[null, 1], [null, 1], [null, 1]])
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => mockRedis);
});

// Next.js mock'ları
jest.mock('next/server', () => ({
  NextRequest: MockNextRequest,
  NextResponse: MockNextResponse
}));

// Next.js navigation mock
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  }
})); 