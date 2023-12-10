import { Injectable } from '@nestjs/common';
import { BaseError, Result, Usecase } from '@app/core';
import { Guest } from '@account/domain';
import { GuestMap } from '@account/mappers';
import { UserValidation } from 'features/shared/auth';
import { LoginAsGuestInput, LoginAsGuestOutput } from './loginAsGuest.dto';

type I = LoginAsGuestInput;
type O = LoginAsGuestOutput;

@Injectable()
export class LoginAsGuestUsecase implements Usecase<I, O> {
  constructor(private auth: UserValidation) {}

  async exec() {
    try {
      const guest = Guest.Validate();
      const authTokens = await this.auth.login(guest);

      return Result.ok({
        userData: GuestMap.domainToDTO(guest),
        authTokens,
      });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
