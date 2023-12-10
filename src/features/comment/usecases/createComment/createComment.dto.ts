import { Account } from 'features/account/index';
import { CommentDTO } from '../..';

export interface CreateCommentInput {
  me: Account;
  dto: {
    body: string;
    postId: string;
  };
}

export interface CreateCommentOutput {
  comment: CommentDTO;
}
