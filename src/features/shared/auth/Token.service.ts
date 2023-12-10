import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '@app/config';
import { AppError } from '@app/core';
import { AuthPayload } from './types/auth.types';

@Injectable()
export class TokenService {
  constructor(private config: AppConfig) {}

  generateRefreshToken() {
    return v4();
  }

  async generateAccessToken(payload: AuthPayload) {
    return new Promise<string>((resolve) =>
      jwt.sign(
        payload,
        this.config.auth.jwtSecret,
        {
          expiresIn: 60 * 60, // 1 hour
        },
        (error, token) => {
          if (error) this._throwUnexpectedErrorIfCannotSignToken(error);

          if (!token) {
            this._throwUnexpectedErrorIfTokenIsEmptyAfterSigning();
          } else {
            resolve(token);
          }
        },
      ),
    );
  }

  private _throwUnexpectedErrorIfCannotSignToken(error: Error | null) {
    throw new AppError(
      'Problems signing JWT token ...\n' + error,
      'Login.service.ts',
    );
  }

  private _throwUnexpectedErrorIfTokenIsEmptyAfterSigning() {
    throw new AppError(
      'Token should not be empty after successful signing of JWT token.',
      'Login.service.ts',
    );
  }
}
