import { NextResponse } from 'next/server';
import type { LoginRequest, ApiResponse, AuthResponse } from '@/types/api';
import { ensureUser } from '@/utils/type-guards';
import { createSupabaseServerClient } from '@/utils/supabase-server';

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validasyon
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'E-posta ve parola zorunludur',
      }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();

    // Giriş yap
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 401 });
    }

    try {
      const verifiedUser = ensureUser(user);
      return NextResponse.json<ApiResponse<AuthResponse>>({
        success: true,
        data: {
          user: verifiedUser,
          token: session?.access_token || '',
        },
        message: 'Giriş başarılı',
      });
    } catch (userError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Kullanıcı bilgileri alınamadı',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Giriş yapılırken bir hata oluştu',
    }, { status: 500 });
  }
} 