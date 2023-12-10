import streamfier from 'streamifier';
import cloudinary, { UploadApiResponse } from 'cloudinary';
import { AppError, Result } from '@app/core';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '@app/config';
import { UploadFileType } from '../types/upload.types';

@Injectable()
export class CloudinaryService {
  private cloudinary;

  constructor(private config: AppConfig) {
    cloudinary.v2.config({
      cloud_name: config.storage.name,
      api_key: config.storage.apiKey,
      api_secret: config.storage.apiSecret,
      secure: true,
    });
    this.cloudinary = cloudinary.v2;
  }

  /**
   * If public id (remote id) was provided,
   * existing file on remote storage with the given id
   * will be updated otherwise, it will create a new one.
   */
  async upload(file: UploadFileType, remoteId?: string) {
    try {
      const response = await this._uploadImpl(file, remoteId);
      if (!response)
        throw new AppError(
          'Response is empty after upload',
          'Cloudinary.service.ts',
        );

      return Result.ok(response);
    } catch (e: any) {
      throw new AppError(
        'Problems uploading to cloudinary \n' + e,
        'Cloudinary.service.ts',
      );
    }
  }

  private async _uploadImpl(file: UploadFileType, remoteId?: string) {
    return new Promise<UploadApiResponse | undefined>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder:
            this.config.app.nodeEnv === 'production' ? 'ripple' : 'ripple dev',
          public_id: remoteId,
          invalidate: remoteId ? true : undefined,
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        },
      );
      streamfier.createReadStream(file).pipe(stream);
    });
  }

  async delete(publicId: string) {
    await this.cloudinary.uploader.destroy(publicId, { invalidate: true });
  }
}
