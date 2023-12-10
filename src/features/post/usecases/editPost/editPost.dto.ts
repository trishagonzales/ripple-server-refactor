import { Account } from '../../../../user/domain';
import { PostDTO } from '../../../dtos';

export interface EditPostInput {
  me: Account;
  dto: {
    title: string;
    body: string;
  };
}

export interface EditPostOutput {
  post: PostDTO;
}
