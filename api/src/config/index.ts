import * as envalid from "envalid";
import * as dotenv from "dotenv";

dotenv.config({ path: [".env"] });

/**
 * @description environment variables
 */
export const env = envalid.cleanEnv(process.env, {
  // ========= APP =========
  APP_NAME: envalid.str({ default: "@knowledgescout/api" }),
  APP_VERSION: envalid.str({ default: "0.1.0" }),
  APP_DEBUG: envalid.bool({ default: true }),
  APP_ENV: envalid.str({
    choices: ["development", "production", "test"],
    default: "development",
  }),

  // ========= HTTP =========
  HTTP_PORT: envalid.port({ default: 8080 }),
  HTTP_HOST: envalid.str({ default: "127.0.0.1" }),

  // ========= DATABASE =========
  MONGO_URI: envalid.str(),
});
