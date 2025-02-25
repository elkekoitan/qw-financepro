# FinancialPro Architecture Guide
_Son Güncelleme: 15 Mart 2024_

## FinancialPro Proje Mimari ve Kütüphane Kullanım Rehberi

Bu döküman, FinancialPro projesinde kullanılan kütüphanelerin, teknolojilerin ve mimari katmanların detaylı açıklamasını sunar. Proje, Clean Architecture prensiplerine uygun olarak Domain, Application, Infrastructure ve Presentation katmanlarına ayrılmıştır. Aşağıdaki döküman; kullanılan teknolojileri, yapılandırmaları, CI/CD süreçlerini, kod yazma kurallarını ve son güncellemeleri kapsamaktadır.

---

## İçindekiler

- [FinancialPro Proje Mimari ve Kütüphane Kullanım Rehberi](#financialpro-proje-mimari-ve-kütüphane-kullanım-rehberi)
- [İçindekiler](#i̇çindekiler)
- [Genel Bakış](#genel-bakış)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Mimari Katmanlar](#mimari-katmanlar)
- [Kütüphane ve Araçların Detaylı Kullanımı](#kütüphane-ve-araçların-detaylı-kullanımı)
  - [Next.js \& React](#nextjs--react)
  - [TypeScript](#typescript)
  - [Material-UI (MUI)](#material-ui-mui)
  - [Tailwind CSS](#tailwind-css)
  - [Supabase Entegrasyonu](#supabase-entegrasyonu)
  - [ESLint \& Prettier](#eslint--prettier)
  - [Jest \& Testing Library](#jest--testing-library)
  - [ioredis \& Rate Limit Middleware](#ioredis--rate-limit-middleware)
  - [Pino Logging](#pino-logging)
  - [Authentication \& Security](#authentication--security)
  - [CI/CD ve Deployment](#cicd-ve-deployment)
- [Terminal Ayarları](#terminal-ayarları)
- [Kod Yazma Kuralları](#kod-yazma-kuralları)
  - [Dosya İsimlendirme](#dosya-i̇simlendirme)
  - [Sayfa ve Bileşen Oluşturma](#sayfa-ve-bileşen-oluşturma)
  - [TypeScript Kullanımı](#typescript-kullanımı)
  - [Stil ve Formatlama](#stil-ve-formatlama)
  - [Genel Prensipler](#genel-prensipler)
- [Son Güncellemeler ve Gelecek Planları](#son-güncellemeler-ve-gelecek-planları)

---

## Genel Bakış

FinancialPro, modern finans yönetimi, yatırım portföyü takibi ve raporlama hizmetleri sunan full-stack bir uygulamadır. Proje, yüksek performans, sürdürülebilirlik ve hızlı geliştirme hedefleri doğrultusunda Clean Architecture prensipleriyle uygulanmaktadır. Domain, Application, Infrastructure ve Presentation katmanları arasında net bir ayrım mevcuttur.

## Teknoloji Yığını

- **Next.js (v14.x):** Sunucu tarafı rendering (SSR), statik site üretimi (SSG) ve dinamik API route'ları için kullanılır. (App Router güncellemeleri uygulanmıştır.)
- **React:** Bileşen tabanlı UI oluşturma.
- **TypeScript:** Tip güvenliği ve geliştirme deneyimini artırmak için kullanılır.
- **Material-UI (MUI):** Modern ve duyarlı UI bileşenleri sağlar.
- **Tailwind CSS:** Utility-first yaklaşımıyla esnek ve hızlı stil geliştirme sunar.
- **Supabase:** Kimlik doğrulama, veritabanı işlemleri ve real-time data senkronizasyonu için entegre edilmiştir.
- **ESLint & Prettier:** Kod kalitesi, tutarlılık ve otomatik formatlama sağlar.
- **Jest & Testing Library:** Birim ve entegrasyon testleri aracılığıyla uygulamanın doğruluğu sağlanır.
- **ioredis:** Rate limiting ve caching işlemleri için kullanılır.
- **Pino Logging:** Yüksek performanslı loglama sunar.
- **Sentry & New Relic:** Hata izleme ve performans monitorlemesi için entegre edilmiştir.
- **Vercel:** Otomatik deployment, hosting ve production/staging yönetimi için kullanılır.

## Mimari Katmanlar

- **Domain Layer:** Entity'ler, Value Object'ler, Domain Event'ler ve iş kuralları
- **Application Layer:** Use case'ler, servisler ve iş mantığının orkestrası
- **Infrastructure Layer:** Repository implementasyonları, harici servis adaptörleri (Supabase, Redis, vs.)
- **Presentation Layer:** UI bileşenleri, Next.js sayfa ve API route'ları

## Kütüphane ve Araçların Detaylı Kullanımı

### Next.js & React
- **Amaç:** SSR, SSG ve dinamik routing; modern UI geliştirme.
- **Detay:** App Router yapısına geçiş yapılarak güncel Next.js özellikleri kullanılır.

### TypeScript
- **Amaç:** Tip güvenliği sağlamak, geliştirme deneyimini iyileştirmek.
- **Detay:** Proje genelinde kapsamlı tip tanımlamaları kullanılmıştır.

### Material-UI (MUI)
- **Amaç:** Duyarlı ve modern UI bileşenleri sunmak.

### Tailwind CSS
- **Amaç:** Hızlı, esnek ve utility-first stil geliştirme.

### Supabase Entegrasyonu
- **Amaç:** Kimlik doğrulama, veritabanı işlemleri ve real-time data sunmak.

### ESLint & Prettier
- **Amaç:** Kod kalitesi ve tutarlı stil sağlamak.

### Jest & Testing Library
- **Amaç:** Birim ve entegrasyon testlerinin yürütülmesi.

### ioredis & Rate Limit Middleware
- **Amaç:** API istek sınırlandırması ve caching işlemleri.

### Pino Logging
- **Amaç:** Yüksek performanslı ve yapılandırılabilir loglama.

### Authentication & Security
- **Amaç:** Güvenli kimlik doğrulama, şifreleme (bcrypt) ve benzersiz ID üretimi (uuid) sağlamak.

### CI/CD ve Deployment
- **Amaç:** Otomatik test, derleme ve deployment süreçlerinin yönetilmesi.
- **Detay:** GitHub Actions ile CI/CD pipeline kurulmuş, Vercel CLI ve vercel.json dosyası ile deployment süreçleri otomatikleşmiştir. Sentry ve New Relic entegrasyonları ile hata izleme ve performans monitörlemesi gerçekleştirilir.

## Terminal Ayarları

Git Bash kullanırken PowerShell kaynaklı yanlış diagnostic hataları almamak için VS Code ayarları:

```json
{
  "powershell.enabled": false,
  "powershell.scriptAnalysis.enable": false
}
```

Bu ayar geliştirme ortamımızın verimli çalışmasını sağlar.

## Kod Yazma Kuralları

### Dosya İsimlendirme
- Dosya isimleri her zaman kebab-case kullanılarak yazılmalıdır. Örneğin: `user-profile.tsx`, `settings-page.tsx`
- İsimler açıklayıcı ve anlamlı olmalıdır. Örneğin: `dashboard.tsx`, `portfolio-details.tsx`
- Sayfa bileşenleri için `page.tsx` kullanın (örn. `src/app/portfolio/page.tsx`).
- API route dosyaları `route.ts` ile bitmelidir (örn. `src/app/api/users/route.ts`).
- Test dosyaları, ilgili dosya ile aynı ismi taşımalı ve `.test.ts` ya da `.spec.ts` uzantısını kullanmalıdır.
- Konfigürasyon dosyaları kök dizinde veya `config/` klasöründe yer almalıdır.

### Sayfa ve Bileşen Oluşturma
- Yeni sayfa/bileşen oluştururken mevcut yapıları kontrol edin; gereksiz tekrar oluşturmaktan kaçının.
- Sayfa bileşenlerini uygun dizin yapısı altında oluşturun (örn. `src/app/portfolio/page.tsx`).
- Bileşen isimleri PascalCase kullanılmalı (örn. `UserProfile`, `SettingsForm`).
- Bileşenler tek sorumluluk prensibine uygun, küçük ve yeniden kullanılabilir olmalıdır.
- Bileşen dosyaları, bileşenle aynı ismi taşıyan klasörde yer almalıdır (örn. `src/components/UserProfile/UserProfile.tsx`).

### TypeScript Kullanımı
- Tip tanımlamaları eksiksiz yapılmalı, fonksiyon parametreleri ve dönüş değerleri belirtilmelidir.
- Generic tipler kullanılarak kod tekrarı önlenmeli.
- `any` kullanımından kaçınılmalı; mecbur kalındığında neden kullanıldığı yorumlanmalıdır.

### Stil ve Formatlama
- Tutarlı kod stili uygulanmalı; girintileme 2 boşluk olmalı.
- Satır uzunluğu 80-120 karakter aralığında tutulmalı, dosya sonunda newline bulunmalıdır.
- Fonksiyonlar ve sınıflar arasında yeterli boşluk bırakılmalıdır.
- İsimlendirmede İngilizce tercih edilmeli, kısaltmalardan kaçınılmalıdır.

### Genel Prensipler
- DRY prensibine uyun; ortak işlevler paylaşılan modüllerde yer almalıdır.
- SOLID prensipleri uygulanmalı; bağımlılıklar tersine çevrilmeli.
- Kodun okunabilirliği yüksek tutulmalı; açıklayıcı isimler ve yorumlar eklenmelidir.
- Fonksiyonlar kısa ve tek odaklı olmalıdır (genellikle 20-30 satırı geçmemelidir).
- Hata yönetimi için try-catch blokları kullanılmalı, anlamlı hata mesajları oluşturulmalıdır.
- Asenkron işlemler için async/await tercih edilmeli, callback hell önlenmelidir.
- Performans ve bellek kullanımı gözetilmelidir.

## Son Güncellemeler ve Gelecek Planları

- **Dosya Yapısı Güncellemeleri:** Next.js App Router kullanımına geçildi, uyumsuz dosyalar kaldırılarak güncel dosya isimlendirme standartlarına uyum sağlandı.
- **CI/CD Süreçleri:** GitHub Actions ile test, lint, build ve deployment otomasyonu kurulmuş; Vercel CLI ve vercel.json dosyası ile production ve staging deployment süreçleri yönetilmektedir.
- **Hata İzleme & Performans Monitörlemesi:** Sentry ve New Relic entegrasyonları eklenmiş, uygulama hataları ve performans ölçümleri gerçek zamanlı izlenmektedir.
- **Kod Kalitesi İyileştirmeleri:** ESLint, Prettier ve TypeScript kuralları güncellenerek kodun okunabilirliği ve tutarlılığı artırılmıştır.
- **Gelecek Planları:** Yeni fonksiyonlar ve modüller eklenirken bu kurallara uygunluk sağlanacak; dokümantasyon düzenli olarak güncellenecek ve tüm ekip üyeleriyle paylaşılacaktır.

---

Bu doküman, projede kullanılan tüm ana teknolojileri, mimari prensipleri, kod yazma kurallarını ve güncel yapılandırmaları detaylı olarak kapsamaktadır. FinancePro'un mimari ve teknik altyapısını anlamak, projenin sürdürülebilir ve yüksek performanslı geliştirilmesine yardımcı olmaktadır. 