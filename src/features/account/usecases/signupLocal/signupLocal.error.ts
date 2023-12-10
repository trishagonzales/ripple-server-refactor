import { BaseError } from '@app/core';
import { SignupLocalOutput } from './signupLocal.dto';

type O = SignupLocalOutput;

export class SignupLocalErrors {
  static EmailAlreadyRegistered() {
    return BaseError.conflict<O>('Email already registered.');
  }
}
