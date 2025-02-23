import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/api';
import { createSupabaseServerClient } from '@/utils/supabase-server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    // Mevcut oturumu kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Oturum bulunamadı',
      }, { status: 401 });
    }

    // Profili getir
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
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Profil getirilirken bir hata oluştu',
    }, { status: 500 });
  }
} 