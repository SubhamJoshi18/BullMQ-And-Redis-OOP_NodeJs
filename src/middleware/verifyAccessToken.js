import Token from "../utils/jwt/token.js";
import jwt from "jsonwebtoken";

class MiddleWare extends Token {
  static async verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "Invalid Authorization",
      });
    }
    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, Token.secretkey, (err, payload) => {
      if (err) {
        console.log(err);
      } else {
        req.user = payload;
        next();
      }
    });
    console.log(authHeader);
  }
}

export default MiddleWare;
