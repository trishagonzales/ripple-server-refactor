import { Account } from 'features/account/index';

export interface ResendAccessTokenInput {
  me: Account;
}

export type ResendAccessTokenOutput = string;
