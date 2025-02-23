import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { ApiResponse, AnalysisRequest } from '@/types/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const indicators = searchParams.get('indicators')?.split(',') || ['RSI', 'MACD', 'MA'];
    
    if (!symbol) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Sembol parametresi gerekli',
      }, { status: 400 });
    }

    const cookieStore = cookies();
    const response = NextResponse.next();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name) {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value ?? '';
          },
          async set(name, value, options) {
            const cookieStore = await cookies();
            cookieStore.set(name, value, { ...options, path: '/' });
          },
          async remove(name) {
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

    // TODO: Gerçek teknik analiz API'si entegre edilecek
    // Şimdilik mock veri dönüyoruz
    const mockTechnicalIndicators = [
      {
        name: 'RSI',
        value: 65.5,
        signal: 'neutral',
        description: '14 günlük RSI göstergesi nötr bölgede.',
      },
      {
        name: 'MACD',
        value: 0.75,
        signal: 'buy',
        description: 'MACD çizgisi sinyal çizgisini yukarı yönde kesti.',
      },
      {
        name: 'MA',
        value: 148.50,
        signal: 'buy',
        description: 'Fiyat 50 günlük hareketli ortalamanın üzerinde.',
      },
      {
        name: 'Bollinger',
        value: 150.25,
        signal: 'neutral',
        description: 'Fiyat Bollinger bantları içinde hareket ediyor.',
      },
      {
        name: 'Stochastic',
        value: 80,
        signal: 'sell',
        description: 'Stochastic osilatör aşırı alım bölgesinde.',
      }
    ].filter(indicator => indicators.includes(indicator.name));

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      data: mockTechnicalIndicators,
    });

  } catch (error) {
    console.error('Technical indicators fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Teknik göstergeler getirilirken bir hata oluştu',
    }, { status: 500 });
  }
}