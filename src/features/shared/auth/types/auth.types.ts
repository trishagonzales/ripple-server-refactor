export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

type UserType = 'account' | 'guest';

export interface AuthPayload {
  userId: string;
  userType: UserType;
}
