const fs = require('fs');
const { execSync } = require('child_process');

// .env.production dosyasını oku
const envContent = fs.readFileSync('.env.production', 'utf8');

// Her bir satırı ayır ve çevre değişkenlerini işle
const envVars = envContent.split('\n')
  .filter(line => line && !line.startsWith('#'))
  .map(line => {
    const [key, ...valueParts] = line.split('=');
    // Eşittir işaretinden sonraki her şey değer olarak kabul edilir
    const value = valueParts.join('=');
    return { key: key.trim(), value: value.trim() };
  })
  .filter(({ key }) => key); // Boş anahtarları filtrele

console.log(`Toplam ${envVars.length} değişken bulundu...`);

// Production ortamına değişkenleri ekle
envVars.forEach(({ key, value }) => {
  try {
    console.log(`Ekleniyor: ${key} (Production ortamı)`);
    // --global yerine --scope ekleyebilirsiniz gerekirse
    execSync(`echo ${value} | vercel env add ${key} production`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Hata: ${key} eklenirken sorun oluştu`);
  }
});

// Development değişkenlerini .env dosyasından alalım
const devEnvContent = fs.readFileSync('.env', 'utf8');
const devEnvVars = devEnvContent.split('\n')
  .filter(line => line && !line.startsWith('#'))
  .map(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    return { key: key.trim(), value: value.trim() };
  })
  .filter(({ key }) => key);

console.log(`\nToplam ${devEnvVars.length} development değişkeni bulundu...`);

// Development ortamına değişkenleri ekle
devEnvVars.forEach(({ key, value }) => {
  try {
    console.log(`Ekleniyor: ${key} (Development ortamı)`);
    execSync(`echo ${value} | vercel env add ${key} development`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Hata: ${key} eklenirken sorun oluştu`);
  }
});

console.log('Tüm ortam değişkenleri eklendi!'); 