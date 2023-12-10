import { PostModel, PostThumbnailModel } from '@account/repos';
import { without } from 'lodash';
import { Post } from '../domain/Post';
import { PostDTO } from './types/post.dto';
import { PostThumbnailMap } from './PostThumbnail.map';

interface PostModels {
  postModel: PostModel;
  thumbnailModel?: PostThumbnailModel;
}

export class PostMap {
  static domainToPersistence(post: Post): PostModels {
    const postModel: PostModel = {
      id: post.id,
      title: post.title,
      body: post.body,
      authorId: post.authorId,
      dateCreated: post.dateCreated,
      lastUpdated: post.lastUpdated,
      isDraft: post.isDraft,
    };

    if (post.thumbnail) {
      const thumbnailModel: PostThumbnailModel = {
        id: post.thumbnail?.id,
        remoteId: post.thumbnail?.remoteId,
        url: post.thumbnail?.url,
        postId: post.thumbnail?.postId,
      };

      return { postModel, thumbnailModel };
    }

    return { postModel };
  }

  static persistenceToDomain(models: PostModels): Post {
    const { postModel, thumbnailModel } = models;

    return Post.Parse({
      ...postModel,
      thumbnail: thumbnailModel
        ? PostThumbnailMap.persistenceToDomain({
            id: thumbnailModel.id,
            remoteId: thumbnailModel.remoteId,
            url: thumbnailModel.url,
            postId: thumbnailModel.postId,
          })
        : undefined,
    });
  }

  static domainToDTO(post: Post): PostDTO {
    return {
      id: post.id,
      title: post.title,
      body: post.body,
      authorId: post.authorId,
      isDraft: post.isDraft,
      dateCreated: post.dateCreated,
      lastUpdated: post.lastUpdated,
    };
  }

  static serializeUnsavedProps(post: Post) {
    const postUnsavedProps = without(
      post.unsavedProps,
      'thumbnail',
    ) as (keyof PostModel)[];

    const thumbnailUnsavedProps = post.thumbnail?.unsavedProps as
      | (keyof PostThumbnailModel)[]
      | undefined;

    return { postUnsavedProps, thumbnailUnsavedProps };
  }
}
