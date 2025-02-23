import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, AnalysisRequest } from '@/types/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
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

    // TODO: Gerçek market verisi API'si entegre edilecek
    // Şimdilik mock veri dönüyoruz
    const mockMarketData = {
      symbol: symbol.toUpperCase(),
      price: 150.25,
      change: 2.5,
      changePercent: 1.67,
      volume: 1500000,
      marketCap: 2000000000,
      lastUpdated: new Date().toISOString(),
      dayRange: {
        low: 148.50,
        high: 151.75
      },
      yearRange: {
        low: 120.25,
        high: 175.50
      },
      pe: 22.5,
      eps: 6.67,
      dividend: 1.2,
      dividendYield: 0.8,
    };

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      data: mockMarketData,
    });

  } catch (error) {
    console.error('Market data fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Market verisi getirilirken bir hata oluştu',
    }, { status: 500 });
  }
} 