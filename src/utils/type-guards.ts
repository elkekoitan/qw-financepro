import type { User } from '@supabase/supabase-js';

export function assertUser(user: User | null): asserts user is User {
  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }
}

export function isUser(user: User | null): user is User {
  return user !== null;
}

export function ensureUser(user: User | null): User {
  if (!user) {
    throw new Error('Kullanıcı bulunamadı');
  }
  return user;
} 