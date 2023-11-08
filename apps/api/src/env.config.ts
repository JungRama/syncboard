import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "development";

export const PORT = process.env.PORT || 8000;

export const RATE_LIMIT = process.env.RATE_LIMIT || 60;

export const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://<username>:<password>@cluster0.wxu482x.mongodb.net/?retryWrites=true&w=majority";

/* ----------------------------------- JWT ACCESS KEY ---------------------------------- */
export const JWT_ACCESS_PRIVATE_KEY =
  process.env.JWT_ACCESS_PRIVATE_KEY || "XcVH/KjbFhUGSB1Ojv+Nrw==";

export const JWT_ACCESS_PUBLIC_KEY =
  process.env.JWT_ACCESS_PUBLIC_KEY || "WcZqBSFyXzSaacN6fzARVg==";

/* ----------------------------------- JWT REFRESH KEY ---------------------------------- */
export const JWT_REFRESH_PRIVATE_KEY =
  process.env.JWT_REFRESH_PRIVATE_KEY || "S60apQby8sdfaTo5LsWfrw==";

export const JWT_REFRESH_PUBLIC_KEY =
  process.env.JWT_REFRESH_PUBLIC_KEY || "1APYcPZipytM6sHWwuVjCw==";

/* ------------------------------- JWT EXPIRED ------------------------------ */
export const JWT_ACCESS_TOKEN_EXPIRED_IN: number = process.env
  .JWT_ACCESS_TOKEN_EXPIRED_IN
  ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRED_IN)
  : 15;

export const JWT_REFRESH_TOKEN_EXPIRED_IN = process.env
  .JWT_REFRESH_TOKEN_EXPIRED_IN
  ? parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRED_IN)
  : 10;

/* ------------------------------ REDIS CONFIG ------------------------------ */
export const REDIS_HOST = process.env.REDIS_HOST || "<redis_host>";
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "<redis_password>";
export const REDIS_PORT = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT)
  : 19027;