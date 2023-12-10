import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { BaseError, Result } from '@app/core';
import { AppConfig } from '@app/config';
import { Account, AccountRepo } from '../../account';
import { Guest } from '../../guest';
import { CacheService } from '../cache';
import { AuthPayload } from '.';

@Injectable()
export class UserValidation {
  private _accountOrGuest: Account | Guest;
  private _accessToken: string;
  private _userType: 'guest' | 'account';
  private _userId: string;

  constructor(
    private config: AppConfig,
    private cache: CacheService,
    private accountRepo: AccountRepo,
  ) {}

  async validate(accessToken: string): Promise<Result<Account | Guest>> {
    try {
      this._accessToken = accessToken;
      this._decodeAccessToken();
      this._getLoggedInGuestOrAccount();

      return Result.ok(this._accountOrGuest);
    } catch (e: unknown) {
      if (e instanceof Result) return e;
      return BaseError.unexpected(e);
    }
  }

  private _decodeAccessToken() {
    jwt.verify(
      this._accessToken,
      this.config.auth.jwtSecret,
      (error, decoded) => {
        if (error) throw BaseError.unauthenticated();

        this._userType = (decoded as AuthPayload).userType;
        this._userId = (decoded as AuthPayload).userId;
      },
    );
  }

  private async _getLoggedInGuestOrAccount() {
    if (this._userType === 'guest') {
      await this._getGuestFromCache();
    } else {
      await this._getAccountFromCacheOrDb();
    }
  }

  private async _getGuestFromCache() {
    const guest = await this.cache.getGuest(this._userId);
    if (!guest) throw BaseError.unauthenticated();

    this._accountOrGuest = guest;
  }

  private async _getAccountFromCacheOrDb() {
    const accountFromCache = await this.cache.getAccount(this._userId);
    if (accountFromCache) {
      this._accountOrGuest = accountFromCache;
      return;
    }

    const accountFromDbOrError = await this.accountRepo.getOne(this._userId);
    if (accountFromDbOrError.isSuccess) {
      this._accountOrGuest = accountFromDbOrError.value;
      return;
    }

    throw BaseError.unauthenticated();
  }
}
