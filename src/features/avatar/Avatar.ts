import { object, string } from 'joi';
import { BaseError, Entity, Result } from '@app/core';

interface CreateInput {
  remoteId: string;
  url: string;
  profileId: string;
}

interface Props {
  id: string;
  remoteId: string;
  url: string;
  profileId: string;
}

export type AvatarPlainData = Props;

export class Avatar extends Entity<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static async Create(input: CreateInput) {
    try {
      await this._validateInput(input);
      const props = this._buildProps(input);
      const avatar = this._buildEntity(props);

      return Result.ok(avatar);
    } catch (e) {
      return BaseError.badRequest<Avatar>(e);
    }
  }

  private static async _validateInput(input: CreateInput) {
    await object({
      remoteId: string(),
      url: string().uri(),
      profileId: string(),
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
    const avatar = new Avatar(props);
    avatar._includeAllFieldsToUnsavedProps();
    return avatar;
  }

  static Parse(props: Props) {
    return new Avatar(props);
  }

  get remoteId() {
    return this._props.remoteId;
  }
  get url() {
    return this._props.url;
  }
  get profileId() {
    return this._props.profileId;
  }
  get plainData(): AvatarPlainData {
    return {
      id: this.id,
      ...this._props,
    };
  }

  updateUrl(url: string) {
    this._props.url = url;
    this._includeFieldToUnsavedProps(['url']);
  }
}
