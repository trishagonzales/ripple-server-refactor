import { DynamicConfig, RawEnvVariables, DbEnv, CacheEnv } from '.';

export class ProductionConfig implements DynamicConfig {
  public readonly db: DbEnv;
  public readonly cache: CacheEnv;

  constructor(env: RawEnvVariables) {
    this.db = { url: env.DB_URL_PROD };
    this.cache = { url: env.REDIS_URL_PROD };
  }
}

export class DevelopmentConfig implements DynamicConfig {
  public readonly db: DbEnv;
  public readonly cache: CacheEnv;

  constructor(env: RawEnvVariables) {
    this.db = { url: env.DB_URL_DEV };
    this.cache = { url: env.REDIS_URL_DEV };
  }
}

export class TestConfig implements DynamicConfig {
  public readonly db: DbEnv;
  public readonly cache: CacheEnv;

  constructor(env: RawEnvVariables) {
    this.db = { url: env.DB_URL_TEST };
    this.cache = { url: env.REDIS_URL_TEST };
  }
}
