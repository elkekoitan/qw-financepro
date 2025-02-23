# Supabase Kullanım Kılavuzu

Bu doküman, FinancialPro projesinde Supabase'in nasıl kullanılacağına dair kapsamlı bir rehber sunar.

## İçindekiler

1. [Supabase İstemci Kurulumu](#supabase-i̇stemci-kurulumu)
2. [Kimlik Doğrulama](#kimlik-doğrulama)
3. [Veritabanı İşlemleri](#veritabanı-i̇şlemleri)
4. [Gerçek Zamanlı Özellikler](#gerçek-zamanlı-özellikler)
5. [Depolama](#depolama)
6. [Edge Functions](#edge-functions)
7. [En İyi Uygulamalar](#en-i̇yi-uygulamalar)

## Supabase İstemci Kurulumu

### Bağımlılıkların Yüklenmesi

```bash
npm install @supabase/supabase-js
# veya
yarn add @supabase/supabase-js
```

### İstemci Yapılandırması

```javascript
// src/infrastructure/db.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;
```

## Kimlik Doğrulama

### E-posta/Parola ile Kayıt

```javascript
const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Kayıt hatası:', error.message);
    throw error;
  }
};
```

### Google ile Giriş

```javascript
const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google giriş hatası:', error.message);
    throw error;
  }
};
```

### Oturum Yönetimi

```javascript
// Oturum kontrolü
const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Oturum kontrolü hatası:', error.message);
    return null;
  }
};

// Oturumu kapat
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Çıkış hatası:', error.message);
    throw error;
  }
};
```

## Veritabanı İşlemleri

### Veri Ekleme

```javascript
const createInvestmentProfile = async (profileData) => {
  try {
    const { data, error } = await supabase
      .from('investment_profiles')
      .insert([profileData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Profil oluşturma hatası:', error.message);
    throw error;
  }
};
```

### Veri Sorgulama

```javascript
const getInvestmentProfiles = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('investment_profiles')
      .select(`
        id,
        risk_level,
        target_return,
        created_at,
        transactions (
          id,
          amount,
          type
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Profil sorgulama hatası:', error.message);
    throw error;
  }
};
```

### Veri Güncelleme

```javascript
const updateProfile = async (profileId, updates) => {
  try {
    const { data, error } = await supabase
      .from('investment_profiles')
      .update(updates)
      .eq('id', profileId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Profil güncelleme hatası:', error.message);
    throw error;
  }
};
```

## Gerçek Zamanlı Özellikler

### Fiyat Güncellemelerini Dinleme

```javascript
const subscribeToPriceUpdates = (callback) => {
  const subscription = supabase
    .channel('price_updates')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'asset_prices',
    }, payload => {
      callback(payload.new);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
```

### Portföy Değişikliklerini İzleme

```javascript
const subscribeToPortfolioChanges = (portfolioId, callback) => {
  const subscription = supabase
    .channel(`portfolio_${portfolioId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'portfolio_assets',
      filter: `portfolio_id=eq.${portfolioId}`
    }, payload => {
      callback(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
```

## Depolama

### Dosya Yükleme

```javascript
const uploadProfileImage = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error.message);
    throw error;
  }
};
```

### Dosya İndirme URL'i Alma

```javascript
const getProfileImageUrl = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 3600);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('URL oluşturma hatası:', error.message);
    throw error;
  }
};
```

## Edge Functions

### Edge Function Çağırma

```javascript
const generateReport = async (reportData) => {
  try {
    const { data, error } = await supabase.functions
      .invoke('generate-report', {
        body: JSON.stringify(reportData)
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Rapor oluşturma hatası:', error.message);
    throw error;
  }
};
```

## En İyi Uygulamalar

### 1. Hata Yönetimi

```javascript
const handleSupabaseError = (error) => {
  if (error.code === 'PGRST301') {
    return 'Yetkilendirme hatası';
  } else if (error.code === 'P0001') {
    return 'Veri doğrulama hatası';
  }
  return 'Bir hata oluştu';
};
```

### 2. Bağlantı Yönetimi

```javascript
const initSupabase = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('Oturum açıldı:', session.user.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('Oturum kapatıldı');
    }
  });
};
```

### 3. Performans Optimizasyonu

```javascript
// Sayfalama örneği
const getPaginatedData = async (page, pageSize) => {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('large_table')
    .select('*')
    .range(from, to);

  return { data, error };
};

// Önbellekleme örneği
const getCachedData = async (key) => {
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const { data } = await supabase
    .from('table')
    .select('*');

  localStorage.setItem(key, JSON.stringify(data));
  return data;
};
```

### 4. Güvenlik

```javascript
// RLS politikalarını test etme
const testRLSPolicies = async () => {
  try {
    // Normal kullanıcı olarak test
    const { data: userData, error: userError } = await supabase
      .from('protected_table')
      .select('*');

    // Admin olarak test
    const { data: adminData, error: adminError } = await supabase
      .from('protected_table')
      .select('*')
      .eq('role', 'admin');

    return {
      userAccess: !userError,
      adminAccess: !adminError
    };
  } catch (error) {
    console.error('RLS test hatası:', error.message);
    throw error;
  }
};
```

## Yardımcı Fonksiyonlar

```javascript
export const supabaseHelpers = {
  // Oturum yönetimi
  auth: {
    signUp,
    signInWithGoogle,
    signOut,
    checkSession
  },
  
  // Veritabanı işlemleri
  db: {
    createInvestmentProfile,
    getInvestmentProfiles,
    updateProfile
  },
  
  // Gerçek zamanlı özellikler
  realtime: {
    subscribeToPriceUpdates,
    subscribeToPortfolioChanges
  },
  
  // Depolama işlemleri
  storage: {
    uploadProfileImage,
    getProfileImageUrl
  },
  
  // Edge functions
  functions: {
    generateReport
  }
};
```

## Hata Kodları ve Çözümleri

| Kod | Açıklama | Çözüm |
|-----|-----------|--------|
| PGRST301 | Yetkilendirme hatası | Oturum durumunu kontrol edin |
| P0001 | Veri doğrulama hatası | Giriş verilerini kontrol edin |
| 23505 | Benzersizlik ihlali | Yinelenen değerleri kontrol edin |
| 42P01 | Tablo bulunamadı | Tablo adını kontrol edin |

_Son Güncelleme: 15 Mart 2024_ 