import { Injectable } from '@nestjs/common';
import { Repo, SaveModelArg } from '@app/core';
import { DatabaseService } from '@app/db';
import { UserModel } from '..';

@Injectable()
export class UserRepo extends Repo {
  constructor(private db: DatabaseService) {
    super();
  }

  async saveModel(arg: SaveModelArg<UserModel>) {
    const { model, unsavedProps } = arg;

    await this.db.user.upsert({
      where: { id: model.id },
      create: model,
      update: this.pickUnsavedPropsFromModel(model, unsavedProps),
    });
  }

  async isExist(id: string) {
    const user = await this.db.user.findUnique({ where: { id } });
    return !!user;
  }

  async isExistByEmail(email: string) {
    const user = await this.db.user.findUnique({ where: { email } });
    return !!user;
  }

  async deleteOne(id: string) {
    await this.db.user.delete({ where: { id } });
  }

  async getOne(id: string): Promise<UserModel | null> {
    return await this.db.user.findUnique({ where: { id } });
  }
}
