import { object, string } from 'joi';
import { Entity, Result, BaseError } from '@app/core';

interface CreateInput {
  remoteId: string;
  url: string;
  postId: string;
}

interface Props {
  id: string;
  remoteId: string;
  url: string;
  postId: string;
}

export class PostThumbnail extends Entity<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static async Create(input: CreateInput) {
    try {
      await this._validateInput(input);
      const props = this._buildProps(input);
      const thumbnail = this._buildEntity(props);

      return Result.ok(thumbnail);
    } catch (e) {
      return BaseError.badRequest<PostThumbnail>(e);
    }
  }

  private static async _validateInput(input: CreateInput) {
    await object({
      remoteId: string(),
      url: string(),
      postId: string(),
    }).validateAsync(input);
  }

  private static _buildProps(input: CreateInput) {
    const props: Props = {
      id: Entity.GenerateId(),
      ...input,
    };
    return props;
  }

  private static _buildEntity(props: Props) {
    const thumbnail = new PostThumbnail(props);
    thumbnail._includeAllFieldsToUnsavedProps();
    return thumbnail;
  }

  static Parse(props: Props) {
    return new PostThumbnail(props);
  }

  get remoteId() {
    return this._props.remoteId;
  }
  get url() {
    return this._props.url;
  }
  get postId() {
    return this._props.postId;
  }

  updateUrl(url: string) {
    this._props.url = url;
    this._includeFieldToUnsavedProps(['url']);
  }
}
