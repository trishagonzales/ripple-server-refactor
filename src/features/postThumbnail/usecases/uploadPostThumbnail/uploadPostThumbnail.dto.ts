import { Account } from 'features/account/index';

export interface UploadPostThumbnailInput {
  me: Account;
  dto: {
    thumbnailFile: Buffer;
    postId: string;
  };
}

export interface UploadPostThumbnailOutput {
  postThumbnailUrl: string;
}
