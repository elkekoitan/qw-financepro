import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { RegisterRequest, ApiResponse, AuthResponse } from '@/types/api';
import { ensureUser } from '@/utils/type-guards';

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, fullName } = body;

    // Validasyon
    if (!email || !password || !fullName) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Tüm alanlar zorunludur',
      }, { status: 400 });
    }

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

    // Kayıt ol
    const { data: { user, session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 400 });
    }

    try {
      const verifiedUser = ensureUser(user);
      
      // Kullanıcı profili oluştur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: verifiedUser.id,
            full_name: fullName,
            email: email,
          },
        ]);

      if (profileError) {
        // Profil oluşturulamazsa kullanıcıyı sil
        await supabase.auth.admin.deleteUser(verifiedUser.id);
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Profil oluşturulurken bir hata oluştu',
        }, { status: 500 });
      }

      return NextResponse.json<ApiResponse<AuthResponse>>({
        success: true,
        data: {
          user: verifiedUser,
          token: session?.access_token || '',
        },
        message: 'Kayıt başarılı',
      });
    } catch (userError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Kullanıcı oluşturulamadı',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Kayıt olurken bir hata oluştu',
    }, { status: 500 });
  }
} 