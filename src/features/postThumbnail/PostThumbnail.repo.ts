import { Injectable } from '@nestjs/common';
import { BaseError, Repo, Result, SaveModelArg } from '@app/core';
import { DatabaseService } from '@app/db';
import { PostThumbnail, PostThumbnailMap, PostThumbnailModel } from '.';

@Injectable()
export class PostThumbnailRepo extends Repo {
  constructor(private db: DatabaseService) {
    super();
  }

  async save(thumbnail: PostThumbnail) {
    const thumbnailModel = PostThumbnailMap.toPersistence(thumbnail);
    await this.saveModel({
      model: thumbnailModel,
      unsavedProps: thumbnail.unsavedProps,
    });
  }

  async saveModel(arg: SaveModelArg<PostThumbnailModel>) {
    const { model, unsavedProps } = arg;
    await this.db.postThumbnail.upsert({
      where: { id: model.id },
      create: model,
      update: this.pickUnsavedPropsFromModel(model, unsavedProps),
    });
  }

  async isExist(id: string) {
    const thumbnail = await this.db.postThumbnail.findUnique({ where: { id } });
    return !!thumbnail;
  }

  async getOne(id: string) {
    const thumbnail = await this.db.postThumbnail.findUnique({ where: { id } });
    if (!thumbnail)
      return BaseError.notFound<PostThumbnail>('Post thumbnail not found');

    return Result.ok(PostThumbnailMap.persistenceToDomain(thumbnail));
  }

  async getOneByPostId(postId: string) {
    const thumbnail = await this.db.postThumbnail.findUnique({
      where: { postId },
    });
    if (!thumbnail)
      return BaseError.notFound<PostThumbnail>('Post thumbnail not found');

    return Result.ok(PostThumbnailMap.persistenceToDomain(thumbnail));
  }

  async deleteOne(id: string) {
    await this.db.postThumbnail.delete({ where: { id } });
  }
}
