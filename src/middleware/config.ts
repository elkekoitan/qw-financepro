// Rate limit konfigürasyonu
export const rateLimitConfig = {
  // Genel API limitleri
  api: {
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // Her IP için maksimum istek sayısı
    message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Auth route'ları için limitler
  auth: {
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 5, // Her IP için maksimum 5 başarısız giriş denemesi
    message: 'Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // WebSocket bağlantıları için limitler
  websocket: {
    windowMs: 60 * 1000, // 1 dakika
    max: 10, // Her IP için maksimum 10 bağlantı
    message: 'Çok fazla bağlantı denemesi. Lütfen daha sonra tekrar deneyin.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Rapor oluşturma için limitler
  reports: {
    windowMs: 24 * 60 * 60 * 1000, // 24 saat
    max: 50, // Her kullanıcı için maksimum 50 rapor
    message: 'Günlük rapor limitine ulaşıldı. Lütfen yarın tekrar deneyin.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Market verisi istekleri için limitler
  marketData: {
    windowMs: 60 * 1000, // 1 dakika
    max: 60, // Her IP için dakikada maksimum 60 istek (1 istek/saniye)
    message: 'Market verisi istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Analiz istekleri için limitler
  analysis: {
    windowMs: 5 * 60 * 1000, // 5 dakika
    max: 30, // Her IP için 5 dakikada maksimum 30 istek
    message: 'Analiz istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
    standardHeaders: true,
    legacyHeaders: false,
  },
}; 