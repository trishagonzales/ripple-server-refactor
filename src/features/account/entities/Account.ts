import { object, string } from 'joi';
import { BaseError, Entity, Result } from '@app/core';
import { Profile, ProfilePlainData } from '../../profile/Profile';
import { Email } from './Email';
import { Password } from './Password';

interface CreateInput {
  email: Email;
}
interface CreateWithPasswordInput extends CreateInput {
  password: Password;
}
interface CreateWithGoogleInput extends CreateInput {
  googleRefreshToken: string;
}

interface Props {
  id: string;
  profile: Profile;
  email: Email;
  isEmailVerified: boolean;
  password?: Password;
  googleRefreshToken?: string;
}

export interface AccountPlainData
  extends Omit<Props, 'email' | 'password' | 'profile'> {
  email: string;
  password?: string;
  profile: ProfilePlainData;
}

export class Account extends Entity<Props> {
  private _sessionRefreshToken: string;

  private constructor(props: Props) {
    super(props);
  }

  static async CreateWithPassword(input: CreateWithPasswordInput) {
    try {
      await this._validateInputOfCreateWithPassword(input);
      const props = await this._buildPropsOfCreateWithPassword(input);
      const account = this._buildAccount(props);

      return Result.ok(account);
    } catch (e) {
      return BaseError.badRequest<Account>(e);
    }
  }

  private static async _validateInputOfCreateWithPassword(
    input: CreateWithPasswordInput,
  ) {
    await object({
      email: object().instance(Email),
      password: object().instance(Password),
    }).validateAsync(input);
  }

  private static async _buildPropsOfCreateWithPassword(
    input: CreateWithPasswordInput,
  ) {
    const profile = await this._buildProfile();
    const props: Props = {
      id: profile.userId,
      email: input.email,
      password: input.password,
      isEmailVerified: false,
      profile,
    };
    return props;
  }

  private static async _buildProfile() {
    const userId = Entity.GenerateId();
    const profileOrError = await Profile.Create({ userId });
    return profileOrError.value;
  }

  private static _buildAccount(props: Props) {
    const account = new Account(props);
    account._includeAllFieldsToUnsavedProps();
    return account;
  }

  static async CreateWithGoogle(input: CreateWithGoogleInput) {
    try {
      await this._validateInputOfCreateWithGoogle(input);
      const props = await this._buildPropsOfCreateWithGoogle(input);
      const account = this._buildAccount(props);

      return Result.ok(account);
    } catch (e) {
      return BaseError.badRequest(e);
    }
  }

  private static async _validateInputOfCreateWithGoogle(
    input: CreateWithGoogleInput,
  ) {
    await object({
      email: object().instance(Email),
      googleRefreshToken: string(),
    }).validateAsync(input);
  }

  private static async _buildPropsOfCreateWithGoogle(
    input: CreateWithGoogleInput,
  ) {
    const profile = await this._buildProfile();
    const props: Props = {
      id: profile.userId,
      email: input.email,
      googleRefreshToken: input.googleRefreshToken,
      isEmailVerified: false,
      profile,
    };
    return props;
  }

  static Parse(props: Props) {
    return new Account(props);
  }

  get email() {
    return this._props.email;
  }
  get isEmailVerified() {
    return this._props.isEmailVerified;
  }
  get password() {
    return this._props.password;
  }
  get googleRefreshToken() {
    return this._props.googleRefreshToken;
  }
  get profile() {
    return this._props.profile;
  }
  get plainData(): AccountPlainData {
    return {
      id: this.id,
      ...this._props,
      email: this._props.email.value,
      password: this._props.password?.value,
      profile: this._props.profile.plainData,
    };
  }

  get sessionRefreshToken() {
    return this._sessionRefreshToken;
  }
  setSessionRefreshToken(refreshToken: string) {
    this._sessionRefreshToken = refreshToken;
  }

  updateEmail(email: Email) {
    this._props.email = email;
    this._includeFieldToUnsavedProps(['email']);
  }
  updatePassword(password: Password) {
    this._props.password = password;
    this._includeFieldToUnsavedProps(['password']);
  }
}
