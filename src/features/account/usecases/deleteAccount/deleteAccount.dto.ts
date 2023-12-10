import { Account } from 'features/account/index';

export interface DeleteAccountInput {
  me: Account;
  password?: string;
}

export type DeleteAccountOutput = void;
