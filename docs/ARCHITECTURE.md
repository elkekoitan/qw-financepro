## FinancialPro Proje Mimari ve Kütüphane Kullanım Rehberi

Bu döküman, FinancialPro projesinde kullanılan kütüphanelerin, teknolojilerin ve mimari katmanların detaylı açıklamasını sunar. Özellikle Clean Architecture yaklaşımlarıyla projemiz, Domain, Application, Infrastructure ve Presentation katmanlarına ayrılmıştır. Aşağıdaki döküman, adım adım her katmanı, kullanılan kütüphaneleri ve işlevlerini açıklamaktadır.

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
- [Görsel Mimari](#görsel-mimari)
- [Geliştirme Süreçleri ve Dokümantasyon](#geliştirme-süreçleri-ve-dokümantasyon)
- [Terminal Ayarları](#terminal-ayarları)

---

## Genel Bakış

FinancialPro, modern finans yönetimi ve işlem takibi için geliştirilmiş bir Full Stack uygulamadır. Proje, Clean Architecture prensiplerine uygun olarak, dört ana katmanda düzenlenmiştir:

- **Domain Layer:** İş kuralları, entity'ler, value object'ler, domain event'leri ve hata yönetimini kapsar.
- **Application Layer:** İş mantığının orkestrası olan use case'ler ve uygulama servislerini içerir.
- **Infrastructure Layer:** Veritabanı işlemleri, harici servis adaptörleri (Supabase, Redis, vs.) ve repository implementasyonlarını kapsar.
- **Presentation Layer:** Kullanıcı arayüzü bileşenleri (React, MUI, Tailwind CSS) ve API endpoint'leri (Next.js) barındırır.

## Teknoloji Yığını

- **Next.js (v14.x):** SSR, SSG ve API route'ları için kullanılır.
- **React:** Bileşen tabanlı UI oluşturma.
- **TypeScript:** Tip güvenliği ve geliştirme deneyimini iyileştirme.
- **Material-UI (MUI):** Duyarlı ve modern UI bileşenleri.
- **Tailwind CSS:** Fast, esnek ve utility-first CSS üretimi.
- **Supabase:** Kimlik doğrulama, veritabanı ve real-time veri senkronizasyonu.
- **ESLint & Prettier:** Kod kalitesi ve formatlama.
- **Jest & Testing Library:** Test otomasyonu (unit ve entegrasyon testleri).
- **ioredis:** Redis tabanlı rate limit ve caching işlemleri.
- **Pino Logging:** Yüksek performanslı loglama.
- **bcrypt & uuid:** Şifre güvenliği ve benzersiz kimlik üretimi.

## Mimari Katmanlar

Aşağıdaki şema, projemizin mimarisini özetlemektedir:

```mermaid
graph TD
    subgraph DomainLayer[Domain Layer]
        A[Entity'ler & Value Objects]
        B[Domain Events & Error Handling]
    end

    subgraph ApplicationLayer[Application Layer]
        C[Use Cases ve İş Mantığı]
    end

    subgraph InfrastructureLayer[Infrastructure Layer]
        D[Repository Implementasyonları]
        E[Harici Servis Adaptörleri
        (Supabase, Redis, vs.)]
    end

    subgraph PresentationLayer[Presentation Layer]
        F[Next.js API Routes]
        G[React UI Bileşenleri
        (MUI, Tailwind CSS)]
    end

    A --> B
    C --> A
    C --> B
    D --> E
    F --> C
    G --> F
```

## Kütüphane ve Araçların Detaylı Kullanımı

### Next.js & React
- **Kullanım Amacı:** Sunucu tarafı render, statik site üretimi, dinamik routing ve API route'larını yönetmek.
- **Yer:** `src/app`, `src/pages`, `src/api`, `src/middleware`.
- **Detay:** Performans ve SEO odaklı modern web uygulaması geliştirme imkanı sunar.

### TypeScript
- **Kullanım Amacı:** Tip güvenliği, erken hata tespiti ve geliştirme deneyimini artırma.
- **Yer:** Tüm proje genelinde (özellikle `src/domain`, `src/application`, `src/infrastructure`).

### Material-UI (MUI)
- **Kullanım Amacı:** Modern ve duyarlı UI bileşenleri sağlamak.
- **Yer:** `src/app/login/page.tsx`, `src/app/register/page.tsx` gibi UI dosyalarında.

### Tailwind CSS
- **Kullanım Amacı:** Hızlı, esnek ve utility-first CSS geliştirme.
- **Yer:** `src/styles/globals.css` ve komponent bazlı stil dosyalarında.

### Supabase Entegrasyonu
- **Kullanım Amacı:** Kimlik doğrulama, veritabanı işlemleri, real-time data senkronizasyonu.
- **Yer:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`.

### ESLint & Prettier
- **Kullanım Amacı:** Kod kalitesi, tutarlı formatlama ve otomatik düzeltme.
- **Yer:** Projenin tüm dosyalarında. Konfigürasyon: `.eslintrc.json`, `.prettierrc`.

### Jest & Testing Library
- **Kullanım Amacı:** Unit ve entegrasyon testleri ile uygulamanın doğruluğunu sağlamak.
- **Yer:** `src/__tests__`, `src/domain/entities/__tests__`, `src/middleware/__tests__`.
- **Detay:** `jest.config.js` ile TypeScript uyumlu test altyapısı.

### ioredis & Rate Limit Middleware
- **Kullanım Amacı:** API isteklerinin sınırlandırılması (rate limiting) ve caching işlemleri.
- **Yer:** `src/middleware/rateLimit.ts`.

### Pino Logging
- **Kullanım Amacı:** Yüksek performanslı ve okunabilir loglama sağlamak.
- **Yer:** `src/services/logger.ts`.

### Authentication & Security
- **bcrypt:** Şifrelerin güvenli şekilde hashlenmesi.
- **uuid:** Benzersiz kimlik üretimi.
- **Yer:** `src/domain/value-objects/password.value-object.ts`, `src/domain/entities/user.entity.ts`.

## Görsel Mimari

Aşağıdaki görsel, projemizin mimari yapısını özetler:

![Proje Mimari Şeması](https://via.placeholder.com/800x400?text=Proje+Mimari+Diagramı)

> Gerçek projede, bu placeholder görsel yerine ayrıntılı UML veya system architecture diagramları kullanılması önerilir (örneğin, Lucidchart veya Draw.io ile oluşturulan diagramlar).

## Geliştirme Süreçleri ve Dokümantasyon

- **Dokümantasyon:** Tüm mühendislik ve entegrasyon kararları, bu döküman ve TRANSITION.md dosyasına kaydedilmiştir.
- **CI/CD:** Otomatik testler (Jest ve ESLint) entegrasyon süreçlerinde kullanılmaktadır.
- **Güncelleme:** Major değişikliklerden sonra dokümantasyon düzenli olarak güncellenmektedir.

## Terminal Ayarları

Git Bash kullanırken, PowerShell kaynaklı yanlış diagnostic hataları alındığı için VS Code ayarlarına şu eklemeler yapılmıştır:

```json
{
  "powershell.enabled": false,
  "powershell.scriptAnalysis.enable": false
}
```

Bu ayar, geliştirme ortamımızın temiz ve verimli çalışmasını sağlar.

---

Bu döküman, projede kullanılan her kütüphanenin kullanım amacını, hangi katmanda yer aldığını ve projenin genel mimarisini detaylı olarak sunmaktadır. Böylece, FinancialPro projesinin mimarisi ve teknolojik altyapısı net bir şekilde anlaşılabilir. 