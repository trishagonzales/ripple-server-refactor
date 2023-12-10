import { AuthTokensDTO, GuestDTO } from '../../dtos';

export type LoginAsGuestInput = void;

export type LoginAsGuestOutput = {
  userData: GuestDTO;
  authTokens: AuthTokensDTO;
};
