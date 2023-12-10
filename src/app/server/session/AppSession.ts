import session from 'express-session';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '@app/config/AppConfig';
import { RedisService } from 'features/shared/cache';

@Injectable()
export class AppSession {
  constructor(private config: AppConfig, private redis: RedisService) {}

  init() {
    return session({
      name: 'sid',
      store: this.redis.createSessionStore(session),
      secret: this.config.auth.sessionSecret,
      cookie: {
        httpOnly: this.config.app.nodeEnv === 'production',
        secure: this.config.app.nodeEnv === 'production',
        sameSite: this.config.app.nodeEnv === 'production' ? 'strict' : 'none',
        maxAge: 1000 * 60 * 60 * 24 * 10, // 10 days
      },
    });
  }
}
