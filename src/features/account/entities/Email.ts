import isEmail from 'validator/lib/isEmail';
import { BaseError, Result } from '@app/core';

export class Email {
  private constructor(private _email: string) {}

  get value() {
    return this._email;
  }

  static Validate(email: string) {
    if (!isEmail(email))
      return BaseError.badRequest<Email>('Not a valid email');

    return Result.ok(new Email(email));
  }

  static Parse(email: string) {
    return new Email(email);
  }
}
