import { CommentDTO } from '../..';

export interface GetCommentsOfPostInput {
  postId: string;
}

export interface GetCommentsOfPostOutput {
  comments: CommentDTO[];
}
