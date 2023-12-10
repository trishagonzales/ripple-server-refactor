import { string } from 'joi';
import { faker } from '@faker-js/faker';
import { Entity, Result, BaseError } from '@app/core';
import { Avatar, AvatarPlainData } from '../avatar';

interface CreateInput {
  userId: string;
}

interface Props {
  id: string;
  username: string;
  name?: string;
  bio?: string;
  location?: string;
  dateCreated: Date;
  userId: string;
  avatar?: Avatar;
}

export interface ProfilePlainData extends Omit<Props, 'avatar'> {
  avatar?: AvatarPlainData;
}

export class Profile extends Entity<Props> {
  private static USERNAME_LENGTH = 8;

  private constructor(props: Props) {
    super(props);
  }

  static async Create(input: CreateInput) {
    try {
      await this._validateInput(input);
      const props = this._buildProps(input);
      const profile = this._buildProfile(props);

      return Result.ok(profile);
    } catch (e) {
      return BaseError.badRequest<Profile>(e);
    }
  }

  private static async _validateInput(input: CreateInput) {
    await string()
      .guid({ version: ['uuidv4'] })
      .validateAsync(input.userId);
  }

  private static _buildProps(input: CreateInput) {
    const props: Props = {
      id: Entity.GenerateId(),
      username: Profile.GenerateUsername(),
      dateCreated: new Date(),
      userId: input.userId,
    };
    return props;
  }

  private static _buildProfile(props: Props) {
    const profile = new Profile(props);
    profile._includeAllFieldsToUnsavedProps();
    return profile;
  }

  static Parse(props: Props) {
    return new Profile(props);
  }
  static GenerateUsername() {
    return 'user' + faker.random.numeric(this.USERNAME_LENGTH);
  }

  get username() {
    return this._props.username;
  }
  get name() {
    return this._props.name;
  }
  get bio() {
    return this._props.bio;
  }
  get location() {
    return this._props.location;
  }
  get dateCreated() {
    return this._props.dateCreated;
  }
  get userId() {
    return this._props.userId;
  }
  get avatar() {
    return this._props.avatar;
  }

  get plainData(): ProfilePlainData {
    return {
      id: this.id,
      ...this._props,
      avatar: this._props.avatar?.plainData,
    };
  }

  updateAvatar(avatar: Avatar) {
    this._props.avatar = avatar;
    this._includeFieldToUnsavedProps(['avatar']);
  }
  removeAvatar() {
    this._props.avatar = undefined;
    this._includeFieldToUnsavedProps(['avatar']);
  }
}
