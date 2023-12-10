import { Injectable } from '@nestjs/common';
import { Account, AccountMap, AccountPlainData } from '../../account';
import { Guest, GuestMap, GuestPlainData } from '../../guest';
import { AuthPayload } from '../auth';
import { RedisService } from './Redis.service';

@Injectable()
export class CacheService {
  constructor(private redis: RedisService) {}

  // AUTH DATA

  async setAuth(refreshToken: string, payload: AuthPayload) {
    await this.redis.set(refreshToken, payload);
  }

  async getAuth(refreshToken: string) {
    return await this.redis.get<AuthPayload>(refreshToken);
  }

  async removeAuth(refreshToken: string) {
    await this.redis.remove(refreshToken);
  }

  async isAuthDataExist(refreshToken: string) {
    const result = await this.redis.get<AuthPayload>(refreshToken);
    return !!result;
  }

  // USER DATA

  async setAccountOrGuest(accountOrGuest: Account | Guest) {
    await this.redis.set(accountOrGuest.id, accountOrGuest.plainData);
  }

  async getAccount(userId: string) {
    const result = await this.redis.get<AccountPlainData>(userId);
    return result ? AccountMap.cacheToDomain(result) : null;
  }

  async getGuest(userId: string) {
    const result = await this.redis.get<GuestPlainData>(userId);
    return result ? GuestMap.cacheToDomain(result) : null;
  }

  async removeAccountOrGuest(userId: string) {
    await this.redis.remove(userId);
  }

  // MAIL TOKEN DATA

  async setMailTokenData(token: string, userId: string) {
    await this.redis.set(token, userId);
  }
  async getMailTokenData(token: string) {
    return await this.redis.get<string>(token);
  }
}
