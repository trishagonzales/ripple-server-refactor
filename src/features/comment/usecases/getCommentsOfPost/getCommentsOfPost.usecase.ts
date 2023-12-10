import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError } from '@app/core';
import {
  GetCommentsOfPostInput,
  GetCommentsOfPostOutput,
} from './getCommentsOfPost.dto';
import { CommentRepo, CommentMap } from '../..';

type I = GetCommentsOfPostInput;
type O = GetCommentsOfPostOutput;

@Injectable()
export class GetCommentsOfPostUsecase implements Usecase<I, O> {
  constructor(private commentRepo: CommentRepo) {}

  async exec({ postId }: I) {
    try {
      const comments = await this.commentRepo.getCommentsOfPost(postId);

      return Result.ok<O>({
        comments:
          comments.length === 0
            ? []
            : comments.map((comment) => CommentMap.toDTO(comment)),
      });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
