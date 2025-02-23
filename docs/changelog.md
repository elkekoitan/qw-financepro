# Changelog

Bu doküman, FinancialPro projesindeki tüm önemli değişiklikleri içerir. [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standartlarını ve [Semantic Versioning](https://semver.org/spec/v2.0.0.html) prensiplerine uyar.

## [1.2.0] - 2024-03-15

### Eklenenler
- Supabase SSR entegrasyonu güncellendi
- Cookie yönetimi merkezi hale getirildi
- Yeni analiz göstergeleri eklendi
- WebSocket API desteği eklendi

### Değişenler
- API route'ları async/await yapısına güncellendi
- Kimlik doğrulama sistemi yenilendi
- Test altyapısı güncellendi
- Dokümantasyon Türkçeleştirildi

### Düzeltilenler
- Cookie yönetimi hataları giderildi
- Rate limiting sorunları çözüldü
- TypeScript tip hataları düzeltildi
- Bellek sızıntıları giderildi

## [1.1.0] - 2024-02-28

### Eklenenler
- Teknik analiz göstergeleri
- Portföy yönetimi
- Raporlama sistemi
- E-posta bildirimleri

### Değişenler
- UI/UX iyileştirmeleri
- Performans optimizasyonları
- Veritabanı şeması güncellendi
- API endpoint'leri yeniden yapılandırıldı

### Düzeltilenler
- Oturum yönetimi hataları
- Veri senkronizasyon sorunları
- Güvenlik açıkları
- Responsive tasarım sorunları

## [1.0.0] - 2024-01-15

### Eklenenler
- Temel kullanıcı yönetimi
- Finansal veri entegrasyonu
- Temel analiz araçları
- Dashboard görünümü

### Değişenler
- İlk kararlı sürüm
- Dokümantasyon tamamlandı
- Test kapsamı genişletildi
- CI/CD pipeline kuruldu

### Düzeltilenler
- Beta sürümündeki hatalar
- Performans sorunları
- Güvenlik açıkları
- API tutarsızlıkları

## Sürüm Numaralandırma

- Major.Minor.Patch formatı kullanılır
- Major: Geriye uyumsuz API değişiklikleri
- Minor: Geriye uyumlu yeni özellikler
- Patch: Geriye uyumlu hata düzeltmeleri

## Commit Mesajları

Commit mesajları için [Conventional Commits](https://www.conventionalcommits.org/) standardı kullanılır:

- feat: Yeni özellik
- fix: Hata düzeltmesi
- docs: Dokümantasyon değişiklikleri
- style: Kod formatı değişiklikleri
- refactor: Kod yeniden düzenleme
- test: Test değişiklikleri
- chore: Genel bakım

_Not: Bu değişiklik günlüğü sürekli güncellenmektedir._ 