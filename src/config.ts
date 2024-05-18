// Mapper for environment variables

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const timezone = process.env.TZ;

export const db = {
  name: process.env.DB_HOST || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_USER_PWD || '',
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
  uri: process.env.MONGO_URI,
};

export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
};

export const logDirectory = process.env.LOG_DIR;

export const redis = {
  host: process.env.REDIS_HOST || '',
  port: parseInt(process.env.REDIS_PORT || '0'),
  password: process.env.REDIS_PASSWORD || '',
};

export const caching = {
  contentCacheDuration: parseInt(
    process.env.CONTENT_CACHE_DURATION_MILLIS || '600000',
  ),
};

export const AWS = {
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,

  mediaS3reqion: process.env.MEDIA_S3_REGION,
  mediaS3bucket: process.env.MEDIA_S3_BUCKET,
  mediaCloudFrontURL: process.env.MEDIA_CLOUDFRNT_URL,
};

export const sg = {
  apiKey: process.env.SENDGRID_API_KEY,
  mailFrom: process.env.MAIL_FROM,
  templates: {},
};

export const app = {
  clientURL: process.env.CLIENT_URL,
  serverURL: process.env.SERVER_URL,
};
