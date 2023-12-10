import { Account } from 'features/account/index';

export interface LogoutInput {
  me: Account;
}

export type LogoutOutput = void;
