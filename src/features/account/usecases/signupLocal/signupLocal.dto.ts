import { AuthTokens } from '../../../shared/auth';
import { AccountDTO } from '../../types/account.dto';

export interface SignupLocalInput {
  email: string;
  password: string;
}

export interface SignupLocalOutput {
  account: AccountDTO;
  tokens: AuthTokens;
}
