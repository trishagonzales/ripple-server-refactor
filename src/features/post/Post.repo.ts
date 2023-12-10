import { omit, pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppError, BaseError, Result } from '@app/core';
import { DatabaseService } from '@app/db';
import { PostModel, PostThumbnailModel, UserRepo } from '@account/repos';
import { Post } from '../domain';
import { PostMap, PostThumbnailMap } from '../mappers';
import { PostThumbnailRepo } from '.';

const fullPostQueryArg = Prisma.validator<Prisma.PostArgs>()({
  include: {
    thumbnail: true,
  },
});
type FullPostModel = Prisma.PostGetPayload<typeof fullPostQueryArg>;

@Injectable()
export class PostRepo {
  constructor(
    private db: DatabaseService,
    private postThumbnailRepo: PostThumbnailRepo,
  ) {}

  async save(post: Post) {
    const existingThumbnailModel = post.thumbnail?.id
      ? await this.postThumbnailRepo.getOne(post.thumbnail.id)
      : undefined;

    if (post.unsavedProps.includes('thumbnail') && post.thumbnail) {
      const thumbnailModel = PostThumbnailMap.toPersistence(post.thumbnail);
      await this.postThumbnailRepo.saveModel(
        thumbnailModel,
        post.thumbnail?.unsavedProps,
      );
    }

    const { postUnsavedProps } = PostMap.serializeUnsavedProps(post);
    const { postModel } = PostMap.domainToPersistence(post);
    await this.saveModel(postModel, postUnsavedProps);
  }

  async saveModel(
    postModel: PostModel,
    unsavedProps: (keyof PostModel)[] | 'all',
  ) {
    await this.db.post.upsert({
      where: { id: postModel.id },
      create: postModel,
      update:
        unsavedProps === 'all' ? postModel : pick(postModel, unsavedProps),
    });
  }

  // async save(post: Post) {
  //   const { postModel, thumbnailModel } = PostMap.domainToPersistence(post);
  //   const { postUnsavedProps, thumbnailUnsavedProps } =
  //     PostMap.serializeUnsavedProps(post);

  //   await this.saveModel(
  //     postModel,
  //     postUnsavedProps,
  //     thumbnailModel,
  //     thumbnailUnsavedProps,
  //   );
  // }

  // async saveModel(
  //   postModel: PostModel,
  //   postUnsavedProps: (keyof PostModel)[] | 'all',
  //   thumbnailModel?: PostThumbnailModel,
  //   thumbnailUnsavedProps?: (keyof PostThumbnailModel)[] | 'all',
  // ) {
  //   const postRollbackData = await this.getOneModel(postModel.id);

  //   await this.db.post.upsert({
  //     where: { id: postModel.id },
  //     create: postModel,
  //     update:
  //       postUnsavedProps === 'all'
  //         ? postModel
  //         : pick(postModel, postUnsavedProps),
  //   });

  //   if (thumbnailModel && thumbnailUnsavedProps)
  //     try {
  //       await this.postThumbnailRepo.saveModel(
  //         thumbnailModel,
  //         thumbnailUnsavedProps,
  //       );
  //     } catch (e) {
  //       if (postRollbackData) {
  //         // rollback existing post
  //         await this.saveModel(postRollbackData, 'all');
  //       } else {
  //         // rollback newly created post
  //         await this.deleteOne(postModel.id);
  //       }

  //       AppError.throw('Cannot save post thumbnail', 'Post.repo.ts');
  //     }
  // }

  async isExist(id: string): Promise<boolean> {
    const post = await this.db.post.findUnique({ where: { id } });
    return !!post;
  }

  async deleteOne(id: string) {
    await this.db.post.delete({ where: { id } });
  }

  async getOne(id: string) {
    const postModel = await this.db.post.findUnique({
      where: { id },
      ...fullPostQueryArg,
    });
    if (!postModel) return BaseError.notFound<Post>('Post not found');

    return Result.ok(
      PostMap.persistenceToDomain({
        postModel: omit(postModel, 'thumbnail'),
        thumbnailModel: postModel.thumbnail ?? undefined,
      }),
    );
  }

  async getOneModel(id: string) {
    return await this.db.post.findUnique({
      where: { id },
      ...fullPostQueryArg,
    });
  }

  async getAllPostsOfOneUser(userId: string) {
    const postModels = await this.db.post.findMany({
      where: { authorId: userId },
      ...fullPostQueryArg,
    });

    return this._mapManyToDomain(postModels);
  }

  async getAllPosts() {
    const postModels = await this.db.post.findMany({
      ...fullPostQueryArg,
    });

    return this._mapManyToDomain(postModels);
  }

  async addUserToLikes(postId: string, userId: string) {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async removeUserFromLikes(postId: string, userId: string) {
    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  private async _mapManyToDomain(postModels: FullPostModel[]) {
    return postModels.map((postModel) =>
      PostMap.persistenceToDomain({
        postModel: omit(postModel, ['thumbnail']),
        thumbnailModel: postModel.thumbnail ?? undefined,
      }),
    );
  }
}
