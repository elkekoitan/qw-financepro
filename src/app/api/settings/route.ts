import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';
import type { ApiResponse } from '@/types/api';

export async function GET() {
  try {
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

    // Ayarları getir
    const { data: settings, error: getError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (getError) {
      // Ayarlar bulunamadıysa varsayılan ayarları döndür
      if (getError.code === 'PGRST116') {
        const defaultSettings = {
          theme: {
            mode: 'light',
            primaryColor: '#2563eb',
            fontSize: 'medium',
            borderRadius: 8,
            animations: true,
          },
          notifications: {
            email: {
              enabled: true,
              dailySummary: true,
              weeklyReport: true,
              priceAlerts: true,
              newsAlerts: true,
            },
            push: {
              enabled: true,
              tradeConfirmations: true,
              priceAlerts: true,
              securityAlerts: true,
            },
            sms: {
              enabled: false,
              criticalAlerts: true,
              loginAlerts: true,
            },
          },
          privacy: {
            profileVisibility: 'private',
            showEmail: false,
            showPhone: false,
            showActivity: true,
            allowDataCollection: true,
            marketingEmails: false,
          },
          security: {
            twoFactorEnabled: false,
            twoFactorMethod: 'app',
            sessionTimeout: 30,
          },
          language: {
            language: 'tr',
            dateFormat: 'DD.MM.YYYY',
            timeFormat: '24h',
            timezone: 'Europe/Istanbul',
            currency: 'TRY',
            numberFormat: 'tr-TR',
          },
        };

        // Varsayılan ayarları kaydet
        const { error: createError } = await supabase
          .from('user_settings')
          .insert([{
            user_id: session.user.id,
            ...defaultSettings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (createError) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: createError.message,
          }, { status: 400 });
        }

        return NextResponse.json<ApiResponse>({
          success: true,
          data: defaultSettings,
        });
      }

      return NextResponse.json<ApiResponse>({
        success: false,
        error: getError.message,
      }, { status: 400 });
    }

    // Başarılı yanıt
    return NextResponse.json<ApiResponse>({
      success: true,
      data: settings,
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Ayarlar getirilirken bir hata oluştu',
    }, { status: 500 });
  }
} 