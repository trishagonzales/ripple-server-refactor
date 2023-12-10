import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, ErrorMap } from '@app/core';
import { UploadService } from 'features/shared/upload';
import { Post, PostRepo } from 'features/post/index';
import {
  UploadPostThumbnailInput,
  UploadPostThumbnailOutput,
} from './uploadPostThumbnail.dto';
import { PostThumbnail, PostThumbnailRepo } from '../..';

type I = UploadPostThumbnailInput;
type O = UploadPostThumbnailOutput;

@Injectable()
export class UploadPostThumbnailUsecase implements Usecase<I, O> {
  private input: I;
  private post: Post;
  private thumbnail: PostThumbnail;

  constructor(
    private upload: UploadService,
    private postRepo: PostRepo,
    private thumbnailRepo: PostThumbnailRepo,
  ) {}

  async exec(input: I) {
    try {
      this.input = input;
      this._getPostFromDb();
      this._validateIfUserIsTheAuthor();
      this._uploadToRemoteStorage();
      this._saveToDb();

      return Result.ok<O>({ postThumbnailUrl: this.thumbnail.url });
    } catch (e) {
      return ErrorMap.toController<O>(e);
    }
  }

  private async _getPostFromDb() {
    const postOrError = await this.postRepo.getOne(this.input.dto.postId);
    if (postOrError.isFailure) {
      throw postOrError;
    }
    this.post = postOrError.value;
  }

  private _validateIfUserIsTheAuthor() {
    const isUserTheAuthor = this.post.validateAuthor(this.input.me.id);
    if (!isUserTheAuthor) {
      throw BaseError.unauthorized<O>('User is not the author');
    }
  }

  private async _uploadToRemoteStorage() {
    const uploadedThumbnailOrError = await this.upload.postThumbnail(
      this.input.dto.thumbnailFile,
      this.post,
    );
    if (uploadedThumbnailOrError.isFailure) {
      throw uploadedThumbnailOrError;
    }
    this.thumbnail = uploadedThumbnailOrError.value;
  }

  private async _saveToDb() {
    await this.thumbnailRepo.save(this.thumbnail);
  }
}
