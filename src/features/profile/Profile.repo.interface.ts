import { SaveModelArg } from '@app/core';
import { Profile } from './Profile';
import { AvatarModel } from '../avatar';
import { ProfileModel } from '.';

export interface IProfileRepo {
  save(profile: Profile): Promise<void>;

  saveModel(arg: SaveModelArg<ProfileModel>): Promise<void>;

  saveModelWithRelationships(args: {
    profile: SaveModelArg<ProfileModel>;
    avatar: SaveModelArg<AvatarModel>;
  }): Promise<void>;

  getOne(id: string): Promise<Profile>;

  getOneModel(id: string): Promise<ProfileModel>;

  deleteOne(id: string): Promise<void>;

  isExist(id: string): Promise<boolean>;

  isExistByUsername(username: string): Promise<boolean>;
}
