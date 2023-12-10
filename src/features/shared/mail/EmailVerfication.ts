import fs from 'fs/promises';
import Handlebars from 'handlebars';
import { v4 } from 'uuid';
import { IMailPayload } from './MailPayload.interface';

interface HtmlTemplateVariables {
  callbackUrl: string;
}

export class EmailVerification implements IMailPayload {
  static TEMPLATE_FILENAME = './templates/verifyEmail.html';

  public readonly title = 'Verify your email';
  private _html: string;
  private _callbackToken: string;
  private _callbackUrl: string;

  buildPayload(frontendUrl: string) {
    this._generateCallbackToken();
    this._generateCallbackUrl(frontendUrl);
    this._generateHtml();
  }

  private _generateCallbackToken() {
    this._callbackToken = v4();
  }

  private _generateCallbackUrl(frontendUrl: string) {
    return frontendUrl + '/verify-email/' + this._callbackToken;
  }

  private async _generateHtml() {
    const htmlTemplate = await fs.readFile(
      EmailVerification.TEMPLATE_FILENAME,
      { encoding: 'utf-8' },
    );
    const templater = Handlebars.compile<HtmlTemplateVariables>(htmlTemplate);

    this._html = templater({ callbackUrl: this._callbackUrl });
  }

  get html() {
    return this._html;
  }
  get callbackToken() {
    return this._callbackToken;
  }
}
