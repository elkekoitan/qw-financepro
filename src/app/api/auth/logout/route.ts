import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse } from '@/types/api';

export async function POST() {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value ?? '';
          },
          async set(name: string, value: string, options: CookieOptions) {
            const cookieStore = await cookies();
            cookieStore.set(name, value, { ...options, path: '/' });
          },
          async remove(name: string) {
            const cookieStore = await cookies();
            cookieStore.set(name, '', { path: '/', maxAge: 0 });
          }
        }
      }
    );

    // Oturumu kapat
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 400 });
    }

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Oturum başarıyla kapatıldı',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Oturum kapatılırken bir hata oluştu',
    }, { status: 500 });
  }
} 