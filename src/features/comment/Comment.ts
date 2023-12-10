import { object, string } from 'joi';
import { Entity, Result, BaseError } from '@app/core';

interface CreateInput {
  body: string;
  authorId: string;
  postId: string;
}

interface Props {
  id: string;
  body: string;
  dateCreated: Date;
  authorId: string;
  postId: string;
}

export class Comment extends Entity<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static async Create(input: CreateInput) {
    try {
      await this._validateInput(input);
      const props = this._buildProps(input);
      const comment = this._buildEntity(props);

      return Result.ok(comment);
    } catch (e) {
      return BaseError.badRequest<Comment>(e);
    }
  }

  private static async _validateInput(input: CreateInput) {
    await object({
      body: string(),
      authorId: string(),
    }).validateAsync(input);
  }

  private static _buildProps(input: CreateInput) {
    const props: Props = {
      id: Entity.GenerateId(),
      ...input,
      dateCreated: new Date(),
    };
    return props;
  }

  private static _buildEntity(props: Props) {
    const comment = new Comment(props);
    comment._includeAllFieldsToUnsavedProps();
    return comment;
  }

  static Parse(props: Props) {
    return new Comment(props);
  }

  get body() {
    return this._props.body;
  }
  get dateCreated() {
    return this._props.dateCreated;
  }
  get authorId() {
    return this._props.authorId;
  }
  get postId() {
    return this._props.postId;
  }

  validateAuthor(authorId: string): boolean {
    return this._props.authorId === authorId;
  }
}
