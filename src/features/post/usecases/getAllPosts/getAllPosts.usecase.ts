import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError } from '@app/core';
import { GetAllPostsInput, GetAllPostsOutput } from './getAllPosts.dto';
import { PostRepo } from '../../repos';
import { PostMap } from '../../mappers';

type I = GetAllPostsInput;
type O = GetAllPostsOutput;

@Injectable()
export class GetAllPostsUsecase implements Usecase<I, O> {
  constructor(private postRepo: PostRepo) {}

  async exec() {
    try {
      const posts = await this.postRepo.getAllPosts();

      const postDtos = posts.map((post) => PostMap.domainToDTO(post));

      return Result.ok<O>({ posts: postDtos });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
