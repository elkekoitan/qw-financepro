// Rate limit middleware'i için matcher konfigürasyonu
export const rateLimitMatcher = {
  // Auth route'ları için matcher
  auth: {
    matcher: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/logout',
      '/api/auth/refresh',
      '/api/auth/google',
      '/api/auth/google/callback',
    ],
  },

  // API route'ları için matcher
  api: {
    matcher: [
      '/api/:path*',
    ],
  },

  // WebSocket route'ları için matcher
  websocket: {
    matcher: [
      '/api/ws',
      '/api/ws/:path*',
    ],
  },

  // Rapor route'ları için matcher
  reports: {
    matcher: [
      '/api/reports/create',
      '/api/reports/:path*',
    ],
  },

  // Market verisi route'ları için matcher
  marketData: {
    matcher: [
      '/api/analysis/market-data',
      '/api/analysis/market-data/:path*',
    ],
  },

  // Analiz route'ları için matcher
  analysis: {
    matcher: [
      '/api/analysis/technical',
      '/api/analysis/chart',
      '/api/analysis/news',
    ],
  },
}; 