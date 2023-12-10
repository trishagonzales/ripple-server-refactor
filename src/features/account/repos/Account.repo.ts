import { omit } from 'lodash';
import { Injectable } from '@nestjs/common';
import { AppError, BaseError, Repo, Result, SaveModelArg } from '@app/core';
import { DatabaseService } from '@app/db';
import { UserRepo } from './User.repo';
import { ProfileModel, ProfileRepo } from '../../profile';
import { Account } from '../entities/Account';
import { AccountMap } from '../mappers/Account.map';
import { AccountModel, fullAccountQueryArg } from '../types/account.dto';
import { UserModel } from '../types/user.model';
import { AvatarModel } from '../../avatar';

@Injectable()
export class AccountRepo extends Repo {
  constructor(
    private db: DatabaseService,
    private userRepo: UserRepo,
    private profileRepo: ProfileRepo,
  ) {
    super();
  }

  async save(account: Account) {
    const models = AccountMap.domainToPersistence(account);
    const unsavedProps = AccountMap.serializeUnsavedProps(account);

    const { userModel } = models;
    const { userUnsavedProps } = unsavedProps;
    const userRollback = await this._createUserRollback(
      account.id,
      userUnsavedProps,
    );

    try {
      await this.userRepo.saveModel({
        model: userModel,
        unsavedProps: userUnsavedProps,
      });
    } catch (e) {
      throw new AppError('Cannot save user', 'Account.repo.ts');
    }

    try {
      const { profileModel, avatarModel } = models;
      const { profileUnsavedProps, avatarUnsavedProps } = unsavedProps;

      const profileSaveModelArg: SaveModelArg<ProfileModel> = {
        model: profileModel,
        unsavedProps: profileUnsavedProps,
      };

      const accountHasAvatar = avatarModel && avatarUnsavedProps;

      const avatarSaveModelArg: SaveModelArg<AvatarModel> | undefined =
        accountHasAvatar
          ? {
              model: avatarModel,
              unsavedProps: avatarUnsavedProps,
            }
          : undefined;

      await this.profileRepo.saveModelWithRelationships(
        profileSaveModelArg,
        avatarSaveModelArg,
      );
    } catch (e) {
      await userRollback.execute();
      throw new AppError('Cannot save profile', 'Account.repo.ts');
    }
  }

  private async _createUserRollback(
    userId: string,
    unsavedProps: (keyof UserModel)[],
  ) {
    const previousData = await this.userRepo.getOne(userId);

    const updateToPrevious = async (model: UserModel) => {
      await this.userRepo.saveModel({
        model,
        unsavedProps,
      });
    };
    const deleteNewlyCreated = async () => {
      await this.userRepo.deleteOne(userId);
    };

    const rollback = this.createRollbackFunction({
      previousData,
      updateToPrevious,
      deleteNewlyCreated,
    });
    return rollback;
  }

  async getOne(id: string) {
    const res = await this.db.user.findUnique({
      where: { id },
      ...fullAccountQueryArg,
    });
    if (!res) return BaseError.notFound<Account>('Account not found');
    return Result.ok(this._mapModelToDomain(res));
  }

  async getOneByEmail(email: string) {
    const res = await this.db.user.findUnique({
      where: { email },
      ...fullAccountQueryArg,
    });
    if (!res) return BaseError.notFound<Account>('Account not found');
    return Result.ok(this._mapModelToDomain(res));
  }

  async getOneByUsername(username: string) {
    const res = await this.db.user.findMany({
      where: { profile: { username } },
      ...fullAccountQueryArg,
    });
    if (res.length === 0)
      return BaseError.notFound<Account>('Account not found');
    return Result.ok(this._mapModelToDomain(res[0]));
  }

  private _mapModelToDomain(accountModel: AccountModel): Account {
    return AccountMap.persistenceToDomain({
      userModel: omit(accountModel, ['profile']),
      profileModel: accountModel.profile!,
      avatarModel: accountModel.profile?.avatar ?? undefined,
    });
  }
}
