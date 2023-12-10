import { Injectable } from '@nestjs/common';
import { BaseError, Result } from '@app/core';
import { Account } from '../../account';
import { Guest } from '../../guest';
import { CacheService } from '../cache';
import { LoginLogout, UserValidation, TokenService } from '.';

@Injectable()
export class AuthService {
  constructor(
    private loginLogout: LoginLogout,
    private userValidation: UserValidation,
    private cache: CacheService,
    private token: TokenService,
  ) {}

  login(accountOrGuest: Account | Guest) {
    return this.loginLogout.login(accountOrGuest);
  }

  logout(refreshToken: string) {
    this.loginLogout.logout(refreshToken);
  }

  authenticate(accessToken: string) {
    return this.userValidation.validate(accessToken);
  }

  async regenerateAccessToken(refreshToken: string) {
    const authPayload = await this.cache.getAuth(refreshToken);
    if (!authPayload)
      return BaseError.unauthenticated<string>('User not logged in');

    const accessToken = await this.token.generateAccessToken(authPayload);
    return Result.ok(accessToken);
  }
}
