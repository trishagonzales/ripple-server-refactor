import { Injectable } from '@nestjs/common';
import { Account } from '../../account';
import { Guest } from '../../guest';
import { CacheService } from '../cache';
import { AuthPayload } from './types/auth.types';
import { TokenService } from './Token.service';

@Injectable()
export class LoginLogout {
  private _authPayload: AuthPayload;
  private _refreshToken: string;
  private _accessToken: string;
  private _accountOrGuest: Account | Guest;

  constructor(private cache: CacheService, private token: TokenService) {}

  async login(accountOrGuest: Account | Guest) {
    this._accountOrGuest = accountOrGuest;
    this._generateAuthPayloadForCaching();
    this._generateRefreshToken();
    this._generateAccessToken();
    this._setAuthPayloadInCache();

    return {
      refreshToken: this._refreshToken,
      accessToken: this._accessToken,
    };
  }

  private _generateAuthPayloadForCaching() {
    this._authPayload = {
      userId: this._accountOrGuest.id,
      userType: this._accountOrGuest instanceof Account ? 'account' : 'guest',
    };
  }

  private _generateRefreshToken() {
    this._refreshToken = this.token.generateRefreshToken();
  }

  private async _generateAccessToken() {
    this._accessToken = await this.token.generateAccessToken(this._authPayload);
  }

  private async _setAuthPayloadInCache() {
    await this.cache.setAuth(this._refreshToken, this._authPayload);
  }

  async logout(refreshToken: string) {
    await this.cache.removeAuth(refreshToken);
  }
}
