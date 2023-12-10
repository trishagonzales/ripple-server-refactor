import { Injectable, Scope } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { UpdateEmailInput, UpdateEmailOutput } from './updateEmail.dto';
import { Email, AccountRepo } from '../..';

type I = UpdateEmailInput;
type O = UpdateEmailOutput;

@Injectable({ scope: Scope.REQUEST })
export class UpdateEmailUsecase implements Usecase<I, O> {
  constructor(private accountRepo: AccountRepo) {}

  async exec({ me, email }: I) {
    try {
      const emailOrError = Email.Validate(email);
      if (emailOrError.isFailure) return UsecaseError.Other<O>(emailOrError);

      me.updateEmail(emailOrError.value);
      await this.accountRepo.save(me);

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
