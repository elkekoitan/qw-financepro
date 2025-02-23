import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, CreateReportRequest, Report } from '@/types/api';

export async function POST(request: Request) {
  try {
    const body: CreateReportRequest = await request.json();
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

    // TODO: Gerçek rapor oluşturma mantığı eklenecek
    // Şimdilik mock veri oluşturuyoruz
    const mockReportData = {
      portfolioValue: 150000,
      performance: {
        daily: 2.5,
        weekly: -1.2,
        monthly: 5.8,
        yearly: 15.3,
      },
      assetAllocation: {
        stocks: 60,
        bonds: 25,
        cash: 10,
        crypto: 5,
      },
      topHoldings: [
        { symbol: 'AAPL', weight: 15, value: 22500 },
        { symbol: 'MSFT', weight: 12, value: 18000 },
        { symbol: 'GOOGL', weight: 10, value: 15000 },
      ],
      riskMetrics: {
        volatility: 12.5,
        beta: 1.1,
        sharpeRatio: 1.8,
      },
    };

    // Raporu veritabanına kaydet
    const { data: report, error: createError } = await supabase
      .from('reports')
      .insert([{
        user_id: session.user.id,
        title: body.title,
        description: body.description,
        type: body.type,
        date_range: body.dateRange,
        filters: body.filters,
        data: mockReportData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (createError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: createError.message,
      }, { status: 400 });
    }

    // Başarılı yanıt
    return NextResponse.json<ApiResponse<Report>>({
      success: true,
      data: report,
      message: 'Rapor başarıyla oluşturuldu',
    });

  } catch (error) {
    console.error('Report creation error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Rapor oluşturulurken bir hata oluştu',
    }, { status: 500 });
  }
}