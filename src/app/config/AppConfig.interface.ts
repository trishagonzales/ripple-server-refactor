export interface CommonConfig {
  app: AppEnv;
  auth: AuthEnv;
  storage: StorageEnv;
  mail: MailEnv;
}

export interface DynamicConfig {
  db: DbEnv;
  cache: CacheEnv;
}

export interface IAppConfig extends CommonConfig, DynamicConfig {}

// CONFIG PROPS

export type NodeEnv = 'production' | 'development' | 'test';
export interface AppEnv {
  nodeEnv: NodeEnv;
  host: string;
  port: number;
  frontendUrl: string;
  apiUrl: string;
}
export interface AuthEnv {
  sessionSecret: string;
  jwtSecret: string;
  googleClientId: string;
  googleClientSecret: string;
}
export interface DbEnv {
  url: string;
}
export interface CacheEnv {
  url: string;
}
export interface StorageEnv {
  name: string;
  apiKey: string;
  apiSecret: string;
}
export interface MailEnv {
  apiKey: string;
}

// RAW ENV VARIABLES

export interface RawEnvVariables {
  NODE_ENV: NodeEnv;
  HOST: string;
  PORT: string;
  SESSION_SECRET: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  DB_URL_PROD: string;
  DB_URL_DEV: string;
  DB_URL_TEST: string;
  REDIS_URL_PROD: string;
  REDIS_URL_DEV: string;
  REDIS_URL_TEST: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  SENDGRID_API_KEY: string;
}
