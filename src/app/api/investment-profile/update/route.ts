import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, UpdateInvestmentProfileRequest, InvestmentProfile } from '@/types/api';

export async function PUT(request: Request) {
  try {
    const body: UpdateInvestmentProfileRequest = await request.json();
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

    // Yatırım profilini güncelle
    const { error: updateError } = await supabase
      .from('investment_profiles')
      .update({
        risk_tolerance: body.riskTolerance,
        investment_goals: body.investmentGoals,
        preferred_investment_types: body.preferredInvestmentTypes,
        investment_horizon: body.investmentHorizon,
        monthly_investment_amount: body.monthlyInvestmentAmount,
        initial_investment_amount: body.initialInvestmentAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id);

    if (updateError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: updateError.message,
      }, { status: 400 });
    }

    // Güncellenmiş yatırım profilini getir
    const { data: profile, error: getError } = await supabase
      .from('investment_profiles')
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
    return NextResponse.json<ApiResponse<InvestmentProfile>>({
      success: true,
      data: profile,
      message: 'Yatırım profili başarıyla güncellendi',
    });

  } catch (error) {
    console.error('Investment profile update error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Yatırım profili güncellenirken bir hata oluştu',
    }, { status: 500 });
  }
}