import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse, UpdateInvestmentProfileRequest, InvestmentProfile } from '@/types/api';

export async function POST(request: Request) {
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

    // Mevcut profili kontrol et
    const { data: existingProfile } = await supabase
      .from('investment_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Kullanıcının zaten bir yatırım profili mevcut',
      }, { status: 400 });
    }

    // Yeni yatırım profili oluştur
    const { data: newProfile, error: createError } = await supabase
      .from('investment_profiles')
      .insert([{
        user_id: session.user.id,
        risk_tolerance: body.riskTolerance,
        investment_goals: body.investmentGoals,
        preferred_investment_types: body.preferredInvestmentTypes,
        investment_horizon: body.investmentHorizon,
        monthly_investment_amount: body.monthlyInvestmentAmount,
        initial_investment_amount: body.initialInvestmentAmount,
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
    return NextResponse.json<ApiResponse<InvestmentProfile>>({
      success: true,
      data: newProfile,
      message: 'Yatırım profili başarıyla oluşturuldu',
    });

  } catch (error) {
    console.error('Investment profile creation error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Yatırım profili oluşturulurken bir hata oluştu',
    }, { status: 500 });
  }
} 