import { Account } from 'features/account/index';

export interface DeletePostThumbnailInput {
  me: Account;
  postId: string;
}

export type DeletePostThumbnailOutput = void;
