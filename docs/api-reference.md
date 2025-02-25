# API Reference
+ _Son Güncelleme: 15 Mart 2024_

Bu doküman, FinancialPro API'sinde bulunan endpoint'lerin detaylı açıklamalarını içermektedir.

## Genel Endpoint'ler

- **GET /**
  - Açıklama: Ana sayfa. FinancialPro index.html dosyasını döner.

- **GET /status**
  - Açıklama: API'nin durumunu sorgular. Örnek yanıt: `{ "status": "ok" }`.

## Kimlik Doğrulama

Tüm API endpoint'leri kimlik doğrulama gerektirir. Kimlik doğrulama, Supabase tarafından sağlanan JWT token'ları kullanılarak yapılır.

### Oturum Açma

```http
POST /api/auth/login
```

#### İstek Gövdesi

```json
{
  "email": "string",
  "password": "string"
}
```

#### Başarılı Yanıt

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    },
    "session": {
      "access_token": "string",
      "refresh_token": "string"
    }
  }
}
```

### Kayıt Olma

```http
POST /api/auth/register
```

#### İstek Gövdesi

```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

#### Başarılı Yanıt

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
}
```

## Profil

### Profil Bilgilerini Getir

```http
GET /api/profile
```

#### Başarılı Yanıt

```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "preferences": {
      "theme": "light" | "dark",
      "notifications": boolean
    }
  }
}
```

### Profil Güncelleme

```http
PUT /api/profile
```

#### İstek Gövdesi

```json
{
  "name": "string",
  "preferences": {
    "theme": "light" | "dark",
    "notifications": boolean
  }
}
```

## Analiz

### Teknik Göstergeler

```http
GET /api/analysis/indicators
```

#### Sorgu Parametreleri

```
symbol: string
interval: "1d" | "1w" | "1m"
```

#### Başarılı Yanıt

```json
{
  "success": true,
  "data": {
    "indicators": [
      {
        "name": "RSI",
        "value": number,
        "signal": "buy" | "sell" | "neutral",
        "description": "string"
      }
    ]
  }
}
```

## Hata Yanıtları

Tüm API endpoint'leri hata durumunda aşağıdaki formatta yanıt döner:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

### Hata Kodları

- `AUTH_REQUIRED`: Kimlik doğrulama gerekli
- `INVALID_CREDENTIALS`: Geçersiz kimlik bilgileri
- `USER_NOT_FOUND`: Kullanıcı bulunamadı
- `VALIDATION_ERROR`: Geçersiz istek gövdesi
- `INTERNAL_ERROR`: Sunucu hatası

## Rate Limiting

- Her IP adresi için dakikada 100 istek
- Auth endpoint'leri için dakikada 10 istek
- Aşıldığında 429 Too Many Requests yanıtı döner

## WebSocket API

### Bağlantı

```javascript
const ws = new WebSocket('wss://api.financepro.com/ws');
```

### Mesaj Formatı

```json
{
  "type": "subscribe" | "unsubscribe",
  "channel": "price" | "indicators",
  "symbol": "string"
}
```

### Örnek Kullanım

```javascript
ws.send(JSON.stringify({
  type: "subscribe",
  channel: "price",
  symbol: "AAPL"
}));
```

## Kullanıcı İşlemleri

| Yöntem | Endpoint | Açıklama | Kimlik Doğrulama |
|--------|----------|----------|------------------|
| POST   | `/api/users` | Yeni kullanıcı oluşturur. | Gerekli değil |
| PATCH  | `/api/users/:id` | Kullanıcı bilgisini günceller. | JWT gerekli |
| DELETE | `/api/users/:id` | Kullanıcıyı siler. | JWT gerekli |

## Yatırım Profili İşlemleri

| Yöntem | Endpoint | Açıklama | Kimlik Doğrulama |
|--------|----------|----------|------------------|
| POST   | `/api/investment/profile` | Yatırım profilini oluşturur veya günceller. | JWT gerekli |
| GET    | `/api/investment/profiles` | Mevcut yatırım profillerini döner. | JWT gerekli |
| PATCH  | `/api/investment/profile/:id` | Belirtilen yatırım profilini günceller. | JWT gerekli |
| DELETE | `/api/investment/profile/:id` | Belirtilen yatırım profilini siler. | JWT gerekli |

## Finansal Veri Endpoint'leri

| Yöntem | Endpoint | Açıklama | Kimlik Doğrulama |
|--------|----------|----------|------------------|
| POST   | `/predict` | Gönderilen `features` dizisi üzerinden tahmin yapılan endpoint. | JWT gerekli |
| POST   | `/mobile/predict` | Mobil cihazlar için tahmin endpoint'i. | JWT gerekli |
| POST   | `/rag/data` | RAG entegrasyonu için örnek endpoint. | JWT gerekli |
| POST   | `/api/investment/advice` | Yatırım önerisi sağlar. | JWT gerekli |
| GET    | `/api/news` | Piyasa haberlerini getirir. | JWT gerekli |
| GET    | `/api/calendar` | Ekonomik takvim olaylarını döner. | JWT gerekli |
| GET    | `/api/signals` | Alım/satım sinyallerini getirir. | JWT gerekli |
| POST   | `/api/settings` | Kullanıcı ayarlarını günceller. | JWT gerekli |

## Diğer Endpoint'ler

| Yöntem | Endpoint | Açıklama | Kimlik Doğrulama |
|--------|----------|----------|------------------|
| GET    | `/api/economic/events` | Ekonomik olayları getirir. | JWT gerekli |
| GET    | `/api/signal-settings` | Sinyal ayarlarını getirir. | JWT gerekli |
| PATCH  | `/api/signal-settings/:id` | Belirli sinyal ayarını günceller. | JWT gerekli |
| DELETE | `/api/signal-settings/:id` | Belirli sinyal ayarını siler. | JWT gerekli |
| POST   | `/api/telegram/webhook` | Telegram bot webhook'u simüle eder. | JWT gerekli |
| POST   | `/api/discord/webhook` | Discord bot webhook'u simüle eder. | JWT gerekli |
| POST   | `/api/whatsapp/webhook` | WhatsApp bot webhook'u simüle eder. | JWT gerekli |
| GET    | `/api/dashboard` | Dashboard verilerini döner. | JWT gerekli |
| POST   | `/api/economic/event` | Yeni ekonomik olay oluşturur. | JWT gerekli |
| GET    | `/api/ai/model-info` | AI modeli ile ilgili bilgileri döner. | JWT gerekli |

Daha fazla detay ve örnek kullanım için lütfen ilgili endpoint'in dokümantasyonuna bakınız. 