import { NextApiRequest, NextApiResponse } from 'next';
import type { User } from '@supabase/supabase-js';

// Genel API yanıt tipi
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Kimlik doğrulama istekleri
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Kullanıcı profili istekleri
export interface UpdateProfileRequest {
  fullName: string;
  phone?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Profil yanıt tipi
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Yatırım profili istekleri
export interface CreateInvestmentProfileRequest {
  riskLevel: number;
  targetReturn: number;
  investmentHorizon: number;
  initialInvestment: number;
  monthlyContribution: number;
  goals: Array<{
    type: string;
    targetAmount: number;
    targetDate: string;
  }>;
}

// Yatırım profili güncelleme isteği tipi
export interface UpdateInvestmentProfileRequest {
  riskTolerance: 'low' | 'medium' | 'high';
  investmentGoals: string[];
  preferredInvestmentTypes: string[];
  investmentHorizon: string;
  monthlyInvestmentAmount?: number;
  initialInvestmentAmount?: number;
}

// Yatırım profili yanıt tipi
export interface InvestmentProfile {
  id: string;
  user_id: string;
  risk_tolerance: 'low' | 'medium' | 'high';
  investment_goals: string[];
  preferred_investment_types: string[];
  investment_horizon: string;
  monthly_investment_amount?: number;
  initial_investment_amount?: number;
  created_at: string;
  updated_at: string;
}

// Analiz istekleri
export interface MarketAnalysisRequest {
  symbol: string;
  timeframe: string;
  indicators: string[];
  from: string;
  to: string;
}

// Analiz isteği tipi
export interface AnalysisRequest {
  symbol: string;
  timeframe: string;
  indicators?: string[];
}

// Analiz yanıt tipi
export interface Analysis {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  technicalIndicators: {
    name: string;
    value: number;
    signal: 'buy' | 'sell' | 'neutral';
    description: string;
  }[];
  chartData: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  news: {
    id: string;
    title: string;
    content: string;
    source: string;
    url: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    publishedAt: string;
  }[];
}

// Rapor istekleri
export interface GenerateReportRequest {
  type: 'performance' | 'tax' | 'portfolio' | 'risk' | 'transaction';
  dateRange: {
    start: string;
    end: string;
  };
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  includeSummary: boolean;
  includeTransactions: boolean;
}

// Rapor oluşturma isteği tipi
export interface CreateReportRequest {
  title: string;
  description?: string;
  type: 'portfolio' | 'performance' | 'risk' | 'custom';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: {
    assets?: string[];
    metrics?: string[];
    groupBy?: string;
  };
}

// Rapor yanıt tipi
export interface Report {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'portfolio' | 'performance' | 'risk' | 'custom';
  date_range: {
    start: string;
    end: string;
  };
  filters?: {
    assets?: string[];
    metrics?: string[];
    groupBy?: string;
  };
  data: any; // Rapor tipine göre değişken veri yapısı
  created_at: string;
  updated_at: string;
}

// Ayarlar istekleri
export interface UpdateSettingsRequest {
  theme?: {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy?: {
    profileVisibility: 'public' | 'private' | 'connections';
    showEmail: boolean;
    showPhone: boolean;
  };
  security?: {
    twoFactorEnabled: boolean;
    twoFactorMethod: 'app' | 'sms' | 'email';
    sessionTimeout: number;
  };
  language?: {
    language: string;
    timeFormat: '12h' | '24h';
    timezone: string;
    currency: string;
  };
}

// API Handler tipleri
export type ApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<T>>
) => Promise<void> | void;

// Middleware tipleri
export interface AuthenticatedRequest extends NextApiRequest {
  user: User;
} 