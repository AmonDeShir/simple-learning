import dotenv from "dotenv"

dotenv.config({ path: "./secret/.env" })

const required = [
  "DB_URL",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRATION_TIME",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_EXPIRATION_TIME",
  "JWT_VERIFICATION_TOKEN_SECRET",
  "JWT_VERIFICATION_TOKEN_EXPIRATION_TIME",
  "JWT_PASSWORD_RESET_TOKEN_SECRET",
  "JWT_PASSWORD_RESET_TOKEN_EXPIRATION_TIME",
  "JWT_USE_LOCALLY_TOKEN_SECRET",
  "JWT_USE_LOCALLY_TOKEN_EXPIRATION_TIME",
  "EMAIL",
  "GOOGLE_APPLICATION_CREDENTIALS",
]

required
  .forEach((config) => {
    if (process.env[config] === undefined) {
      throw Error(`process.env.${config} is undefined!`);
    }
  })

export const Config = {
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  db: {
    urlMain: process.env.DB_URL as string,
    urlTest: process.env.DB_URL_TEST || "mongodb://localhost:27017/simple-learning-test",
  },
  jwt: {
    useLocally: {
      secret: process.env.JWT_USE_LOCALLY_TOKEN_SECRET as string,
      time: Number(process.env.JWT_USE_LOCALLY_TOKEN_EXPIRATION_TIME)
    },
    access: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      time: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME)
    },
    refresh: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      time: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME)
    },
    verification: {
      secret: process.env.JWT_VERIFICATION_TOKEN_SECRET as string,
      time: Number(process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME)
    },
    passwordReset: {
      secret: process.env.JWT_PASSWORD_RESET_TOKEN_SECRET as string,
      time: Number(process.env.JWT_PASSWORD_RESET_TOKEN_EXPIRATION_TIME)
    }
  },
  urls: {
    emailConfirmation: process.env.EMAIL_CONFIRMATION_URL || "http://localhost:3000/confirm-email",
    password_reset: process.env.PASSWORD_RESET_URL || "http://localhost:3000/reset-password",
    static_data: process.env.STATIC_DATA_URL || "http://localhost:3000/static",
  },
  email: process.env.EMAIL as string,
  google: process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
  staticData: process.env.STATIC_DATA as string,
};