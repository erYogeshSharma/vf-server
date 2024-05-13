declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV: string;
      PORT: string;
      CORS_URL: string;

      DB_NAME: string;
      DB_MIN_POOL_SIZE: string;
      DB_MAX_POOL_SIZE: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_USER_PWD: string;
      DB_ADMIN: string;
      DB_ADMIN_PWD: string;
      MONGO_URI: string;

      ACCESS_TOKEN_VALIDITY_SEC: string;
      REFRESH_TOKEN_VALIDITY_SEC: string;
      TOKEN_ISSUER: string;
      TOKEN_AUDIENCE: string;
      CONTENT_CACHE_DURATION_MILLIS: string;

      //S3
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;

      MEDIA_S3_REGION: string;
      MEDIA_S3_BUCKET_ARN: string;
      MEDIA_CLOUDFRNT_URL: string;
      MEDIA_S3_BUCKET: string;

      //SENDGRID
      SENDGRID_API_KEY: string;
      MAIL_FROM: string;

      //APP
      CLIENT_URL: string;
      SERVER_URL: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
