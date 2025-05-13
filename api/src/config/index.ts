const isProduction = process.env["IS_PRODUCTION"] === "true";

const authConfig = {
  dbUrl: isProduction ? process.env["DB_URL_PROD"] : process.env["DB_URL_DEV"],
  secret: "szdhgflkjh;jiyptiyriuter5658798jkbhvgchf",
  tokenExpiryTime: process.env["JWT_TOKEN_EXPIRY"],
  refreshTokenExpiryTime: 2592000,
};

const appConfig = {
  frontendBaseUrl: isProduction ? ["", ""] : "http://localhost:5173",
  origin: isProduction
    ? ["", ""]
    : [
        "http://localhost:3004",
        "http://localhost:5173",
        "http://admin.localhost:5173",
      ],
  nodeMailerHost: process.env["NODEMAILER_HOST"],
  nodeMailerFromMail: process.env["NODEMAILER_FROMMAIL"],
  nodeMailerUser: process.env["NODEMAILER_USER"],
  nodeMailerPass: process.env["NODEMAILER_PASS"],
};

export { isProduction, appConfig, authConfig };
