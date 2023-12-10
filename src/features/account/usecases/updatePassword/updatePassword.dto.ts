import { Account } from 'features/account/index';

export interface UpdatePasswordInput {
  me: Account;
  password: string;
}

export type UpdatePasswordOutput = void;
