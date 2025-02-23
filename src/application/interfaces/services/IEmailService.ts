import { Result } from '../../../core/logic/Result';

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<Result<void, string>>;
  sendVerificationEmail(email: string, token: string): Promise<Result<void, string>>;
  sendPasswordResetEmail(email: string, token: string): Promise<Result<void, string>>;
  sendWelcomeEmail(email: string, name: string): Promise<Result<void, string>>;
  sendPortfolioSummary(email: string, portfolioId: string): Promise<Result<void, string>>;
  sendInvestmentConfirmation(email: string, investmentId: string): Promise<Result<void, string>>;
  sendMarketAlert(email: string, symbol: string, price: number): Promise<Result<void, string>>;
  sendPerformanceReport(email: string, portfolioId: string, startDate: Date, endDate: Date): Promise<Result<void, string>>;
} 