import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { GetOnePostInput, GetOnePostOutput } from './getOnePost.dto';
import { PostRepo } from '../../repos';
import { PostMap } from '../../mappers';

type I = GetOnePostInput;
type O = GetOnePostOutput;

@Injectable()
export class GetOnePostUsecase implements Usecase<I, O> {
  constructor(private postRepo: PostRepo) {}

  async exec({ postId }: I) {
    try {
      const postOrError = await this.postRepo.getOne(postId);
      if (postOrError.isFailure) return UsecaseError.Other<O>(postOrError);

      return Result.ok<O>({
        post: PostMap.domainToDTO(postOrError.value),
      });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
