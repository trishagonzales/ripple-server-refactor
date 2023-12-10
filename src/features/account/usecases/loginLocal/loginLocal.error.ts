import { BaseError } from '@app/core';
import { LoginLocalOutput } from './loginLocal.dto';

type O = LoginLocalOutput;

export class LoginLocalErrors {
  static InvalidCredentials() {
    return BaseError.unauthenticated<O>('Invalid username, email or password.');
  }
}
