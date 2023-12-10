import { Avatar } from './Avatar';
import { AvatarModel } from '.';

export class AvatarMap {
  static domainToPersistence(avatar: Avatar): AvatarModel {
    const avatarModel: AvatarModel = {
      id: avatar.id,
      remoteId: avatar.remoteId,
      url: avatar.url,
      profileId: avatar.profileId,
    };
    return avatarModel;
  }

  static persistenceToDomain(model: AvatarModel): Avatar {
    const avatar = Avatar.Parse({
      id: model.id,
      remoteId: model.remoteId,
      url: model.url,
      profileId: model.profileId,
    });
    return avatar;
  }
}
