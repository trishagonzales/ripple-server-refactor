import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError, ErrorMap } from '@app/core';
import { AuthService } from 'features/shared/auth';
import {
  ResendAccessTokenInput,
  ResendAccessTokenOutput,
} from './resendAccessToken.dto';

type I = ResendAccessTokenInput;
type O = ResendAccessTokenOutput;

@Injectable()
export class ResendAccessTokenUsecase implements Usecase<I, O> {
  private input: I;
  private accessToken: string;

  constructor(private auth: AuthService) {}

  async exec(input: I) {
    try {
      this.input = input;
      this._throwUnauthenticatedIfTheresNoRefreshToken();
      this._generateAccessToken();

      return Result.ok<O>(this.accessToken);
    } catch (e) {
      return ErrorMap.toController<O>(e);
    }
  }

  private _throwUnauthenticatedIfTheresNoRefreshToken() {
    if (!this.input.me.sessionRefreshToken)
      throw BaseError.unauthenticated<O>();
  }

  private async _generateAccessToken() {
    const refreshToken = this.input.me.sessionRefreshToken;
    const tokenOrError = await this.auth.regenerateAccessToken(refreshToken);
    if (tokenOrError.isFailure) throw tokenOrError;
  }
}
