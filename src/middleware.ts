'use client';

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/auth/callback'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Gelen isteğin yolu
  const path = req.nextUrl.pathname;

  // Public path kontrolü
  const isPublicPath = PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));

  // Oturum açmış kullanıcılar auth sayfalarına erişmeye çalışırsa dashboard'a yönlendir
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Oturum açmamış kullanıcılar public olmayan sayfalara erişmeye çalışırsa login'e yönlendir
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// Tüm sayfalar için middleware'i çalıştır
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 