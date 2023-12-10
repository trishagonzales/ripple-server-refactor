import nodemailer, { Transporter } from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '@app/config';
import Mail from 'nodemailer/lib/mailer';

type MailerArg = Mail.Options;

@Injectable()
export class NodemailerService {
  private _senderEmail = 'trishagonzales.dev@gmail.com';
  private _transport: Transporter;

  constructor(private config: AppConfig) {
    this._initializeTransport();
  }

  private _initializeTransport() {
    this._transport = nodemailer.createTransport(
      sendgrid({ apiKey: this.config.mail.apiKey }),
    );
  }

  async send(arg: MailerArg) {
    await this._transport.sendMail({
      from: this._senderEmail,
      ...arg,
    });
  }
}
