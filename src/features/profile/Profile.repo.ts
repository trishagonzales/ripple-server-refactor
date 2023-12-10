import { omit } from 'lodash';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AppError, BaseError, Repo, Result, SaveModelArg } from '@app/core';
import { DatabaseService } from '@app/db';
import { AvatarRepo, AvatarModel } from 'features/avatar/index';
import { Profile, ProfileMap, ProfileModel } from '.';

const fullProfileQueryArg = Prisma.validator<Prisma.ProfileArgs>()({
  include: {
    avatar: true,
  },
});

@Injectable()
export class ProfileRepo extends Repo {
  constructor(private db: DatabaseService, private avatarRepo: AvatarRepo) {
    super();
  }

  /** Save using data in entity object */

  async save(profile: Profile) {
    if (this.noPropsWereModified(profile.unsavedProps)) return;

    const models = ProfileMap.domainToPersistence(profile);
    const unsavedProps = ProfileMap.serializeUnsavedProps(profile);

    const { profileModel, avatarModel } = models;
    const { profileUnsavedProps, avatarUnsavedProps } = unsavedProps;

    const profileSaveModelArg = {
      model: profileModel,
      unsavedProps: profileUnsavedProps,
    };

    const profileHasAvatar = avatarModel && avatarUnsavedProps;

    const avatarSaveModelArg = profileHasAvatar
      ? {
          model: avatarModel,
          unsavedProps: avatarUnsavedProps,
        }
      : undefined;

    await this.saveModelWithRelationships(
      profileSaveModelArg,
      avatarSaveModelArg,
    );

    const avatarWasDeleted =
      profile.unsavedProps.includes('avatar') && !profile.avatar;

    if (avatarWasDeleted) {
      await this.avatarRepo.deleteOneByProfileId(profile.id);
    }
  }

  async saveModel(arg: SaveModelArg<ProfileModel>) {
    const { model, unsavedProps } = arg;
    await this.db.profile.upsert({
      where: { id: model.id },
      create: model,
      update: this.pickUnsavedPropsFromModel(model, unsavedProps),
    });
  }

  async saveModelWithRelationships(
    profile: SaveModelArg<ProfileModel>,
    avatar?: SaveModelArg<AvatarModel>,
  ) {
    const profileRollback = await this._createProfileRollback(profile);
    await this.saveModel(profile);

    if (avatar) {
      try {
        await this.avatarRepo.saveModel(avatar);
      } catch (e) {
        await profileRollback.execute();
        throw new AppError('Problems saving avatar in db', 'Profile.repo.ts');
      }
    }
  }

  private async _createProfileRollback(profile: SaveModelArg<ProfileModel>) {
    const profileId = profile.model.id;
    const previousData = await this.getOneModel(profileId);

    const updateToPrevious = async (model: ProfileModel) => {
      await this.db.profile.update({
        where: { id: profileId },
        data: model,
      });
    };
    const deleteNewlyCreated = async () => {
      await this.deleteOne(profileId);
    };

    const rollback = this.createRollbackFunction({
      previousData,
      updateToPrevious,
      deleteNewlyCreated,
    });
    return rollback;
  }

  async isExist(id: string) {
    const profile = await this.db.profile.findUnique({ where: { id } });
    return !!profile;
  }

  async isExistByUsername(username: string) {
    const profile = await this.db.profile.findUnique({ where: { username } });
    return !!profile;
  }

  async getOne(id: string) {
    const profile = await this.db.profile.findUnique({
      where: { id },
      ...fullProfileQueryArg,
    });
    if (!profile) return BaseError.notFound<Profile>('Profile not found');

    return Result.ok(
      ProfileMap.persistenceToDomain({
        profileModel: omit(profile, 'avatar'),
        avatarModel: profile.avatar ?? undefined,
      }),
    );
  }

  async getOneModel(id: string) {
    return await this.db.profile.findUnique({ where: { id } });
  }

  async deleteOne(id: string) {
    await this.db.profile.delete({ where: { id } });
  }
}
