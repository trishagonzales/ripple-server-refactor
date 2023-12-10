import { Injectable } from '@nestjs/common';
import { BaseError, Result } from '@app/core';
import { Profile } from '../../profile';
import { Avatar } from '../../avatar';
import { Post } from '../../post';
import { PostThumbnail } from '../../postThumbnail';
import { AvatarUpload } from './payloads/AvatarUpload';
import { IUploadPayload } from './payloads/UploadPayload.interface';
import { PostThumbnailUpload } from './payloads/PostThumbnailUpload';
import { CloudinaryService } from './lib/Cloudinary.service';
import { UploadFileType } from './types/upload.types';

type Payload = Avatar | PostThumbnail;

@Injectable()
export class UploadService {
  private _uploadPayload: IUploadPayload<Payload>;
  private _uploadResult: Result<Payload>;
  private _deleteResult: Result<void>;

  constructor(private cloudinary: CloudinaryService) {}

  async avatar(file: UploadFileType, profile: Profile) {
    this._uploadPayload = new AvatarUpload(profile);
    this._uploadImpl(file);

    return this._uploadResult as Result<Avatar>;
  }

  async postThumbnail(file: UploadFileType, post: Post) {
    this._uploadPayload = new PostThumbnailUpload(post);
    this._uploadImpl(file);

    return this._uploadResult as Result<PostThumbnail>;
  }

  private async _uploadImpl(file: UploadFileType) {
    const responseOrError = await this.cloudinary.upload(file);

    if (responseOrError.isFailure) {
      this._uploadResult = this._generateUploadErrorResult();
    } else {
      this._uploadPayload.setUploadResponse(responseOrError.value);
      this._createOrUpdateEntity();
    }
  }

  private _generateUploadErrorResult() {
    return BaseError.unexpected<Payload>(
      'Cannot upload file to remote storage',
    );
  }

  private async _createOrUpdateEntity() {
    if (this._uploadPayload.isNewEntry) {
      const entity = await this._uploadPayload.createEntity();
      this._uploadResult = Result.ok(entity);
    } else {
      const entity = await this._uploadPayload.updateEntity();
      this._uploadResult = Result.ok(entity);
    }
  }

  async delete(remoteId: string) {
    try {
      await this.cloudinary.delete(remoteId);
      this._deleteResult = Result.ok();
    } catch (e) {
      this._deleteResult = this._generateDeleteErrorResult();
    } finally {
      return this._deleteResult;
    }
  }

  private _generateDeleteErrorResult() {
    return BaseError.unexpected<void>('Cannot delete file from remote storage');
  }
}
