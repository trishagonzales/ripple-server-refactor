import { PostDTO } from '../../../dtos';

export interface GetOnePostInput {
  postId: string;
}

export interface GetOnePostOutput {
  post: PostDTO;
}
