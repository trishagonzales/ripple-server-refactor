import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import {
  UpdatePasswordInput,
  UpdatePasswordOutput,
} from './updatePassword.dto';
import { AccountRepo, Password } from '../..';

type I = UpdatePasswordInput;
type O = UpdatePasswordOutput;

@Injectable()
export class UpdatePasswordUsecase implements Usecase<I, O> {
  constructor(private accountRepo: AccountRepo) {}

  async exec({ me, password }: I) {
    try {
      const passwordOrError = Password.Validate(password);
      if (passwordOrError.isFailure)
        return UsecaseError.Other<O>(passwordOrError);

      me.updatePassword(passwordOrError.value);
      await this.accountRepo.save(me);

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
