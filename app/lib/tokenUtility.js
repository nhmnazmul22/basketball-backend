// External Imports
import jwt from "jsonwebtoken";

// Internal Imports
import { JWT_EXPIRED_TIME, JWT_KEY } from "../config/config.js";

// Token Encoded
export const TokenEncoded = (user_id, email, role) => {
  const KEY = JWT_KEY;
  const JWT_OPTIONS = {
    expiresIn: JWT_EXPIRED_TIME,
  };
  const PAYLOAD = {
    user_id: user_id,
    email: email,
    role: role,
  };
  const token = jwt.sign(PAYLOAD, KEY, JWT_OPTIONS);
  return token;
};

// Token Decoded
export const TokenDecoded = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};
