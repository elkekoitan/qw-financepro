# FinancePro Tasarım Sistemi

## 1. Renk Paleti

### Ana Renkler
```css
--color-gold-light: #FFD700;    /* Parlak altın */
--color-gold-main: #BFA46F;     /* Ana altın tonu */
--color-gold-dark: #8B7355;     /* Koyu altın */
--color-dark-bg: #0A0A0A;       /* Arka plan */
--color-dark-surface: #1A1A1A;  /* Yüzey rengi */
```

### Metin Renkleri
```css
--text-primary: rgba(255, 255, 255, 1);      /* Ana metin */
--text-secondary: rgba(255, 255, 255, 0.7);  /* İkincil metin */
--text-muted: rgba(255, 255, 255, 0.5);      /* Soluk metin */
```

### Gradyanlar
```css
--gradient-primary: linear-gradient(135deg, #FFD700 0%, #BFA46F 100%);
--gradient-secondary: linear-gradient(135deg, #BFA46F 0%, #8B7355 100%);
--gradient-dark: linear-gradient(to bottom, rgba(10, 10, 10, 0.95), rgba(0, 0, 0, 0.98));
--gradient-glass: linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(17,17,17,0.8) 100%);
```

## 2. Tipografi

### Font Ailesi
- Ana Font: "Playfair Display" (Başlıklar için)
- İkincil Font: "Plus Jakarta Sans" (Gövde metni için)

### Font Boyutları
```css
--font-size-h1: 4.5rem;   /* 72px */
--font-size-h2: 3rem;     /* 48px */
--font-size-h3: 2.5rem;   /* 40px */
--font-size-h4: 2rem;     /* 32px */
--font-size-h5: 1.5rem;   /* 24px */
--font-size-h6: 1.25rem;  /* 20px */
--font-size-body: 1rem;   /* 16px */
--font-size-small: 0.875rem; /* 14px */
```

### Font Ağırlıkları
```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

## 3. Boşluklar ve Ölçüler

### Kenar Boşlukları
```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
--spacing-2xl: 4rem;    /* 64px */
```

### Border Radius
```css
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 8px;
--radius-xl: 16px;
```

## 4. Animasyonlar ve Geçişler

### Temel Geçişler
```css
--transition-fast: all 0.2s ease;
--transition-default: all 0.3s ease;
--transition-slow: all 0.5s ease;
```

### Hareket Eğrileri
```javascript
const springConfig = {
  stiff: 300,
  damping: 20,
  mass: 1
};

const easeOutConfig = {
  duration: 0.8,
  ease: "easeOut"
};
```

## 5. Efektler

### Gölgeler
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.3);
```

### Cam Efekti (Glassmorphism)
```css
--glass-bg: rgba(26, 26, 26, 0.6);
--glass-border: 1px solid rgba(191, 164, 111, 0.1);
--glass-blur: blur(10px);
```

## 6. Bileşen Standartları

### Butonlar

#### Primary Button
```css
.button-primary {
  background: var(--gradient-primary);
  color: var(--color-dark-bg);
  padding: 12px 32px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-default);
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

#### Outline Button
```css
.button-outline {
  border: 1px solid rgba(191, 164, 111, 0.5);
  color: var(--color-gold-main);
  background: transparent;
  transition: var(--transition-default);
}

.button-outline:hover {
  background: rgba(191, 164, 111, 0.1);
  border-color: var(--color-gold-main);
}
```

### Kartlar
```css
.card {
  background: var(--gradient-glass);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  border-radius: var(--radius-lg);
  transition: var(--transition-default);
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(191, 164, 111, 0.3);
  box-shadow: var(--shadow-lg);
}
```

### Form Elemanları
```css
.input {
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(191, 164, 111, 0.2);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: var(--transition-default);
}

.input:hover {
  border-color: rgba(191, 164, 111, 0.4);
}

.input:focus {
  border-color: var(--color-gold-main);
  box-shadow: 0 0 0 2px rgba(191, 164, 111, 0.1);
}
```

## 7. Animasyon Standartları

### Sayfa Geçişleri
```javascript
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.8,
    ease: "easeOut"
  }
};
```

### Hover Efektleri
```javascript
const hoverScale = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10
  }
};

const hoverLift = {
  y: -4,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20
  }
};
```

### Liste Animasyonları
```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};
```

## 8. Responsive Tasarım Breakpoint'leri

```css
--breakpoint-xs: 0px;
--breakpoint-sm: 600px;
--breakpoint-md: 960px;
--breakpoint-lg: 1280px;
--breakpoint-xl: 1920px;
```

## 9. En İyi Uygulamalar

### Erişilebilirlik
- Tüm etkileşimli elementler için `:focus` durumları
- ARIA etiketleri
- Klavye navigasyonu desteği
- Yeterli renk kontrastı

### Performans
- Lazy loading görüntüler
- Code splitting
- Önbelleğe alma stratejileri
- Optimize edilmiş animasyonlar

### Kullanıcı Deneyimi
- Yükleme durumları
- Hata durumları
- Başarı geri bildirimleri
- Yumuşak geçişler ve animasyonlar

## 10. Tema Sistemi

### Tema Değişkenleri
```typescript
const theme = {
  mode: 'dark',
  colors: {
    primary: {
      light: '#FFD700',
      main: '#BFA46F',
      dark: '#8B7355'
    },
    background: {
      default: '#0A0A0A',
      paper: '#1A1A1A'
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 0.7)'
    }
  },
  typography: {
    fontFamily: '"Playfair Display", "Plus Jakarta Sans", sans-serif',
    h1: {
      fontSize: '4.5rem',
      fontWeight: 300,
      letterSpacing: '0.02em'
    }
    // ... diğer tipografi stilleri
  },
  spacing: (factor: number) => `${factor * 8}px`,
  shape: {
    borderRadius: 4
  },
  transitions: {
    duration: {
      short: 200,
      standard: 300,
      long: 500
    }
  }
};
```

_Son Güncelleme: 15 Mart 2024_ 