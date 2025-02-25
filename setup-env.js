const { execSync } = require('child_process');

// Temel değişkenleri tanımla
const envVars = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    value: 'https://fnuxdfocbpyvshjeiqqv.supabase.co'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudXhkZm9jYnB5dnNoamVpcXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MTg0MzAsImV4cCI6MjA1NTk5NDQzMH0.gzHodvmzWvyGfCJL-rlZOQNdz2KH_9rceA6cE7La6jE'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudXhkZm9jYnB5dnNoamVpcXF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQxODQzMCwiZXhwIjoyMDU1OTk0NDMwfQ.c5Qa4F4FnFu2odT9S9AYJEXhTILKYO2U9DF_rNZio5I'
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    value: 'https://qw-financepro.vercel.app'
  },
  {
    key: 'NODE_ENV',
    value: 'production'
  }
];

// Hem production hem de development ortamlarına değişkenleri ekle
for (const { key, value } of envVars) {
  try {
    console.log(`${key} değişkeni production ortamına ekleniyor...`);
    // Production ortamına ekle
    execSync(`vercel env add ${key} production`, { 
      input: Buffer.from(value + '\n'),
      stdio: ['pipe', 'inherit', 'inherit']
    });
    
    // Development ortamı için değeri belirleme
    let devValue = value;
    if (key === 'NODE_ENV') devValue = 'development';
    if (key === 'NEXT_PUBLIC_APP_URL') devValue = 'http://localhost:3000';
    
    console.log(`${key} değişkeni development ortamına ekleniyor...`);
    // Development ortamına ekle
    execSync(`vercel env add ${key} development`, { 
      input: Buffer.from(devValue + '\n'),
      stdio: ['pipe', 'inherit', 'inherit']
    });
  } catch (error) {
    console.error(`${key} eklenirken hata oluştu:`, error.message);
  }
}

console.log('Tüm ortam değişkenleri eklendi!'); 