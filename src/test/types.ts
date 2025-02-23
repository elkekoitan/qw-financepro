import { NextRequest } from 'next/server';

// Test için mock request seçenekleri
export interface MockRequestOptions {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
}

// Test için mock yanıt seçenekleri
export interface MockResponseOptions {
  status?: number;
  headers?: Record<string, string>;
  body?: any;
}

// Test için mock kullanıcı tipi
export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Test için mock oturum tipi
export interface MockSession {
  user: MockUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Test için mock hata tipi
export interface MockError {
  message: string;
  code: string;
  statusCode: number;
}

// Test için mock yanıt tipi
export interface MockResponse<T = any> {
  success: boolean;
  data: T | null;
  error: MockError | null;
}

// Test için mock Redis client tipi
export interface MockRedisClient {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  del(key: string): Promise<void>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zcard(key: string): Promise<number>;
  zremrangebyscore(key: string, min: number, max: number): Promise<void>;
  pipeline(): MockRedisClient;
  exec(): Promise<any[]>;
}

// Test için mock logger tipi
export interface MockLogger {
  trace(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  fatal(message: string, ...args: any[]): void;
}

// Test için mock Supabase client tipi
export interface MockSupabaseClient {
  auth: {
    getSession(): Promise<{ data: { session: MockSession | null }; error: MockError | null }>;
    signInWithPassword(credentials: { email: string; password: string }): Promise<{ data: { user: MockUser; session: MockSession } | null; error: MockError | null }>;
    signInWithOAuth(options: { provider: string }): Promise<{ data: any; error: MockError | null }>;
    signUp(credentials: { email: string; password: string }): Promise<{ data: { user: MockUser } | null; error: MockError | null }>;
    signOut(): Promise<{ error: MockError | null }>;
  };
  from(table: string): {
    select(columns?: string): any;
    insert(data: any[]): any;
    update(data: any): any;
    delete(): any;
    eq(column: string, value: any): any;
    single(): Promise<{ data: any; error: MockError | null }>;
    range(start: number, end: number): any;
    order(column: string, options?: { ascending?: boolean }): any;
    limit(count: number): any;
  };
} 