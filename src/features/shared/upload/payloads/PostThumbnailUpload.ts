import { AppError } from '@app/core';
import { Post } from '../../../post';
import { PostThumbnail } from '../../../postThumbnail';
import { UploadResponse } from '../types/upload.types';
import { IUploadPayload } from './UploadPayload.interface';

export class PostThumbnailUpload implements IUploadPayload<PostThumbnail> {
  public readonly isNewEntry: boolean;
  private _uploadResponse: UploadResponse;

  constructor(private post: Post) {
    this.isNewEntry = !!post.thumbnail;
  }

  setUploadResponse(uploadResponse: UploadResponse) {
    this._uploadResponse = uploadResponse;
  }

  async createEntity() {
    const thumbnailOrError = await PostThumbnail.Create({
      remoteId: this._uploadResponse.public_id,
      url: this._uploadResponse.secure_url,
      postId: this.post.id,
    });

    if (thumbnailOrError.isFailure) {
      throw new AppError(
        `Invalid thumbnail props after upload.
         Check mapping of response from remote storage to entity props.`,
        'PostThumbnailUpload.ts',
      );
    }
    return thumbnailOrError.value;
  }

  async updateEntity() {
    if (this.post.thumbnail) {
      this.post.thumbnail?.updateUrl(this._uploadResponse.secure_url);
      return this.post.thumbnail;
    } else {
      throw new AppError(
        `Existing entity is required in updateEntity after upload.
         Either provide existing entity or create new entity.`,
        'PostThumbnailUpload.ts',
      );
    }
  }
}
