# FinancialPro

_Son Güncelleme: 15 Mart 2024_

FinancialPro, Clean Architecture prensiplerine uygun olarak geliştirilen modern bir finans yönetimi uygulamasıdır. Proje, Domain, Application, Infrastructure ve Presentation olmak üzere dört ana katmana ayrılmıştır.

## Proje Genel Bakış

- **Domain Layer:** İş kuralları, entity'ler, value object'ler ve hata yönetimi.
- **Application Layer:** İş mantığı, use case'ler, servisler ve DTO'lar.
- **Infrastructure Layer:** Supabase, Redis gibi dış servis adaptörleri ve repository implementasyonları.
- **Presentation Layer:** Next.js API Routes, React UI bileşenleri (MUI, Tailwind CSS).

Tüm detaylı dokümantasyon için aşağıdaki bağlantılara göz atın:

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Clean Architecture Migration](docs/clean-architecture-migration.md)
- [Technical Implementation](docs/technical-implementation.md)
- [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md)
- [Transition Guide](docs/TRANSITION.md)
- [Error & Troubleshooting](docs/error-know-how.md)
- [Roadmap](docs/roadmap.md)
- [Design System](docs/DESIGN_SYSTEM.md)

## Kurulum ve Deploy

- **CI/CD:** GitHub Actions ve Vercel otomasyonu ile entegrasyon sağlanmıştır.
- **Deployment:** Canlı ortama deploy için gerekli tüm yapılandırmalar tamamlanmıştır. Ortam değişkenlerini doğru şekilde ayarlamanız gerekmektedir.

## Katkıda Bulunma

Katkıda bulunmak için lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın. 