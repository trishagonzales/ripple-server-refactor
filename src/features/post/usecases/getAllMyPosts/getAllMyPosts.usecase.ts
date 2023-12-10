import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError } from '@app/core';
import { GetAllMyPostsInput, GetAllMyPostsOutput } from './getAllMyPosts.dto';
import { PostRepo } from '../../repos';
import { PostMap } from '../../mappers';

type I = GetAllMyPostsInput;
type O = GetAllMyPostsOutput;

@Injectable()
export class GetAllMyPostsUsecase implements Usecase<I, O> {
  constructor(private postRepo: PostRepo) {}

  async exec({ me }: I) {
    try {
      const posts = await this.postRepo.getAllPostsOfOneUser(me.id);

      const postDtos = posts.map((post) => PostMap.domainToDTO(post));

      return Result.ok<O>({ posts: postDtos });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
