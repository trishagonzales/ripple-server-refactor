import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, ErrorMap } from '@app/core';
import { AuthService } from 'features/shared/auth';
import { LogoutInput, LogoutOutput } from './logout.dto';

type I = LogoutInput;
type O = LogoutOutput;

@Injectable()
export class LogoutUsecase implements Usecase<I, O> {
  constructor(private auth: AuthService) {}

  async exec({ me }: I) {
    try {
      if (!me.sessionRefreshToken) throw BaseError.unauthenticated<O>();

      this.auth.logout(me.sessionRefreshToken);

      return Result.ok<O>();
    } catch (e) {
      return ErrorMap.toController<O>(e);
    }
  }
}
