# Error & Troubleshooting Know-How

_Son Güncelleme: 15 Mart 2024_

Bu belge, FinancialPro projesinde karşılaşılan yaygın hataların ve sorunların nasıl çözüleceğini anlatan yönergeleri içermektedir. Projede Sentry ve New Relic entegrasyonları sayesinde, hata raporlamaları ve performans sorunları gerçek zamanlı olarak izlenmekte ve analiz edilmektedir.

## Genel Hata Yönetimi

- **Loglama:**
  - Pino Logging kullanılarak hatalar ayrıntılı loglanır. Log dosyaları, proje yönetimi ve hata çözümü için referans alınır.
  - Hata mesajları, mümkün olduğunca açıklayıcı ve yerinde olmalıdır.

- **Error Tracking & Monitoring:**
  - Sentry: Uygulamadaki hatalar otomatik olarak Sentry'ye gönderilir. Hata raporlarını Sentry panosu üzerinden takip edebilirsiniz.
  - New Relic: Performans metrikleri ve sunucu yanıt süreleri sürekli izlenir. Kritik performans sorunları burada raporlanır.

## Yaygın Hata Senaryoları

1. **Kimlik Doğrulama Hataları:**
   - Yanlış kullanıcı bilgileri girildiğinde, kullanıcı uygun hata mesajını alır ve oturum açma girişimleri reddedilir.
   - Sentry raporları, kimlik doğrulama süreçlerindeki olası güvenlik sorunlarını izler.

2. **Veritabanı Hataları:**
   - Supabase ile ilgili CRUD operasyonlarında, hatalı veri gönderimi veya bağlantı problemleri görülebilir.
   - Uygulama loglarında ve Sentry'de bu hatalar ayrıntılı raporlanır.

3. **API Entegrasyon Hataları:**
   - Next.js API route'larında, isteğe bağlı parametreler veya eksik verilerden kaynaklanan hatalar oluşabilir.
   - API çağrılarında alınan hatalar, Sentry ve ilgili loglar sayesinde tespit edilir.

## Çözüm Adımları

- **Adım 1:** Hata mesajını ayrıntılı olarak inceleyin. Hata mesajında belirtilen hatayı, ilgili log dosyalarında ve Sentry raporlarında detaylandırın.
- **Adım 2:** Hata kodunu ve ilgili isteği tekrar test edin. Gerekirse, hata durumunu yeniden üretmek için izleme modlarını aktifleştirin.
- **Adım 3:** Sorunu çözmek için kod değişiklikleri yapmadan önce yerel ortamda testler gerçekleştirerek sorunun kaynağını belirleyin.
- **Adım 4:** Gerekli düzeltmeleri yapılırken, unit ve entegrasyon testlerinin otomatik olarak çalıştığından emin olun.

## İletişim ve Destek

Herhangi bilinmeyen bir hata durumunda; ekip üyeleriyle toplantı düzenleyin ve ilgili hata raporlarını paylaşın. Tüm hata çözme süreci, dokümantasyon ve Sentry/ New Relic raporları üzerinden takip edilmelidir.

Bu belge, projedeki hata yönetimi süreçlerinin ve çözüm yollarının sürekli güncellenmesi adına referans kaynağı olarak hizmet edecektir.

## TypeScript Module Hataları ve Çözümleri

### 1. Module Resolution Hatası
```typescript
// Hata: Cannot find module '@/components/ui' or its corresponding type declarations
// Çözüm: tsconfig.json path aliases düzenlemesi

{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 2. Type Definition Hatası
```typescript
// Hata: Could not find a declaration file for module 'external-module'
// Çözüm: Tip tanımlamalarının yüklenmesi
npm install --save-dev @types/external-module
```

## Supabase Entegrasyon Hataları

### 1. Auth Cookie Yönetimi
```typescript
// Hata: Cookie is not accessible in server component
// Çözüm: Async cookie yönetimi implementasyonu

const cookieStore = await cookies();
const supabase = createServerClient({
  cookies: {
    get: async (name) => cookieStore.get(name)?.value,
    set: async (name, value, options) => cookieStore.set(name, value, options),
    remove: async (name, options) => cookieStore.set(name, '', { ...options, maxAge: 0 })
  }
});
```

### 2. RLS Policy Hataları
```sql
-- Hata: Row level security policy blocking access
-- Çözüm: Doğru RLS policy tanımı

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON "public"."users"
  FOR SELECT
  USING (auth.uid() = id);
```

## Next.js SSR Hataları

### 1. Hydration Mismatch
```jsx
// Hata: Hydration failed because the initial UI does not match what was rendered on the server
// Çözüm: useEffect ile client-side rendering kontrolü

const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) return null;
```

### 2. API Route Handler Hataları
```typescript
// Hata: API resolved without sending a response
// Çözüm: Response object kullanımı

export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

## Clean Architecture İmplementasyon Zorlukları

### 1. Dependency Injection
```typescript
// Hata: Circular dependency in service layer
// Çözüm: Interface segregation ve dependency inversion

interface IUserRepository {
  getUser(id: string): Promise<User>;
}

class UserService {
  constructor(private userRepo: IUserRepository) {}
  
  async getUser(id: string): Promise<User> {
    return this.userRepo.getUser(id);
  }
}
```

### 2. Use Case İmplementasyonu
```typescript
// Hata: Business logic leaking into presentation layer
// Çözüm: Use case pattern implementasyonu

class CreateUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(userData: UserDTO): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) throw new Error('User already exists');
    
    const hashedPassword = await this.authService.hashPassword(userData.password);
    return this.userRepo.create({ ...userData, password: hashedPassword });
  }
}
```

## State Management Hataları

### 1. Context API Memory Leak
```typescript
// Hata: Memory leak in context subscription
// Çözüm: useEffect cleanup

useEffect(() => {
  const subscription = supabase
    .channel('custom-all-channel')
    .on('postgres_changes', { event: '*', schema: 'public' }, handler)
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 2. React Query Cache Invalidation
```typescript
// Hata: Stale data after mutation
// Çözüm: Query invalidation

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

## Performance Optimization Sorunları

### 1. Bundle Size Optimization
```javascript
// Hata: Large bundle size affecting performance
// Çözüm: Dynamic imports ve code splitting

const DashboardChart = dynamic(() => import('@/components/DashboardChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});
```

### 2. Memory Leak Prevention
```typescript
// Hata: Component unmount sonrası state güncelleme
// Çözüm: AbortController kullanımı

useEffect(() => {
  const abortController = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch(url, {
        signal: abortController.signal
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (error.name === 'AbortError') return;
      setError(error);
    }
  }

  fetchData();

  return () => {
    abortController.abort();
  };
}, [url]);
```

## Clean Architecture Hataları ve Çözümleri

### 1. Module Resolution Hataları
```typescript
// Hata: Cannot find module '../../domain/errors/RateLimitError'
// Çözüm: Domain katmanında eksik error sınıflarının oluşturulması

// src/domain/errors/RateLimitError.ts
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMIT_ERROR', 429);
  }
}

// src/domain/errors/AppError.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### 2. Logger Service Hataları
```typescript
// Hata: Property 'logger' does not exist
// Çözüm: Logger servisinin mock implementasyonunun düzeltilmesi

jest.mock('../../services/logger', () => ({
  logger: {
    logError: jest.fn(),
    logRequest: jest.fn()
  }
}));
```

### 3. Rate Limit Handler Hataları
```typescript
// Hata: Expected 1 arguments, but got 2
// Çözüm: Rate limit handler fonksiyonunun doğru şekilde çağrılması

// Yanlış kullanım
const response = await rateLimitHandler(error, request);

// Doğru kullanım
const handler = rateLimitHandler();
const response = await handler(request);
```

## Öğrenilen Dersler ve Best Practices

1. **Error Boundary Kullanımı**
   - Her sayfa için ayrı error boundary
   - Hata loglaması ve raporlama
   - Kullanıcı dostu hata mesajları

2. **Type Safety**
   - Strict TypeScript configuration
   - Zod ile runtime type validation
   - Generic type kullanımı

3. **Testing Strategy**
   - Unit testler için Jest ve Testing Library
   - E2E testler için Cypress
   - Integration testler için MSW

4. **Performance Monitoring**
   - Lighthouse metrics tracking
   - Core Web Vitals monitoring
   - Custom performance marks

_Son Güncelleme: 15 Mart 2024_

# Hata Çözümleri

## Result Sınıfı Tip Hataları

### Sorun
- `Type 'string | T | undefined' is not assignable to type 'string | T'`
- `Type 'T | undefined' is not assignable to type 'T'`
- `Argument of type 'null' is not assignable to parameter of type 'string | U | undefined'`

### Çözüm
- `Result` sınıfının constructor ve metotlarında tip tanımlamaları düzeltildi
- `ok` metodu opsiyonel parametre alacak şekilde güncellendi
- `combine` metodu `Result<void>` dönecek şekilde güncellendi

## Logger Test Hataları

### Sorun
- `Property 'logger' does not exist on type...`
- Mock yapısında yanlış indeksleme

### Çözüm
- Jest mock yapısı basitleştirildi
- Test senaryoları yeniden düzenlendi
- Mock logger metotları doğrudan erişilebilir hale getirildi

## Rate Limit Handler Hataları

### Sorun
- `Expected 1 arguments, but got 2`
- Rate limit testlerinde yanlış parametre kullanımı

### Çözüm
- Test senaryoları yeniden yazıldı
- Request nesnesi doğru şekilde oluşturuldu
- Rate limit kontrolü için gerekli test senaryoları eklendi 