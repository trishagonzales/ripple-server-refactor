import { Injectable } from '@nestjs/common';
import { Usecase, Result, BaseError, UsecaseError } from '@app/core';
import { UploadService } from 'features/shared/upload';
import { CreatePostInput, CreatePostOutput } from './createPost.dto';
import { Post, PostRepo, PostMap } from '../..';

type I = CreatePostInput;
type O = CreatePostOutput;

@Injectable()
export class CreatePostUsecase implements Usecase<I, O> {
  constructor(private upload: UploadService, private postRepo: PostRepo) {}

  private postOrError: Result<Post>;
  private thumbnailOrError: Result<Post>;

  async exec({ me, dto }: I) {
    try {
      // Validate post input
      const postOrError = await Post.Create({
        authorId: me.id,
        title: dto.title,
        body: dto.body,
        isDraft: dto.isDraft,
      });
      if (postOrError.isFailure) return UsecaseError.Other<O>(postOrError);

      const post = postOrError.value;

      // Validate and upload thumbnail
      if (dto.thumbnail) {
        const thumbnailOrError = await this.upload.uploadPostThumbnail(
          dto.thumbnail,
          post.id,
        );
        if (thumbnailOrError.isFailure)
          return UsecaseError.Other<O>(thumbnailOrError);

        post.updateThumbnail(thumbnailOrError.value);
      }

      // Save to db
      await this.postRepo.save(post);

      return Result.ok<O>({ post: PostMap.domainToDTO(post) });
    } catch (e) {
      return BaseError.unexpected<O>(e);
    }
  }
}
