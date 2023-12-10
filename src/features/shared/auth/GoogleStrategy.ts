import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { AppConfig } from '@app/config';
import { Profile } from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private config: AppConfig) {
    super({
      clientID: config.auth.googleClientId,
      clientSecret: config.auth.googleClientSecret,
      callbackURL: '/auth/google/callback',
      scope: ['profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: () => void,
  ) {}
}
