import { Comment, CommentModel, CommentDTO } from '.';

export class CommentMap {
  static toPersistence(comment: Comment): CommentModel {
    return {
      id: comment.id,
      body: comment.body,
      authorId: comment.authorId,
      postId: comment.postId,
      dateCreated: comment.dateCreated,
    };
  }

  static persistenceToDomain(model: CommentModel): Comment {
    return Comment.Parse(model);
  }

  static toDTO(comment: Comment): CommentDTO {
    return {
      id: comment.id,
      body: comment.body,
      authorId: comment.authorId,
      postId: comment.postId,
      dateCreated: comment.dateCreated,
    };
  }

  // static serializeUnsavedProps(comment: Comment) {
  //   return comment.unsavedProps as (keyof Comment)[];
  // }
}
