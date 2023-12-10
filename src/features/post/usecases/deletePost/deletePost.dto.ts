import { Account } from '../../../account/domain';

export interface DeletePostInput {
  me: Account;
  postId: string;
}

export type DeletePostOutput = void;
