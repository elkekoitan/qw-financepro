# Katkıda Bulunma Kılavuzu

## Geliştirme Ortamı

1. Projeyi forklayın ve klonlayın
2. Bağımlılıkları yükleyin: `npm install`
3. Geliştirme sunucusunu başlatın: `npm run dev`
4. Test'leri çalıştırın: `npm test`

## Proje Yapısı

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API route'ları
│   ├── (auth)/           # Kimlik doğrulama sayfaları
│   ├── dashboard/        # Dashboard sayfaları
│   └── analysis/         # Analiz sayfaları
├── components/            # React bileşenleri
│   ├── ui/               # UI bileşenleri
│   └── charts/           # Grafik bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
├── types/                # TypeScript tipleri
├── utils/                # Genel yardımcı fonksiyonlar
└── styles/               # CSS stilleri
```

## Geliştirme Kuralları

### Git İş Akışı

1. Feature branch oluşturun: `git checkout -b feature/yeni-ozellik`
2. Değişikliklerinizi commit'leyin: `git commit -m 'feat: yeni özellik eklendi'`
3. Branch'inizi push'layın: `git push origin feature/yeni-ozellik`
4. Pull Request oluşturun

### Commit Mesajları

Conventional Commits standardını kullanıyoruz:

- `feat:` Yeni özellik
- `fix:` Hata düzeltmesi
- `docs:` Dokümantasyon değişiklikleri
- `style:` Kod formatı değişiklikleri
- `refactor:` Kod yeniden düzenleme
- `test:` Test değişiklikleri
- `chore:` Yapılandırma değişiklikleri

### Kod Stili

- ESLint ve Prettier yapılandırmalarını kullanın
- TypeScript strict mode aktif
- Component'ler için React.FC kullanın
- Props için interface tanımlayın
- Dosya isimleri kebab-case

### Test Yazma

- Her yeni özellik için test yazın
- Jest ve React Testing Library kullanın
- Test coverage %80'in üzerinde olmalı
- E2E testleri için Playwright kullanın

### API Geliştirme

- RESTful prensiplerini takip edin
- Tüm endpoint'ler için TypeScript tipleri tanımlayın
- Hata yönetimi için standart format kullanın
- Rate limiting uygulayın
- API dokümanını güncelleyin

### Güvenlik

- Asla API anahtarlarını commit'lemeyin
- `.env.example` dosyasını güncelleyin
- Kullanıcı girişlerini doğrulayın
- XSS ve CSRF koruması uygulayın
- Güvenlik açıklarını private olarak bildirin

## Pull Request Süreci

1. PR template'i doldurun
2. Değişiklikleri açıklayın
3. Test sonuçlarını ekleyin
4. Review için maintainer'ları etiketleyin
5. CI/CD pipeline'ın geçmesini bekleyin
6. Review feedback'lerini uygulayın

## Sürüm Yönetimi

- Semantic Versioning kullanıyoruz
- Her sürüm için CHANGELOG.md güncelleyin
- Release branch'leri için `release/v*` formatını kullanın
- Sürüm etiketleri için `v1.2.3` formatını kullanın

## Yardımcı Kaynaklar

- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [TypeScript El Kitabı](https://www.typescriptlang.org/docs)
- [Supabase Dokümantasyonu](https://supabase.io/docs)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Jest Dokümantasyonu](https://jestjs.io/docs)

## İletişim

- GitHub Issues kullanın
- Önemli güvenlik sorunları için: security@financepro.com
- Genel sorular için: support@financepro.com 