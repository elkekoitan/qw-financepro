// Rate limit konfigürasyonu için tip
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

// Redis pipeline sonucu için tip
export type RedisPipelineResult = [
  null | Error,
  null | Error,
  number | Error
];

// Rate limit durumu için tip
export interface RateLimitState {
  remaining: number;
  reset: number;
  total: number;
}

// Rate limit yanıtı için tip
export interface RateLimitResponse {
  success: boolean;
  error?: {
    message: string;
    code: string;
  };
  state?: RateLimitState;
} 