import { Account } from 'features/account/index';
import { PostDTO } from '../../types/post.dto';

export interface GetAllMyPostsInput {
  me: Account;
}

export interface GetAllMyPostsOutput {
  posts: PostDTO[];
}
