import session from 'express-session';
import Redis from 'ioredis';
import connectRedis, { RedisStore } from 'connect-redis';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '@app/config';
import { AppError } from '@app/core';

export type Session = typeof session;

@Injectable()
export class RedisService {
  private _client: Redis;

  constructor(private config: AppConfig) {
    this._client = new Redis(this.config.cache.url);
  }

  createSessionStore(session: Session): RedisStore {
    const RedisStore = connectRedis(session);
    return new RedisStore({ client: this._client });
  }

  async set(key: string, payload: any) {
    const result = await this._client.set(key, JSON.stringify(payload));
    if (result !== 'OK')
      throw new AppError('Problems caching data to redis', 'Redis.service.ts');
  }

  async get<T = unknown>(key: string) {
    const result = await this._client.get(key);
    if (!result) return null;

    return JSON.parse(result) as T;
  }

  async remove(key: string) {
    await this._client.del(key);
  }
}
