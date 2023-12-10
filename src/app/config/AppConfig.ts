import dotenv from 'dotenv';
import Joi, { object, string } from 'joi';
import { Injectable } from '@nestjs/common';
import { AppError } from '../core';
import {
  CommonConfig,
  DynamicConfig,
  IAppConfig,
  RawEnvVariables,
  NodeEnv,
  ProductionConfig,
  DevelopmentConfig,
  TestConfig,
} from '.';

@Injectable()
export class AppConfig implements IAppConfig {
  private parsedEnv: dotenv.DotenvParseOutput;
  private validatedEnv: RawEnvVariables;
  private validationSchema: Joi.ObjectSchema<RawEnvVariables>;
  private commonConfig: CommonConfig;
  private dynamicConfig: DynamicConfig;

  constructor() {
    this._parseEnvFiles();
    this._generateValidationSchema();
    this._validateParsedEnv();
    this._generateCommonConfig();
    this._generateDynamicConfig();
  }

  private _parseEnvFiles() {
    const { error, parsed } = dotenv.config();
    if (error) throw this._cannotParseEnvFilesError(error);
    if (!parsed) throw this._parsedEnvFileIsEmptyError();
    this.parsedEnv = parsed;
  }

  private _cannotParseEnvFilesError(error: any) {
    return new AppError(`Cannot parse env file(s) \n${error}`, 'AppConfig.ts');
  }

  private _parsedEnvFileIsEmptyError() {
    return new AppError('Parsed env file is empty', 'AppConfig.ts');
  }

  private _generateValidationSchema() {
    this.validationSchema = object<RawEnvVariables>({
      // app
      NODE_ENV: string().valid('production', 'development', 'test'),
      PORT: string(),
      // auth
      SESSION_SECRET: string(),
      JWT_SECRET: string(),
      GOOGLE_CLIENT_ID: string(),
      GOOGLE_CLIENT_SECRET: string(),
      // db
      DB_URL_PROD: string(),
      DB_URL_DEV: string(),
      DB_URL_TEST: string(),
      // cache
      REDIS_URL_PROD: string(),
      REDIS_URL_DEV: string(),
      REDIS_URL_TEST: string(),
      // storage
      CLOUDINARY_CLOUD_NAME: string(),
      CLOUDINARY_API_KEY: string(),
      CLOUDINARY_API_SECRET: string(),
      // mail
      SENDGRID_API_KEY: string(),
    });
  }

  private _validateParsedEnv() {
    const { error, value } = this.validationSchema.validate(this.parsedEnv);
    if (error) throw this._invalidEnvVariablesError(error);
    this.validatedEnv = value as RawEnvVariables;
  }

  private _invalidEnvVariablesError(error: Joi.ValidationError) {
    return new AppError(
      'Environment variables incomplete: \n' + error.message,
      'AppConfig.ts',
    );
  }

  private _generateCommonConfig() {
    const env = this.validatedEnv;
    const commonConfig: CommonConfig = {
      app: {
        nodeEnv: env.NODE_ENV,
        host: env.HOST,
        port: parseInt(env.PORT),
        frontendUrl: env.FRONTEND_URL,
        apiUrl: `${env.HOST}:${env.PORT}/api`,
      },
      auth: {
        sessionSecret: env.SESSION_SECRET,
        jwtSecret: env.JWT_SECRET,
        googleClientId: env.GOOGLE_CLIENT_ID,
        googleClientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      mail: {
        apiKey: env.CLOUDINARY_API_KEY,
      },
      storage: {
        name: env.CLOUDINARY_CLOUD_NAME,
        apiKey: env.CLOUDINARY_API_KEY,
        apiSecret: env.CLOUDINARY_API_SECRET,
      },
    };

    this.commonConfig = commonConfig;
  }

  private _generateDynamicConfig() {
    switch (this.validatedEnv.NODE_ENV as NodeEnv) {
      case 'production':
        this.dynamicConfig = new ProductionConfig(this.validatedEnv);
        break;
      case 'test':
        this.dynamicConfig = new TestConfig(this.validatedEnv);
        break;
      default:
        this.dynamicConfig = new DevelopmentConfig(this.validatedEnv);
    }
  }

  get app() {
    return this.commonConfig.app;
  }
  get auth() {
    return this.commonConfig.auth;
  }
  get mail() {
    return this.commonConfig.mail;
  }
  get storage() {
    return this.commonConfig.storage;
  }
  get db() {
    return this.dynamicConfig.db;
  }
  get cache() {
    return this.dynamicConfig.cache;
  }
}
