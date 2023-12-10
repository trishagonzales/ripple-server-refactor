import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError } from '@app/core';
import { AvatarRepo } from '@account/repos';
import { DeleteAvatarInput, DeleteAvatarOutput } from './deleteAvatar.dto';

type I = DeleteAvatarInput;
type O = DeleteAvatarOutput;

@Injectable()
export class DeleteAvatarUsecase implements Usecase<I, O> {
  constructor(private avatarRepo: AvatarRepo) {}

  async exec({ me }: I) {
    try {
      if (me.profile.avatar) {
        await this.avatarRepo.deleteOne(me.profile.avatar.id);
      }

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
