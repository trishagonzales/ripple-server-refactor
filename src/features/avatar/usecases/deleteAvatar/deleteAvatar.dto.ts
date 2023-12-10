import { Account } from 'features/account/index';

export interface DeleteAvatarInput {
  me: Account;
}

export type DeleteAvatarOutput = void;
