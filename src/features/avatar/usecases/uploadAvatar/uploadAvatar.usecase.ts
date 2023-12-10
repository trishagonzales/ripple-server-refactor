import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { UploadAvatarInput, UploadAvatarOutput } from './uploadAvatar.dto';
import { AvatarRepo } from '../../Avatar.repo';
import { AvatarUpload } from '../../../shared/upload';

type I = UploadAvatarInput;
type O = UploadAvatarOutput;

@Injectable()
export class UploadAvatarUsecase implements Usecase<I, O> {
  constructor(
    private avatarUpload: AvatarUpload,
    private avatarRepo: AvatarRepo,
  ) {}

  async exec({ me, file }: I) {
    try {
      await this.avatarUpload.upload(file, me.profile);

      const uploadResult = this.avatarUpload.getUploadResult();
      if (uploadResult.isFailure) return UsecaseError.Other<O>(uploadResult);

      const avatar = uploadResult.value;
      await this.avatarRepo.save(avatar);

      return Result.ok<O>({
        avatarUrl: avatar.url,
      });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
