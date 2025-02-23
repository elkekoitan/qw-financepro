import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.getSession();

  // Korumalı rotalar için kontrol
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/investment-profile',
    '/analysis',
    '/reports',
    '/settings',
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    // Kullanıcı oturum açmamışsa login sayfasına yönlendir
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Auth sayfalarına giriş yapmış kullanıcı erişmeye çalışırsa
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthRoute && session) {
    // Kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

// Middleware'in çalışacağı rotaları belirt
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/investment-profile/:path*',
    '/analysis/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}; 