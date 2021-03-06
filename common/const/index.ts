export enum ROLES {
  GUEST = "GUEST",
  TOURIST = "TOURIST",
  TRAVELLER = "TRAVELLER",
  COMPANY = "COMPANY",
  ADMIN = "ADMIN",
}

export const ENV = {
  JWT_SECRET_KEY: "JWT_SECRET_KEY",
  JWT_ACCESS_EXPIRATION_TIME: "JWT_ACCESS_EXPIRATION_TIME",
  JWT_REFRESH_EXPIRATION_TIME: "JWT_REFRESH_EXPIRATION_TIME",

  MONGODB_URI: "MONGODB_URI",

  CLIENT_URL: "CLIENT_URL",
  SERVER_URL: "SERVER_URL",

  SERVER_PORT: "SERVER_PORT",

  EMAIL_HOST: "EMAIL_HOST",
  EMAIL_PORT: "EMAIL_PORT",
  EMAIL_USER: "EMAIL_USER",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",

  GOOGLE_AUTH_CLIENT_ID: "GOOGLE_AUTH_CLIENT_ID",
  GOOGLE_AUTH_CLIENT_SECRET: "GOOGLE_AUTH_CLIENT_SECRET",
}

export const COOKIE = {
  REFRESH_TOKEN: "refreshToken",
}

export const LS = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
}

export const CACHE_KEY = {
  GET_USERS: "GET_USERS",
}

export const AWS = {
  AWS_ACCESS_KEY_ID: "AWS_ACCESS_KEY_ID",
  AWS_SECRET_ACCESS_KEY: "AWS_SECRET_ACCESS_KEY",
  AWS_REGION: "AWS_REGION",
  AWS_PUBLIC_BUCKET_NAME: "AWS_PUBLIC_BUCKET_NAME",
  AWS_S3_BUCKET: "AWS_S3_BUCKET",
}
