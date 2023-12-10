import { pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { BaseError, Result } from '@app/core';
import { DatabaseService } from '@app/db';
import { Comment, CommentMap, CommentModel } from '.';

@Injectable()
export class CommentRepo {
  constructor(private db: DatabaseService) {}

  async save(comment: Comment) {
    const commentModel = CommentMap.toPersistence(comment);

    await this.saveModel(commentModel, comment.unsavedProps);
  }

  async saveModel(
    commentModel: CommentModel,
    unsavedProps: (keyof CommentModel)[] | 'all',
  ) {
    await this.db.comment.upsert({
      where: { id: commentModel.id },
      create: commentModel,
      update:
        unsavedProps === 'all'
          ? commentModel
          : pick(commentModel, unsavedProps),
    });
  }

  async deleteOne(id: string) {
    await this.db.comment.delete({ where: { id } });
  }

  async getOne(id: string): Promise<Result<Comment>> {
    const commentModel = await this.db.comment.findUnique({ where: { id } });
    if (!commentModel) return BaseError.notFound<Comment>('Comment not found');

    return Result.ok(CommentMap.persistenceToDomain(commentModel));
  }

  async getCommentsOfPost(postId: string): Promise<Comment[]> {
    const commentModels = await this.db.comment.findMany({
      where: {
        postId,
      },
    });

    if (commentModels.length === 0) return [];

    return commentModels.map((commentModel) =>
      CommentMap.persistenceToDomain(commentModel),
    );
  }
}
