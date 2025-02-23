import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, AnalysisRequest } from '@/types/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const timeframe = searchParams.get('timeframe') || '1D';
    
    if (!symbol) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Sembol parametresi gerekli',
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

    // Mevcut oturumu kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Oturum bulunamadı',
      }, { status: 401 });
    }

    // TODO: Gerçek grafik verisi API'si entegre edilecek
    // Şimdilik mock veri dönüyoruz
    const mockChartData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      const basePrice = 150;
      const randomChange = (Math.random() - 0.5) * 5;
      const price = basePrice + randomChange;
      
      return {
        timestamp: date.toISOString(),
        open: price - 0.5,
        high: price + 1,
        low: price - 1,
        close: price + 0.5,
        volume: Math.floor(Math.random() * 1000000) + 500000,
      };
    });

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        symbol,
        timeframe,
        chartData: mockChartData,
      },
    });

  } catch (error) {
    console.error('Chart data fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Grafik verisi getirilirken bir hata oluştu',
    }, { status: 500 });
  }
} 