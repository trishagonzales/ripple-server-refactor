import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { DeletePostInput, DeletePostOutput } from './deletePost.dto';
import { PostRepo } from '../../repos';

type I = DeletePostInput;
type O = DeletePostOutput;

@Injectable()
export class DeletePostUsecase implements Usecase<I, O> {
  constructor(private postRepo: PostRepo) {}

  async exec({ me, postId }: I) {
    try {
      const postOrError = await this.postRepo.getOne(postId);
      if (postOrError.isFailure) return UsecaseError.Other<O>(postOrError);

      const post = postOrError.value;

      const isUserTheAuthor = post.validateAuthor(me.id);
      if (!isUserTheAuthor)
        return BaseError.unauthorized<O>('User is not the author');

      await this.postRepo.deleteOne(postId);

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
