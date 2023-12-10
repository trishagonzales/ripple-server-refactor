import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { LikePostInput, LikePostOutput } from './likePost.dto';
import { PostRepo } from '../../repos';

type I = LikePostInput;
type O = LikePostOutput;

@Injectable()
export class LikePostUsecase implements Usecase<I, O> {
  constructor(private postRepo: PostRepo) {}

  async exec({ me, postId }: I) {
    try {
      const postOrError = await this.postRepo.getOne(postId);
      if (postOrError.isFailure) return UsecaseError.Other<O>(postOrError);

      await this.postRepo.addUserToLikes(postId, me.id);

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
