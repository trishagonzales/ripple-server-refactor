import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { UploadService } from 'features/shared/upload';
import { PostRepo } from 'features/post/index';
import {
  DeletePostThumbnailInput,
  DeletePostThumbnailOutput,
} from './deletePostThumbnail.dto';
import { PostThumbnailRepo } from '../..';

type I = DeletePostThumbnailInput;
type O = DeletePostThumbnailOutput;

@Injectable()
export class DeletePostThumbnailUsecase implements Usecase<I, O> {
  constructor(
    private upload: UploadService,
    private postRepo: PostRepo,
    private thumbnailRepo: PostThumbnailRepo,
  ) {}

  async exec({ me, postId }: I) {
    try {
      const postOrError = await this.postRepo.getOne(postId);
      if (postOrError.isFailure) return UsecaseError.Other<O>(postOrError);

      const post = postOrError.value;

      // Validate if user is the author
      const isUserTheAuthor = post.validateAuthor(me.id);
      if (!isUserTheAuthor)
        return BaseError.unauthorized<O>('User is not the author');

      // If thumbnail is already empty, return without error
      if (!post.thumbnail) return Result.ok<O>();

      // Delete thumbnail in remote storage
      const deletedOrError = await this.upload.deletePostThumbnail(
        post.thumbnail,
      );
      if (deletedOrError.isFailure)
        return UsecaseError.Other<O>(deletedOrError);

      // Delete thumbnail in db
      await this.thumbnailRepo.deleteOne(post.thumbnail.id);

      return Result.ok<O>();
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
