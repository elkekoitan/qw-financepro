# Clean Architecture Teknik İmplementasyon Planı

## Proje Yapısı

```
src/
├── domain/           # İş kuralları ve entities
├── application/      # Use cases ve ports
├── infrastructure/   # Adaptörler ve implementasyonlar
└── presentation/     # UI ve API controllers
```

## Domain Layer (Core) Yapısı

### 1. Entities

```typescript
// User Entity
export class User extends AggregateRoot {
  private constructor(
    public readonly id: UniqueEntityID,
    private email: Email,        // Value Object
    private password: Password,  // Value Object
    private name: Name,         // Value Object
    private status: UserStatus  // Enum
  ) {
    super();
  }

  public static create(props: UserProps): Result<User> {
    // Domain validation rules
    if (!props.email || !props.password) {
      return Result.fail('Email and password are required');
    }
    return Result.ok(new User(props));
  }

  // Domain methods
  public validatePassword(password: string): boolean {
    return this.password.compare(password);
  }

  public updateEmail(email: Email): Result<void> {
    this.email = email;
    this.addDomainEvent(new UserEmailUpdatedEvent(this));
    return Result.ok();
  }
}

// Portfolio Entity
export class Portfolio extends AggregateRoot {
  private constructor(
    public readonly id: UniqueEntityID,
    private userId: UniqueEntityID,
    private assets: Asset[],
    private totalValue: Money
  ) {
    super();
  }

  public static create(props: PortfolioProps): Result<Portfolio> {
    // Domain validation rules
    return Result.ok(new Portfolio(props));
  }

  // Domain methods
  public addAsset(asset: Asset): Result<void> {
    this.assets.push(asset);
    this.recalculateTotalValue();
    this.addDomainEvent(new AssetAddedEvent(this, asset));
    return Result.ok();
  }
}
```

### 2. Value Objects

```typescript
// Email Value Object
export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Result<Email> {
    if (!email.includes('@')) {
      return Result.fail('Invalid email format');
    }
    return Result.ok(new Email({ value: email }));
  }
}

// Money Value Object
export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  public static create(amount: number, currency: string): Result<Money> {
    if (amount < 0) {
      return Result.fail('Amount cannot be negative');
    }
    return Result.ok(new Money({ amount, currency }));
  }

  public add(money: Money): Result<Money> {
    if (this.props.currency !== money.props.currency) {
      return Result.fail('Cannot add different currencies');
    }
    return Money.create(
      this.props.amount + money.props.amount,
      this.props.currency
    );
  }
}
```

### 3. Domain Events

```typescript
// User Events
export class UserCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  
  constructor(public readonly user: User) {
    this.dateTimeOccurred = new Date();
  }
}

export class UserEmailUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  
  constructor(
    public readonly user: User,
    public readonly oldEmail: Email,
    public readonly newEmail: Email
  ) {
    this.dateTimeOccurred = new Date();
  }
}
```

### 4. Domain Services

```typescript
// Password Service
export class PasswordService {
  public static validate(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  }

  public static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}

// Portfolio Valuation Service
export class PortfolioValuationService {
  public static calculateTotalValue(assets: Asset[]): Money {
    return assets.reduce(
      (total, asset) => total.add(asset.getCurrentValue()),
      Money.create(0, 'USD')
    );
  }
}
```

## Application Layer Yapısı

### 1. Use Cases

```typescript
// Create User Use Case
export class CreateUserUseCase implements IUseCase<CreateUserDTO, Result<void>> {
  constructor(
    private userRepo: IUserRepository,
    private eventBus: IEventBus
  ) {}

  public async execute(request: CreateUserDTO): Promise<Result<void>> {
    const emailOrError = Email.create(request.email);
    if (emailOrError.isFailure) {
      return Result.fail(emailOrError.error);
    }

    const passwordOrError = Password.create(request.password);
    if (passwordOrError.isFailure) {
      return Result.fail(passwordOrError.error);
    }

    const userOrError = User.create({
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      name: request.name
    });

    if (userOrError.isFailure) {
      return Result.fail(userOrError.error);
    }

    const user = userOrError.getValue();
    await this.userRepo.save(user);
    this.eventBus.publish(new UserCreatedEvent(user));

    return Result.ok();
  }
}
```

### 2. DTOs

```typescript
// User DTOs
export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  status: string;
}

// Portfolio DTOs
export interface CreatePortfolioDTO {
  userId: string;
  initialAssets?: AssetDTO[];
}

export interface AssetDTO {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currency: string;
}
```

### 3. Port Interfaces

```typescript
// Repository Interfaces
export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(id: UniqueEntityID): Promise<User>;
  delete(id: UniqueEntityID): Promise<void>;
}

export interface IPortfolioRepository {
  save(portfolio: Portfolio): Promise<void>;
  findByUserId(userId: UniqueEntityID): Promise<Portfolio>;
  update(portfolio: Portfolio): Promise<void>;
}

// Service Interfaces
export interface IAuthService {
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(userId: string): Promise<void>;
  refreshToken(token: string): Promise<string>;
}
```

## Infrastructure Layer Yapısı

### 1. Repository Implementations

```typescript
// Supabase User Repository
export class SupabaseUserRepository implements IUserRepository {
  constructor(private supabase: SupabaseClient) {}

  async save(user: User): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .upsert({
        id: user.id.toString(),
        email: user.email.value,
        name: user.name.value,
        status: user.status
      });

    if (error) throw new DatabaseError(error.message);
  }

  async findByEmail(email: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (error) throw new DatabaseError(error.message);
    return this.toDomain(data);
  }
}
```

### 2. External Service Adapters

```typescript
// Supabase Auth Service
export class SupabaseAuthService implements IAuthService {
  constructor(private supabase: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw new AuthError(error.message);
    return {
      user: data.user,
      session: data.session
    };
  }
}
```

## Presentation Layer Yapısı

### 1. API Controllers

```typescript
// User Controller
export async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const useCase = container.resolve(CreateUserUseCase);
    const result = await useCase.execute(req.body);
    
    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 2. React Components

```typescript
// User Registration Form
export function UserRegistrationForm() {
  const mutation = useMutation({
    mutationFn: (data: CreateUserDTO) => 
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      toast.success('Registration successful');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <form onSubmit={handleSubmit(mutation.mutate)}>
      <Input name="email" type="email" required />
      <Input name="password" type="password" required />
      <Input name="name" type="text" required />
      <Button type="submit">Register</Button>
    </form>
  );
}
```

## İmplementasyon Sırası ve Zaman Çizelgesi

### Hafta 1: Domain Layer
- [x] Core entities (User, Portfolio, Transaction)
- [x] Value objects (Email, Money, Password)
- [x] Domain events
- [x] Domain services
- [x] Unit tests

### Hafta 2: Application Layer
- [ ] Use case interfaces
- [ ] Use case implementations
- [ ] DTOs
- [ ] Port interfaces
- [ ] Integration tests

### Hafta 3: Infrastructure Layer
- [ ] Repository implementations
- [ ] External service adapters
- [ ] Database configurations
- [ ] Event bus implementation
- [ ] E2E tests

### Hafta 4: Presentation Layer
- [ ] API controllers
- [ ] React components
- [ ] Custom hooks
- [ ] Context providers
- [ ] UI tests

## Kalite Kontrol Metrikleri

| Metrik | Hedef | Kontrol Sıklığı |
|--------|-------|-----------------|
| Unit Test Coverage | >90% | Her PR |
| Integration Test Coverage | >80% | Her PR |
| E2E Test Coverage | >70% | Haftalık |
| Sonar Code Quality | A | Her PR |
| Bundle Size | <500KB | Her build |
| Build Time | <2min | Her build |

## Önyüz Odaklı Geliştirme Roadmap

Aşağıda önyüz (front-end) tarafında yapılması planlanan geliştirmeler listelenmiştir:

- [ ] LandingPage UI iyileştirmeleri (buton stilleri, renk uyumu ve responsive tasarım)
- [ ] Navbar ve ThemeToggle: Kullanıcı dostu ve etkileşimli menü oluşturulması
- [ ] Dashboard sayfası: Kullanıcı bilgileri, widget'ların düzenlenmesi ve veri görselleştirmelerin optimize edilmesi
- [ ] PredictionForm ve Chart: Kullanım kolaylığı ve doğruluk için geliştirmeler
- [ ] Kullanıcı testleri, performans ve erişilebilirlik iyileştirmeleri
- [ ] Ek özelliklerin eklenmesi (örneğin: yatırım portföyü yönetimi, detaylı analiz raporları)

Sonraki adım olarak projeyi ayağa kaldırıp, üretilen çıktıları test etmeye başlayacağız.

_Son Güncelleme: 15 Mart 2024_ 