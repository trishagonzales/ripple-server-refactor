import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, ErrorMap } from '@app/core';
import { DeleteAccountInput, DeleteAccountOutput } from './deleteAccount.dto';
import { UserRepo } from '../..';

type I = DeleteAccountInput;
type O = DeleteAccountOutput;

@Injectable()
export class DeleteAccountUsecase implements Usecase<I, O> {
  constructor(private userRepo: UserRepo) {}

  async exec({ me, password }: I) {
    try {
      if (me.password && password) {
        const isPasswordValid = await me.password.validateIfCorrect(password);
        if (isPasswordValid) {
          await this.userRepo.deleteOne(me.id);
        }

        return BaseError.badRequest<O>('Password invalid');
      }

      if (!me.password && me.googleRefreshToken) {
        await this.userRepo.deleteOne(me.id);
      }

      return Result.ok<O>();
    } catch (e) {
      return ErrorMap.toController<O>(e);
    }
  }
}
