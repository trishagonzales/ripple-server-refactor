import { object, string } from 'joi';
import { Entity, Result, BaseError } from '@app/core';
import { PostThumbnail } from '../postThumbnail';

interface CreateInput {
  title: string;
  body: string;
  authorId: string;
  isDraft: boolean;
  thumbnail?: PostThumbnail;
}

interface Props {
  id: string;
  title: string;
  body: string;
  authorId: string;
  isDraft: boolean;
  dateCreated: Date;
  lastUpdated: Date;
  thumbnail?: PostThumbnail;
}

export class Post extends Entity<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static async Create(input: CreateInput) {
    try {
      await this._validateInput(input);
      const props = this._buildProps(input);
      const post = this._buildEntity(props);

      return Result.ok(post);
    } catch (e) {
      return BaseError.badRequest<Post>(e);
    }
  }

  private static async _validateInput(input: CreateInput) {
    await object({
      title: string(),
      body: string(),
      authorId: string(),
      thumbnail: object().instance(PostThumbnail).optional(),
    }).validateAsync(input);
  }

  private static _buildProps(input: CreateInput) {
    const dateCreated = new Date();
    const props: Props = {
      id: Entity.GenerateId(),
      title: input.title,
      body: input.body,
      authorId: input.authorId,
      dateCreated,
      lastUpdated: dateCreated,
      isDraft: input.isDraft,
    };
    return props;
  }

  private static _buildEntity(props: Props) {
    const post = new Post(props);
    post._includeAllFieldsToUnsavedProps();
    return post;
  }

  static Parse(props: Props) {
    return new Post(props);
  }

  get title() {
    return this._props.title;
  }
  get body() {
    return this._props.body;
  }
  get authorId() {
    return this._props.authorId;
  }
  get dateCreated() {
    return this._props.dateCreated;
  }
  get lastUpdated() {
    return this._props.lastUpdated;
  }
  get isDraft() {
    return this._props.isDraft;
  }
  get thumbnail() {
    return this._props.thumbnail;
  }

  updateThumbnail(thumbnail: PostThumbnail) {
    this._props.thumbnail = thumbnail;
    this._includeFieldToUnsavedProps(['thumbnail']);
  }
  validateAuthor(authorId: string): boolean {
    return this._props.authorId === authorId;
  }
  // like(accountId: string) {
  //   if (this._props.likes.includes(accountId)) return;
  //   this._props.likes.push(accountId);
  //   this._updateUnsavedProps(['likes']);
  // }
  // unlike(accountId: string) {
  //   if (!this._props.likes.includes(accountId)) return;
  //   pull(this._props.likes, accountId);
  //   this._updateUnsavedProps(['likes']);
  // }
}
