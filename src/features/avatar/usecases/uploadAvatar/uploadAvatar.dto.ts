import { Account } from 'features/account/index';

export interface UploadAvatarInput {
  me: Account;
  file: Buffer;
}

export interface UploadAvatarOutput {
  avatarUrl: string;
}
