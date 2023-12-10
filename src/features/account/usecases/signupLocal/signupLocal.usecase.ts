import { Injectable } from '@nestjs/common';
import { Usecase, Result, ErrorMap } from '@app/core';
import { AuthService, AuthTokens } from 'features/shared/auth';
import { SignupLocalInput, SignupLocalOutput } from './signupLocal.dto';
import { SignupLocalErrors } from './signupLocal.error';
import {
  Account,
  Email,
  Password,
  UserRepo,
  AccountRepo,
  AccountMap,
} from 'features/account/index';

type I = SignupLocalInput;
type O = SignupLocalOutput;

@Injectable()
export class SignupLocalUsecase implements Usecase<I, O> {
  private input: I;
  private email: Email;
  private password: Password;
  private account: Account;
  private tokens: AuthTokens;

  constructor(
    private userRepo: UserRepo,
    private accountRepo: AccountRepo,
    private auth: AuthService,
  ) {}

  async exec(input: I) {
    try {
      this.input = input;
      this._checkIfUserAlreadyExists();
      this._createEmail();
      this._createPassword();
      this._createAccount();
      this._saveToDb();
      this._loginUser();

      return Result.ok({
        tokens: this.tokens,
        account: AccountMap.domainToDTO(this.account),
      });
    } catch (e) {
      return ErrorMap.toController<O>(e);
    }
  }

  private async _checkIfUserAlreadyExists() {
    if (await this.userRepo.isExistByEmail(this.input.email))
      throw SignupLocalErrors.EmailAlreadyRegistered();
  }

  private _createEmail() {
    const emailOrError = Email.Validate(this.input.email);
    if (emailOrError.isFailure) throw emailOrError;
    this.email = emailOrError.value;
  }

  private _createPassword() {
    const passwordOrError = Password.Validate(this.input.password);
    if (passwordOrError.isFailure) throw passwordOrError;
    this.password = passwordOrError.value;
  }

  private async _createAccount() {
    const accountOrError = await Account.CreateWithPassword({
      email: this.email,
      password: this.password,
    });
    if (accountOrError.isFailure) throw accountOrError;
    this.account = accountOrError.value;
  }

  private async _saveToDb() {
    await this.accountRepo.save(this.account);
  }

  private async _loginUser() {
    this.tokens = await this.auth.login(this.account);
  }
}
