import bcrypt from 'bcryptjs';
import isStrongPassword from 'validator/lib/isStrongPassword';
import { Result, BaseError, AppError } from '@app/core';

interface Props {
  password: string;
  isHashed: boolean;
}

export class Password {
  private constructor(private _props: Props) {}
  private static readonly MIN_LENGTH = 8;
  private static readonly MIN_NUMBERS = 1;
  private static readonly MIN_UPPERCASE = 1;

  static Validate(password: string) {
    if (!password) {
      return BaseError.badRequest<Password>('Password required');
    }

    const passwordIsStrong = this._validateIfStrongPassword(password);
    if (!passwordIsStrong) {
      return BaseError.badRequest<Password>(
        `Password must contain atleast ${this.MIN_LENGTH} characters, ${this.MIN_NUMBERS} number and ${this.MIN_UPPERCASE} uppercase letter.`,
      );
    }

    return Result.ok(new Password({ password, isHashed: false }));
  }

  private static _validateIfStrongPassword(password: string) {
    return isStrongPassword(password, {
      minLength: this.MIN_LENGTH,
      minNumbers: this.MIN_NUMBERS,
      minUppercase: this.MIN_UPPERCASE,
    });
  }

  static Parse(password: string) {
    return new Password({ password, isHashed: true });
  }

  get value() {
    return this._props.password;
  }
  get isHashed() {
    return this._props.isHashed;
  }

  async validateIfCorrect(unhashedPassword: string) {
    if (!this._props.isHashed) {
      return unhashedPassword === this.value;
    }
    return bcrypt.compare(unhashedPassword, this._props.password);
  }

  /**
   *  Don't forget to hash when persisting newly created password on repo layer
   */
  async hashPassword() {
    if (this._props.isHashed) {
      throw new AppError('Password is already hashed.', 'Password.ts');
    }
    return bcrypt.hash(this._props.password, await bcrypt.genSalt());
  }
}
