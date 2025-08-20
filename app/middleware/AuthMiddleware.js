// ===== Internal Imports =====
import { TokenDecoded } from "../lib/tokenUtility.js";

// ==== Verify Auth Token ====
export const AuthVerify = (req, res, next) => {
  const token = req.cookies["token"];
  const decodedToken = TokenDecoded(token);

  if (!decodedToken) {
    return res.status(401).json({ status: "Failed", message: "Unauthorize" });
  }

  const { user_id, email, role } = decodedToken;

  req.headers.userId = user_id;
  req.headers.email = email;
  req.headers.role = role;
  next();
};
