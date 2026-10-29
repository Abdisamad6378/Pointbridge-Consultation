import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'node:crypto';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service.js';
import { UsersService } from '../users/users.service.js';
import { PasswordResetCode } from './password-reset-code.entity.js';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto.js';

export const RESET_CODE_TTL_MINUTES = 10;
const RESEND_COOLDOWN_MS = 60_000;
const MAX_ATTEMPTS = 5;
const INVALID_CODE = 'Invalid or expired code';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    @InjectRepository(PasswordResetCode) private readonly codes: Repository<PasswordResetCode>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Emails a 6-digit code if the account exists. Callers get the same response either
   * way, so this cannot be used to find out which emails are registered.
   */
  async requestCode(dto: ForgotPasswordDto) {
    this.mailService.assertAvailable();

    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) return;

    const latest = await this.codes.findOne({ where: { userId: user.id }, order: { createdAt: 'DESC' } });
    if (latest && Date.now() - new Date(latest.createdAt).getTime() < RESEND_COOLDOWN_MS) return;

    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    // Only one active code per user: a new request replaces any earlier one.
    await this.codes.delete({ userId: user.id });
    await this.codes.save(
      this.codes.create({
        userId: user.id,
        codeHash: await bcrypt.hash(code, 10),
        expiresAt: new Date(Date.now() + RESET_CODE_TTL_MINUTES * 60_000),
      }),
    );

    try {
      await this.mailService.send({
        to: user.email,
        subject: `${code} is your PointBridge password reset code`,
        text:
          `Hi ${user.name},\n\nYour password reset code is ${code}.\n` +
          `It expires in ${RESET_CODE_TTL_MINUTES} minutes and can be used once.\n\n` +
          `If you didn't ask to reset your password, you can ignore this email.\n\nPointBridge Consulting`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1f2937">
            <h2 style="color:#0b4ea2">Reset your password</h2>
            <p>Hi ${escapeHtml(user.name)},</p>
            <p>Use this code to reset your PointBridge password:</p>
            <p style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:24px 0">${code}</p>
            <p>It expires in <strong>${RESET_CODE_TTL_MINUTES} minutes</strong> and can be used once.</p>
            <p style="color:#6b7280;font-size:13px">If you didn't ask to reset your password, you can ignore this email.</p>
          </div>`,
      });
    } catch (error) {
      await this.codes.delete({ userId: user.id });
      this.logger.error(`Failed to send reset code to user ${user.id}`, error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }

  /** Verifies the code and sets the new password. Returns the user on success. */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new BadRequestException(INVALID_CODE);

    const entry = await this.codes.findOne({ where: { userId: user.id, expiresAt: MoreThan(new Date()) } });
    if (!entry || entry.attempts >= MAX_ATTEMPTS) throw new BadRequestException(INVALID_CODE);

    if (!(await bcrypt.compare(dto.code, entry.codeHash))) {
      entry.attempts += 1;
      if (entry.attempts >= MAX_ATTEMPTS) {
        await this.codes.delete({ id: entry.id });
        throw new BadRequestException('Too many wrong attempts. Please request a new code.');
      }
      await this.codes.save(entry);
      throw new BadRequestException(INVALID_CODE);
    }

    await this.codes.delete({ userId: user.id });
    return this.usersService.update(user.id, { password: dto.newPassword });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
