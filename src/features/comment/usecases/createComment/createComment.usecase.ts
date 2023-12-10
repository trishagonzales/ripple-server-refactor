import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { CreateCommentInput, CreateCommentOutput } from './createComment.dto';
import { Comment, CommentRepo, CommentMap } from '../..';

type I = CreateCommentInput;
type O = CreateCommentOutput;

@Injectable()
export class CreateCommentUsecase implements Usecase<I, O> {
  constructor(private commentRepo: CommentRepo) {}

  async exec({ me, dto }: I) {
    try {
      const commentOrError = await Comment.Create({
        body: dto.body,
        authorId: me.id,
        postId: dto.postId,
      });
      if (commentOrError.isFailure)
        return UsecaseError.Other<O>(commentOrError);

      const comment = commentOrError.value;

      await this.commentRepo.save(comment);

      return Result.ok<O>({ comment: CommentMap.toDTO(comment) });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
