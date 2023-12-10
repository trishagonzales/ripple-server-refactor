import { Account } from 'features/account/index';

export interface LikePostInput {
  me: Account;
  postId: string;
}

export type LikePostOutput = void;
