import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, UpdateSettingsRequest } from '@/types/api';

export async function PUT(request: Request) {
  try {
    const body: UpdateSettingsRequest = await request.json();
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

    // Mevcut ayarları kontrol et
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    // Ayarları güncelle veya oluştur
    const updateData = {
      ...existingSettings,
      ...body,
      updated_at: new Date().toISOString(),
    };

    if (!existingSettings) {
      // Yeni ayarlar oluştur
      const { error: createError } = await supabase
        .from('user_settings')
        .insert([{
          user_id: session.user.id,
          ...updateData,
          created_at: new Date().toISOString(),
        }]);

      if (createError) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: createError.message,
        }, { status: 400 });
      }
    } else {
      // Mevcut ayarları güncelle
      const { error: updateError } = await supabase
        .from('user_settings')
        .update(updateData)
        .eq('user_id', session.user.id);

      if (updateError) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: updateError.message,
        }, { status: 400 });
      }
    }

    // Güncellenmiş ayarları getir
    const { data: settings, error: getError } = await supabase
      .from('user_settings')
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
    return NextResponse.json<ApiResponse>({
      success: true,
      data: settings,
      message: 'Ayarlar başarıyla güncellendi',
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Ayarlar güncellenirken bir hata oluştu',
    }, { status: 500 });
  }
} 