import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const MAX_JSON_SIZE = process.env.MAX_JSON_SIZE || "100mb";
export const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;
export const REQUEST_LIMIT_TIME =
  parseInt(process.env.REQUEST_LIMIT_TIME) || 15 * 60 * 1000;
export const REQUEST_LIMIT_NUMBER =
  parseInt(process.env.REQUEST_LIMIT_NUMBER) || 30000;
export const URL_ENCODED = process.env.URL_ENCODED === "true";
export const WEB_CACHE = process.env.WEB_CACHE === "true";
export const JWT_EXPIRED_TIME = process.env.JWT_EXPIRED_TIME;
export const JWT_KEY = process.env.JWT_KEY;
