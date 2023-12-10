import { without } from 'lodash';
import { Profile, ProfileMap, ProfileModel } from '../../profile';
import { Avatar, AvatarModel } from '../../avatar';
import {
  Account,
  AccountPlainData,
  Email,
  Password,
  UserModel,
  AccountDTO,
} from '..';

interface AccountModels {
  userModel: UserModel;
  profileModel: ProfileModel;
  avatarModel?: AvatarModel;
}

export class AccountMap {
  static domainToPersistence(account: Account): AccountModels {
    const userModel: UserModel = {
      id: account.id,
      email: account.email.value,
      isEmailVerified: account.isEmailVerified,
      password: account.password?.value ?? null,
      googleRefreshToken: account.googleRefreshToken ?? null,
    };

    const { profileModel, avatarModel } = ProfileMap.domainToPersistence(
      account.profile,
    );

    return { userModel, profileModel, avatarModel };
  }

  static persistenceToDomain(models: AccountModels): Account {
    const { userModel, profileModel, avatarModel } = models;

    const profile = ProfileMap.persistenceToDomain({
      profileModel,
      avatarModel,
    });

    const account = Account.Parse({
      id: userModel.id,
      email: Email.Parse(userModel.email),
      isEmailVerified: userModel.isEmailVerified,
      password: userModel.password
        ? Password.Parse(userModel.password)
        : undefined,
      googleRefreshToken: userModel.googleRefreshToken ?? undefined,
      profile,
    });

    return account;
  }

  static domainToCache(account: Account): string {
    return JSON.stringify(account.plainData);
  }

  static cacheToDomain(data: AccountPlainData): Account {
    const email = Email.Parse(data.email);
    const password = data.password ? Password.Parse(data.password) : undefined;

    const avatar = data.profile.avatar
      ? Avatar.Parse(data.profile.avatar)
      : undefined;
    const profile = Profile.Parse({ ...data.profile, avatar });

    return Account.Parse({ ...data, email, password, profile });
  }

  static domainToDTO(account: Account): AccountDTO {
    return {
      id: account.id,
      email: account.email.value,
      profile: ProfileMap.domainToDTO(account.profile),
    };
  }

  static serializeUnsavedProps(account: Account) {
    const userUnsavedProps = without(
      account.unsavedProps,
      'profile',
    ) as (keyof UserModel)[];

    const profileUnsavedProps = without(
      account.profile.unsavedProps,
      'avatar',
    ) as (keyof ProfileModel)[];

    const avatarUnsavedProps = account.profile.avatar?.unsavedProps as
      | (keyof AvatarModel)[]
      | undefined;

    return { userUnsavedProps, profileUnsavedProps, avatarUnsavedProps };
  }
}
