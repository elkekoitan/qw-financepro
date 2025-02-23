import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse } from '@/types/api';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    // Raporun kullanıcıya ait olduğunu kontrol et
    const { data: report, error: getError } = await supabase
      .from('reports')
      .select('id')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (getError || !report) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Rapor bulunamadı veya bu işlem için yetkiniz yok',
      }, { status: 404 });
    }

    // Raporu sil
    const { error: deleteError } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (deleteError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: deleteError.message,
      }, { status: 400 });
    }

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Rapor başarıyla silindi',
    });

  } catch (error) {
    console.error('Report delete error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Rapor silinirken bir hata oluştu',
    }, { status: 500 });
  }
} 