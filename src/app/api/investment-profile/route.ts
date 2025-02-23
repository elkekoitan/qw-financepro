import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, InvestmentProfile } from '@/types/api';

export async function GET() {
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

    // Mevcut oturumu kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Oturum bulunamadı',
      }, { status: 401 });
    }

    // Yatırım profilini getir
    const { data: profile, error: getError } = await supabase
      .from('investment_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (getError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: getError.message,
      }, { status: 400 });
    }

    // Başarılı yanıt
    return NextResponse.json<ApiResponse<InvestmentProfile>>({
      success: true,
      data: profile,
    });

  } catch (error) {
    console.error('Investment profile fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Yatırım profili getirilirken bir hata oluştu',
    }, { status: 500 });
  }
}