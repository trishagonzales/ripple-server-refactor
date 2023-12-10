import { without } from 'lodash';
import { AvatarMap, AvatarModel } from '../avatar';
import { Profile, ProfileDTO, ProfileModel } from '.';

interface ProfileModels {
  profileModel: ProfileModel;
  avatarModel?: AvatarModel;
}

export class ProfileMap {
  static domainToPersistence(profile: Profile): ProfileModels {
    const profileModel: ProfileModel = {
      id: profile.id,
      username: profile.username,
      name: profile.name ?? null,
      bio: profile.bio ?? null,
      location: profile.location ?? null,
      dateCreated: profile.dateCreated,
      userId: profile.userId,
    };

    if (profile.avatar) {
      const avatarModel = AvatarMap.domainToPersistence(profile.avatar);
      return { profileModel, avatarModel };
    }

    return { profileModel };
  }

  static persistenceToDomain(models: ProfileModels): Profile {
    const { profileModel, avatarModel } = models;

    const profile = Profile.Parse({
      id: profileModel.id,
      username: profileModel.username,
      name: profileModel.name ?? undefined,
      bio: profileModel.bio ?? undefined,
      location: profileModel.location ?? undefined,
      dateCreated: profileModel.dateCreated,
      userId: profileModel.userId,
      avatar: avatarModel
        ? AvatarMap.persistenceToDomain(avatarModel)
        : undefined,
    });

    return profile;
  }

  static domainToDTO(profile: Profile): ProfileDTO {
    return {
      id: profile.id,
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      dateCreated: profile.dateCreated,
      avatarUrl: profile.avatar?.url,
    };
  }

  static serializeUnsavedProps(profile: Profile) {
    const profileUnsavedProps = without(
      profile.unsavedProps,
      'avatar',
    ) as (keyof ProfileModel)[];

    const avatarUnsavedProps = profile.avatar?.unsavedProps as
      | (keyof AvatarModel)[]
      | undefined;

    return { profileUnsavedProps, avatarUnsavedProps };
  }
}
