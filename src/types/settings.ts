export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: number;
  animations: boolean;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
    priceAlerts: boolean;
    newsAlerts: boolean;
  };
  push: {
    enabled: boolean;
    tradeConfirmations: boolean;
    priceAlerts: boolean;
    securityAlerts: boolean;
  };
  sms: {
    enabled: boolean;
    criticalAlerts: boolean;
    loginAlerts: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  showEmail: boolean;
  showPhone: boolean;
  showActivity: boolean;
  allowDataCollection: boolean;
  marketingEmails: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email';
  sessionTimeout: number;
  trustedDevices: Array<{
    id: string;
    name: string;
    lastUsed: string;
    browser: string;
    os: string;
  }>;
  loginHistory: Array<{
    id: string;
    timestamp: string;
    ip: string;
    location: string;
    device: string;
    status: 'success' | 'failed';
  }>;
}

export interface LanguageSettings {
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  timezone: string;
  currency: string;
  numberFormat: string;
}

export interface SettingsState {
  loading: boolean;
  error: string | null;
  success: string | null;
  theme: ThemeSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  language: LanguageSettings;
  isEditing: boolean;
}

export interface SettingsProps {
  initialData?: Partial<SettingsState>;
} 