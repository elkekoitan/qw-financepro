import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { IEmailService, EmailOptions } from '@/application/interfaces/services/IEmailService';
import { Result } from '@/core/logic/Result';

export class SendgridEmailService implements IEmailService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not defined in environment variables');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(options: EmailOptions): Promise<Result<void, string>> {
    try {
      const msg: MailDataRequired = {
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
        attachments: options.attachments?.map(attachment => ({
          filename: attachment.filename,
          content: attachment.content.toString('base64'),
          type: attachment.contentType,
          disposition: 'attachment'
        })),
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo
      };

      await sgMail.send(msg);
      return Result.ok<void>(undefined);
    } catch (error: any) {
      console.error('Error sending email:', error);
      return Result.fail<void>(error.message || 'Failed to send email');
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<Result<void, string>> {
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
    
    const options: EmailOptions = {
      to: email,
      subject: 'FinancePro - E-posta Adresinizi Doğrulayın',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>E-posta Adresinizi Doğrulayın</h2>
          <p>FinancePro'ya hoş geldiniz! E-posta adresinizi doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
          <p>
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
              E-posta Adresimi Doğrula
            </a>
          </p>
          <p>Bu bağlantı 24 saat içinde geçerliliğini yitirecektir.</p>
          <p>Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `
    };

    return this.sendEmail(options);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<Result<void, string>> {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
    
    const options: EmailOptions = {
      to: email,
      subject: 'FinancePro - Şifre Sıfırlama Talebi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Şifrenizi Sıfırlayın</h2>
          <p>FinancePro hesabınız için şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
              Şifremi Sıfırla
            </a>
          </p>
          <p>Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.</p>
          <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `
    };

    return this.sendEmail(options);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<Result<void, string>> {
    const options: EmailOptions = {
      to: email,
      subject: 'FinancePro\'ya Hoş Geldiniz!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hoş Geldiniz, ${name}!</h2>
          <p>FinancePro'ya kayıt olduğunuz için teşekkür ederiz. Finansal geleceğinizi şekillendirme yolculuğunuzda size yardımcı olmaktan mutluluk duyacağız.</p>
          <h3>Başlangıç için birkaç öneri:</h3>
          <ul>
            <li>Profilinizi tamamlayın</li>
            <li>İlk portföyünüzü oluşturun</li>
            <li>Yatırım hedeflerinizi belirleyin</li>
          </ul>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
              Dashboard'a Git
            </a>
          </p>
          <p>Herhangi bir sorunuz olursa, destek ekibimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
        </div>
      `
    };

    return this.sendEmail(options);
  }

  async sendPortfolioSummary(email: string, portfolioId: string): Promise<Result<void, string>> {
    const options: EmailOptions = {
      to: email,
      subject: 'FinancePro - Portföy Özeti',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Portföy Özeti</h2>
          <p>Portföyünüzün güncel durumu aşağıda yer almaktadır:</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${portfolioId}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
              Portföyümü Görüntüle
            </a>
          </p>
        </div>
      `
    };

    return this.sendEmail(options);
  }

  async sendInvestmentConfirmation(email: string, investmentId: string): Promise<Result<void, string>> {
    const options: EmailOptions = {
      to: email,
      subject: 'FinancePro - Yatırım İşlemi Onayı',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Yatırım İşlemi Onayı</h2>
          <p>Yatırım işleminiz başarıyla gerçekleştirilmiştir.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/investment/${investmentId}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
              Yatırım Detaylarını Görüntüle
            </a>
          </p>
        </div>
      `
    };

    return this.sendEmail(options);
  }

  async sendMarketAlert(email: string, symbol: string, price: number): Promise<Result<void, string>> {
    const options: EmailOptions = {
      to: email,
      subject: `FinancePro - Piyasa Uyarısı: ${symbol}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Piyasa Uyarısı</h2>
          <p>${symbol} için belirlediğiniz fiyat hedefine ulaşıldı.</p>
          <p>Güncel Fiyat: ${price}</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/market/${symbol}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
              Piyasa Detaylarını Görüntüle
            </a>
          </p>
        </div>
      `
    };

    return this.sendEmail(options);
  }

  async sendPerformanceReport(
    email: string,
    portfolioId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Result<void, string>> {
    const options: EmailOptions = {
      to: email,
      subject: 'FinancePro - Performans Raporu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Performans Raporu</h2>
          <p>Portföyünüzün ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} tarihleri arasındaki performans raporu hazırlanmıştır.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${portfolioId}/report" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">
              Raporu Görüntüle
            </a>
          </p>
        </div>
      `
    };

    return this.sendEmail(options);
  }
} 