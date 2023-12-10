import { Account } from 'features/account/index';

export interface UnlikePostInput {
  me: Account;
  postId: string;
}

export type UnlikePostOutput = void;
