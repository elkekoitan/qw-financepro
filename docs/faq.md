# Sıkça Sorulan Sorular (SSS)

## Genel Sorular

### FinancialPro nedir?
FinancialPro, Clean Architecture prensiplerine uygun olarak geliştirilmiş, modern ve güvenli bir finans yönetim platformudur. Supabase altyapısını kullanarak gerçek zamanlı veri senkronizasyonu, güvenli kimlik doğrulama ve ölçeklenebilir depolama çözümleri sunar.

### Hangi teknolojiler kullanılıyor?
- Backend: Node.js, Express.js
- Veritabanı: PostgreSQL (Supabase)
- Kimlik Doğrulama: Supabase Auth, JWT, Google OAuth
- Gerçek Zamanlı: Supabase Realtime
- AI/ML: TensorFlow.js
- Test: Jest, Supertest

## Kurulum ve Yapılandırma

### Projeyi nasıl kurabilirim?
1. Repository'yi klonlayın:
   ```bash
   git clone https://github.com/yourusername/financialpro.git
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Ortam değişkenlerini ayarlayın:
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin
   ```
4. Uygulamayı başlatın:
   ```bash
   npm start
   ```

### Supabase yapılandırmasını nasıl yapabilirim?
1. Supabase projesini oluşturun
2. Proje URL ve API anahtarlarını alın
3. `.env` dosyasına ekleyin:
   ```
   SUPABASE_URL=your_url
   SUPABASE_ANON_KEY=your_key
   ```

### Google OAuth entegrasyonunu nasıl yapabilirim?
1. Google Cloud Console'da proje oluşturun
2. OAuth 2.0 kimlik bilgilerini yapılandırın
3. Client ID ve Secret'ı `.env` dosyasına ekleyin
4. Callback URL'i Supabase ayarlarında yapılandırın

## Geliştirme

### Yeni bir özellik nasıl ekleyebilirim?
1. Feature branch oluşturun
2. Clean Architecture prensiplerine uyun
3. Testleri yazın
4. Pull Request açın

### Test coverage nasıl kontrol edilir?
```bash
npm run test:coverage
```

### Lint kontrolü nasıl yapılır?
```bash
npm run lint
```

## API ve Entegrasyonlar

### API endpoint'lerine nasıl erişebilirim?
1. JWT token alın:
   ```bash
   curl -X POST /api/auth/login -d '{"email":"...","password":"..."}'
   ```
2. Token'ı Authorization header'ında kullanın:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" /api/protected
   ```

### Gerçek zamanlı özellikleri nasıl kullanabilirim?
```javascript
const subscription = supabase
  .channel('changes')
  .on('*', (payload) => {
    console.log('Değişiklik:', payload)
  })
  .subscribe()
```

## Güvenlik

### Hassas bilgiler nasıl korunuyor?
- JWT tabanlı kimlik doğrulama
- Supabase RLS politikaları
- HTTPS zorunluluğu
- Rate limiting
- Input validasyonu

### İki faktörlü kimlik doğrulama var mı?
Şu anda geliştirme aşamasında, v1.2 sürümünde kullanıma sunulacak.

## Performans

### API yanıt süreleri ne kadar?
- Ortalama: ~150ms
- 95. yüzdelik: <300ms
- Hedef: <100ms

### Ölçeklenebilirlik nasıl sağlanıyor?
- Mikroservis mimarisine hazır tasarım
- Supabase'in ölçeklenebilir altyapısı
- CDN desteği
- Önbellekleme stratejileri

## Hata Ayıklama

### Yaygın hatalar ve çözümleri nelerdir?

#### 1. Bağlantı Hataları
```
Error: Could not connect to Supabase
```
Çözüm: `.env` dosyasındaki Supabase URL ve API anahtarlarını kontrol edin.

#### 2. Kimlik Doğrulama Hataları
```
Error: Invalid JWT token
```
Çözüm: Token'ın geçerli ve süresi dolmamış olduğundan emin olun.

#### 3. RLS Politika Hataları
```
Error: new row violates row-level security policy
```
Çözüm: Kullanıcı yetkilerini ve RLS politikalarını kontrol edin.

## Destek

### Nasıl yardım alabilirim?
- GitHub Issues: Bug raporları
- Discussions: Genel sorular
- E-posta: support@financialpro.com
- Discord: [FinancialPro Server](https://discord.gg/financialpro)

### Dokümantasyona nasıl katkıda bulunabilirim?
1. Docs klasöründeki ilgili dosyayı düzenleyin
2. Pull Request açın
3. Review sürecini takip edin

## Lisans ve Telif Hakkı

### Hangi lisans kullanılıyor?
MIT Lisansı altında dağıtılmaktadır.

### Katkıda bulunanların hakları nelerdir?
Tüm katkılar MIT Lisansı kapsamında değerlendirilir.

_Son Güncelleme: 15 Mart 2024_ 