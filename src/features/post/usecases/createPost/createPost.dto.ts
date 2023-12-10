import { Account } from 'features/account/index';
import { PostDTO } from '../..';

export interface CreatePostInput {
  me: Account;
  dto: {
    title: string;
    body: string;
    isDraft: boolean;
    thumbnail?: Buffer;
  };
}

export interface CreatePostOutput {
  post: PostDTO;
}
