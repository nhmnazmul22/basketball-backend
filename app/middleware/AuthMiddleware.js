// ===== Internal Imports =====
import { TokenDecoded } from "../utility/TokenUtility.js";

// ==== Verify Auth Token ====
export const AuthVerify = (req, res, next) => {
  const token = req.cookies["token"];
  const decodedToken = TokenDecoded(token);

  if (!decodedToken) {
    return res.status(401).json({ status: "Failed", message: "Unauthorize" });
  }

  const { id, email, role } = decodedToken;

  req.headers.userId = id;
  req.headers.email = email;
  req.header.role = role;
  next();
};
