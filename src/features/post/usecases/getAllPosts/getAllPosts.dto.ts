import { PostDTO } from '../../../dtos';

export type GetAllPostsInput = void;

export interface GetAllPostsOutput {
  posts: PostDTO[];
}
