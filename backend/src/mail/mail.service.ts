import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

type Mail = { to: string; subject: string; text: string; html: string };

/**
 * Sends email over SMTP (e.g. Gmail with an App Password). Without SMTP settings,
 * MAIL_LOG_ONLY=true makes it print messages to the server log instead — for local
 * development only, never in production.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;
  private readonly logOnly: boolean;

  constructor(config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    const port = Number(config.get('SMTP_PORT')) || 465;

    this.transporter =
      host && user && pass
        ? createTransport({ host, port, secure: port === 465, auth: { user, pass } })
        : null;
    this.from = config.get<string>('MAIL_FROM') || (user ? `PointBridge Consulting <${user}>` : 'PointBridge Consulting');
    this.logOnly = !this.transporter && config.get<string>('MAIL_LOG_ONLY') === 'true';

    if (this.logOnly) {
      this.logger.warn('SMTP is not configured: emails will be printed to this log (MAIL_LOG_ONLY=true).');
    }
  }

  /** Throws before any work is done if email cannot be delivered at all. */
  assertAvailable() {
    if (!this.transporter && !this.logOnly) {
      throw new ServiceUnavailableException('Email is not configured on the server. Please contact support.');
    }
  }

  async send(mail: Mail) {
    this.assertAvailable();
    if (!this.transporter) {
      this.logger.warn(`[MAIL_LOG_ONLY] To: ${mail.to} | ${mail.subject}\n${mail.text}`);
      return;
    }
    await this.transporter.sendMail({ from: this.from, ...mail });
  }
}
