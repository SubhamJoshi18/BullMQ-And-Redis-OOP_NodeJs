import { Router } from "express";
import MiddleWare from "../middleware/verifyAccessToken.js";
import AuthController from "../controller/authController.js";
const authrouter = Router();

authrouter.post("/auth/register", AuthController.register);
authrouter.post("/auth/login", AuthController.login);
authrouter.get("/auth/check", MiddleWare.verifyToken, (req, res) => {
  res.json({
    message: "Checking Middleware",
  });
});

export default authrouter;
