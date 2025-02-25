const { execSync } = require('child_process');

// Sentry için gerekli değişkenleri tanımla
const sentryVars = [
  {
    key: 'NEXT_PUBLIC_SENTRY_DSN', 
    value: 'https://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@o4506892726657024.ingest.sentry.io/4506892728688640'
  },
  {
    key: 'SENTRY_AUTH_TOKEN',
    value: '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'
  },
  {
    key: 'SENTRY_PROJECT',
    value: 'financepro'
  },
  {
    key: 'SENTRY_ORG',
    value: 'elkekoitan'
  }
];

// Production ve development ortamlarına Sentry değişkenlerini ekle
for (const { key, value } of sentryVars) {
  try {
    console.log(`${key} değişkeni production ortamına ekleniyor...`);
    // Production ortamına ekle
    execSync(`vercel env add ${key} production`, { 
      input: Buffer.from(value + '\n'),
      stdio: ['pipe', 'inherit', 'inherit']
    });
    
    console.log(`${key} değişkeni development ortamına ekleniyor...`);
    // Development ortamına ekle
    execSync(`vercel env add ${key} development`, { 
      input: Buffer.from(value + '\n'),
      stdio: ['pipe', 'inherit', 'inherit']
    });
  } catch (error) {
    console.error(`${key} eklenirken hata oluştu:`, error.message);
  }
}

console.log('Tüm Sentry ortam değişkenleri eklendi!'); 