import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { UpdateProfileRequest, ApiResponse } from '@/types/api';

export async function PUT(request: Request) {
  try {
    const body: UpdateProfileRequest = await request.json();
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

    // Profili güncelle
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: body.fullName,
        phone: body.phone,
        country: body.country,
        city: body.city,
        avatar_url: body.avatarUrl,
        notification_preferences: body.notificationPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (updateError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: updateError.message,
      }, { status: 400 });
    }

    // Güncellenmiş profili getir
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (getError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: getError.message,
      }, { status: 400 });
    }

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      data: profile,
      message: 'Profil başarıyla güncellendi',
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Profil güncellenirken bir hata oluştu',
    }, { status: 500 });
  }
} 