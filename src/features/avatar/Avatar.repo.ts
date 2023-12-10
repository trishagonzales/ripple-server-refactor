import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@app/db';
import { BaseError, Repo, Result, SaveModelArg } from '@app/core';
import { Avatar, AvatarMap, AvatarModel } from '.';

@Injectable()
export class AvatarRepo extends Repo {
  constructor(private db: DatabaseService) {
    super();
  }

  async save(avatar: Avatar) {
    if (this.noPropsWereModified(avatar.unsavedProps)) return;
    const avatarModel = AvatarMap.domainToPersistence(avatar);

    await this.saveModel({
      model: avatarModel,
      unsavedProps: avatar.unsavedProps,
    });
  }

  async saveModel(arg: SaveModelArg<AvatarModel>) {
    const { model, unsavedProps } = arg;
    if (this.noPropsWereModified(unsavedProps)) return;

    await this.db.avatar.upsert({
      where: { id: model.id },
      create: model,
      update: this.pickUnsavedPropsFromModel(model, unsavedProps),
    });
  }

  async isExist(id: string): Promise<boolean> {
    const avatar = await this.db.avatar.findUnique({ where: { id } });
    return !!avatar;
  }

  async getOne(id: string) {
    const avatarModel = await this.db.avatar.findUnique({ where: { id } });
    if (!avatarModel) return BaseError.notFound<Avatar>('Avatar not found');

    return Result.ok(AvatarMap.persistenceToDomain(avatarModel));
  }

  async deleteOne(id: string) {
    await this.db.avatar.delete({ where: { id } });
  }

  async deleteOneByProfileId(profileId: string) {
    await this.db.avatar.delete({ where: { profileId } });
  }
}
