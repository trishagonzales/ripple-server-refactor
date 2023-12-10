import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { UnlikePostInput, UnlikePostOutput } from './unlikePost.dto';
import { PostRepo } from '../../repos';

type I = UnlikePostInput;
type O = UnlikePostOutput;

@Injectable()
export class UnlikePostUsecase implements Usecase<I, O> {
  constructor(private postRepo: PostRepo) {}

  async exec({ me, postId }: I) {
    try {
      const postOrError = await this.postRepo.getOne(postId);
      if (postOrError.isFailure) return UsecaseError.Other<O>(postOrError);

      await this.postRepo.removeUserFromLikes(postId, me.id);

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
