import { Injectable } from '@nestjs/common';
import { Usecase, Result, ErrorMap } from '@app/core';
import { AuthService } from 'features/shared/auth';
import { LoginLocalInput, LoginLocalOutput } from './loginLocal.dto';
import { LoginLocalErrors } from './loginLocal.error';
import { Account, AccountRepo, AccountMap } from '../..';

type I = LoginLocalInput;
type O = LoginLocalOutput;

@Injectable()
export class LoginLocalUsecase implements Usecase<I, O> {
  private usernameOrEmail: string;
  private password: string;
  private account: Account;
  private result: Result<O>;

  constructor(private accountRepo: AccountRepo, private auth: AuthService) {}

  async exec({ usernameOrEmail, password }: I) {
    try {
      this.usernameOrEmail = usernameOrEmail;
      this.password = password;

      const isExistByEmail = await this._isAccountExistByEmail();
      if (isExistByEmail) return this.result;

      const isExistByUsername = await this._isAccountExistByUsername();
      if (isExistByUsername) return this.result;

      throw LoginLocalErrors.InvalidCredentials();
    } catch (e) {
      return ErrorMap.toController<O>(e);
    }
  }

  private async _isAccountExistByEmail(): Promise<boolean> {
    const accountOrError = await this.accountRepo.getOneByEmail(
      this.usernameOrEmail,
    );
    if (accountOrError.isFailure) return false;

    this.account = accountOrError.value;
    this._validatePassword();
    this._createResult();
    return true;
  }

  private async _isAccountExistByUsername(): Promise<boolean> {
    const accountOrError = await this.accountRepo.getOneByUsername(
      this.usernameOrEmail,
    );
    if (accountOrError.isFailure) return false;

    this.account = accountOrError.value;
    this._validatePassword();
    this._createResult();
    return true;
  }

  private async _validatePassword() {
    const isPasswordValid = await this.account.password?.validateIfCorrect(
      this.password,
    );
    if (!isPasswordValid) throw LoginLocalErrors.InvalidCredentials();
  }

  private async _createResult() {
    this.result = Result.ok<O>({
      authTokens: await this.auth.login(this.account),
      userData: AccountMap.domainToDTO(this.account),
    });
  }
}
