import { Injectable } from '@nestjs/common';
import { AppConfig } from '@app/config';
import { AppError } from '@app/core';
import { Account } from '../../account';
import { CacheService } from '../cache';
import { IMailPayload, NodemailerService } from '.';

@Injectable()
export class MailService {
  private _mailPayload: IMailPayload;
  private _account: Account;

  constructor(
    private nodemailer: NodemailerService,
    private config: AppConfig,
    private cache: CacheService,
  ) {}

  configure(mailPayload: IMailPayload, account: Account) {
    mailPayload.buildPayload(this.config.app.frontendUrl);
    this._mailPayload = mailPayload;
    this._account = account;
  }

  async send() {
    this._throwIfServiceIsNotYetConfigured();
    this._executeSend();
    this._setUserIdUsingCallbackTokenAsKeyInCache();
  }

  private _throwIfServiceIsNotYetConfigured() {
    if (!this._mailPayload || !this._account)
      throw new AppError(
        'MailPayload and account property is required. Set payload (EmailVerification, ForgotPassword etc.) and account in configure method first before executing send.',
        'Mail.service.ts',
      );
  }

  private async _executeSend() {
    await this.nodemailer.send({
      to: this._account.email.value,
      html: this._mailPayload.html,
      subject: this._mailPayload.title,
    });
  }

  private async _setUserIdUsingCallbackTokenAsKeyInCache() {
    await this.cache.setMailTokenData(
      this._mailPayload.callbackToken,
      this._account.id,
    );
  }
}
