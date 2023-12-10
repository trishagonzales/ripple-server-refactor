import { PostThumbnail, PostThumbnailModel } from '.';

export class PostThumbnailMap {
  static toPersistence(postThumbnail: PostThumbnail): PostThumbnailModel {
    return {
      id: postThumbnail.id,
      remoteId: postThumbnail.remoteId,
      url: postThumbnail.url,
      postId: postThumbnail.postId,
    };
  }

  static persistenceToDomain(
    postThumbnailModel: PostThumbnailModel,
  ): PostThumbnail {
    return PostThumbnail.Parse({
      id: postThumbnailModel.id,
      remoteId: postThumbnailModel.remoteId,
      url: postThumbnailModel.url,
      postId: postThumbnailModel.postId,
    });
  }
}
