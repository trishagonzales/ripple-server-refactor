import { Account } from 'features/account/index';

export interface DeleteCommentInput {
  me: Account;
  commentId: string;
}

export type DeleteCommentOutput = void;
