import sgMail from '@sendgrid/mail';
import { SendgridEmailService } from '../SendgridEmailService';
import { EmailOptions } from '@/application/interfaces/services/IEmailService';

// Mock SendGrid client
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn()
}));

describe('SendgridEmailService', () => {
  let service: SendgridEmailService;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      SENDGRID_API_KEY: 'test_api_key',
      SENDGRID_FROM_EMAIL: 'test@example.com',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
    };
    service = new SendgridEmailService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor', () => {
    it('should throw error when SENDGRID_API_KEY is not defined', () => {
      delete process.env.SENDGRID_API_KEY;
      expect(() => new SendgridEmailService()).toThrow('SENDGRID_API_KEY is not defined in environment variables');
    });

    it('should set API key when SENDGRID_API_KEY is defined', () => {
      expect(sgMail.setApiKey).toHaveBeenCalledWith('test_api_key');
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const options: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test content'
      };

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendEmail(options);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith({
        to: options.to,
        from: 'test@example.com',
        subject: options.subject,
        text: options.text,
        html: undefined,
        attachments: undefined,
        cc: undefined,
        bcc: undefined,
        replyTo: undefined
      });
    });

    it('should handle send error', async () => {
      const options: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Test content'
      };

      const error = new Error('Failed to send');
      (sgMail.send as jest.Mock).mockRejectedValueOnce(error);

      const result = await service.sendEmail(options);

      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('Failed to send');
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email successfully', async () => {
      const email = 'test@example.com';
      const token = 'verification_token';

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendVerificationEmail(email, token);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: expect.stringContaining('Doğrulayın'),
        html: expect.stringContaining('/auth/verify?token=verification_token')
      }));
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const email = 'test@example.com';
      const token = 'reset_token';

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendPasswordResetEmail(email, token);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: expect.stringContaining('Şifre Sıfırlama'),
        html: expect.stringContaining('/auth/reset-password?token=reset_token')
      }));
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const email = 'test@example.com';
      const name = 'John Doe';

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendWelcomeEmail(email, name);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: expect.stringContaining('Hoş Geldiniz'),
        html: expect.stringContaining(name)
      }));
    });
  });

  describe('sendPortfolioSummary', () => {
    it('should send portfolio summary email successfully', async () => {
      const email = 'test@example.com';
      const portfolioId = 'portfolio_123';

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendPortfolioSummary(email, portfolioId);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: expect.stringContaining('Portföy Özeti'),
        html: expect.stringContaining(`/portfolio/${portfolioId}`)
      }));
    });
  });

  describe('sendInvestmentConfirmation', () => {
    it('should send investment confirmation email successfully', async () => {
      const email = 'test@example.com';
      const investmentId = 'investment_123';

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendInvestmentConfirmation(email, investmentId);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: expect.stringContaining('Yatırım İşlemi'),
        html: expect.stringContaining(`/investment/${investmentId}`)
      }));
    });
  });

  describe('sendMarketAlert', () => {
    it('should send market alert email successfully', async () => {
      const email = 'test@example.com';
      const symbol = 'AAPL';
      const price = 150.50;

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendMarketAlert(email, symbol, price);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: expect.stringContaining(symbol),
        html: expect.stringContaining(price.toString())
      }));
    });
  });

  describe('sendPerformanceReport', () => {
    it('should send performance report email successfully', async () => {
      const email = 'test@example.com';
      const portfolioId = 'portfolio_123';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      (sgMail.send as jest.Mock).mockResolvedValueOnce([{ statusCode: 202 }]);

      const result = await service.sendPerformanceReport(email, portfolioId, startDate, endDate);

      expect(result.isSuccess()).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
        to: email,
        subject: expect.stringContaining('Performans Raporu'),
        html: expect.stringContaining(`/portfolio/${portfolioId}/report`)
      }));
    });
  });
}); 