import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, Report } from '@/types/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = Number(searchParams.get('limit')) || 10;
    const offset = Number(searchParams.get('offset')) || 0;

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

    // Raporları getir
    let query = supabase
      .from('reports')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Tip filtresi varsa ekle
    if (type) {
      query = query.eq('type', type);
    }

    const { data: reports, error: getError, count } = await query;

    if (getError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: getError.message,
      }, { status: 400 });
    }

    // Toplam rapor sayısını getir
    const { count: totalCount } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('type', type);

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        reports,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: (offset + limit) < totalCount!,
        },
      },
    });

  } catch (error) {
    console.error('Reports fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Raporlar getirilirken bir hata oluştu',
    }, { status: 500 });
  }
} 