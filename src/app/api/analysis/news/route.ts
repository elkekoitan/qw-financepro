import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, AnalysisRequest } from '@/types/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const limit = Number(searchParams.get('limit')) || 10;
    
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

    // TODO: Gerçek haber API'si entegre edilecek
    // Şimdilik mock veri dönüyoruz
    const mockNews = [
      {
        id: '1',
        title: `${symbol} Güçlü Finansal Sonuçlar Açıkladı`,
        content: 'Şirket beklentilerin üzerinde gelir ve kar açıkladı...',
        source: 'Finans Haberleri',
        url: 'https://example.com/news/1',
        sentiment: 'positive',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
      {
        id: '2',
        title: `${symbol} Yeni Ürün Lansmanı Yapacak`,
        content: 'Şirket gelecek ay yeni ürün lansmanı yapacağını duyurdu...',
        source: 'Tech Haberleri',
        url: 'https://example.com/news/2',
        sentiment: 'positive',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '3',
        title: `${symbol} Hisseleri Piyasa Baskısı Altında`,
        content: 'Genel piyasa koşulları nedeniyle hisseler baskı altında...',
        source: 'Borsa Analiz',
        url: 'https://example.com/news/3',
        sentiment: 'negative',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: '4',
        title: `${symbol} Yeni Ortaklık Anlaşması İmzaladı`,
        content: 'Şirket stratejik büyüme planları kapsamında yeni ortaklık anlaşması imzaladı...',
        source: 'İş Dünyası',
        url: 'https://example.com/news/4',
        sentiment: 'positive',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: '5',
        title: `Analistler ${symbol} İçin Hedef Fiyat Yükseltti`,
        content: 'Önde gelen analistler şirket için hedef fiyat tahminlerini yukarı yönlü revize etti...',
        source: 'Analist Raporları',
        url: 'https://example.com/news/5',
        sentiment: 'positive',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
    ].slice(0, limit);

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      data: mockNews,
    });

  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Haberler getirilirken bir hata oluştu',
    }, { status: 500 });
  }
} 