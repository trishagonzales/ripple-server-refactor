import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { DeleteCommentInput, DeleteCommentOutput } from './deleteComment.dto';
import { CommentRepo } from '../..';

type I = DeleteCommentInput;
type O = DeleteCommentOutput;

@Injectable()
export class DeleteCommentUsecase implements Usecase<I, O> {
  constructor(private commentRepo: CommentRepo) {}

  async exec({ me, commentId }: I) {
    try {
      const commentOrError = await this.commentRepo.getOne(commentId);
      if (commentOrError.isFailure)
        return UsecaseError.Other<O>(commentOrError);

      const comment = commentOrError.value;

      const isUserTheAuthor = comment.validateAuthor(me.id);
      if (!isUserTheAuthor)
        return BaseError.unauthorized<O>('User is not the author');

      await this.commentRepo.deleteOne(commentId);

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
