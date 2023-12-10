import { AccountDTO } from 'features/account/index';
import { AuthTokens } from '../../../shared/auth';

export interface LoginLocalInput {
  usernameOrEmail: string;
  password: string;
}

export interface LoginLocalOutput {
  userData: AccountDTO;
  authTokens: AuthTokens;
}
