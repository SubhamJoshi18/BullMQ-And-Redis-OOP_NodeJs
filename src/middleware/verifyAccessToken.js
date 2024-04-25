import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

class MiddleWare {
  static async verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "Invalid Authorization",
      });
    }
    const token = authHeader.split(" ")[1];
    const secreyKey =
      "d624065e66687f08b304877acb2b5a968c0ed94a56824e98bd79c16191843dae";

    jwt.verify(token, secreyKey, (err, payload) => {
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
