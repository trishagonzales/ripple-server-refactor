import { AppError } from '@app/core';
import { Avatar } from '../../../avatar';
import { Profile } from '../../../profile';
import { UploadResponse } from '../types/upload.types';
import { IUploadPayload } from './UploadPayload.interface';

export class AvatarUpload implements IUploadPayload<Avatar> {
  public readonly isNewEntry: boolean;
  private _uploadResponse: UploadResponse;

  constructor(private profile: Profile) {
    this.isNewEntry = !!profile.avatar;
  }

  setUploadResponse(uploadResponse: UploadResponse) {
    this._uploadResponse = uploadResponse;
  }

  async createEntity() {
    const avatarOrError = await Avatar.Create({
      remoteId: this._uploadResponse.public_id,
      url: this._uploadResponse.secure_url,
      profileId: this.profile.id,
    });

    if (avatarOrError.isFailure) {
      throw new AppError(
        `Invalid avatar props after upload.
         Check mapping of response from remote storage to entity props.`,
        'AvatarUpload.ts',
      );
    }
    return avatarOrError.value;
  }

  async updateEntity() {
    if (this.profile.avatar) {
      this.profile.avatar?.updateUrl(this._uploadResponse.secure_url);
      return this.profile.avatar;
    } else {
      throw new AppError(
        `Existing entity is required in updateEntity after upload.
         Either provide existing entity or create new entity.`,
        'AvatarUpload.ts',
      );
    }
  }
}
