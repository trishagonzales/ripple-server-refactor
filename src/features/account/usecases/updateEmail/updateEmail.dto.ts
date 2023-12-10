import { Account } from 'features/account/index';

export interface UpdateEmailInput {
  me: Account;
  email: string;
}

export type UpdateEmailOutput = void;
