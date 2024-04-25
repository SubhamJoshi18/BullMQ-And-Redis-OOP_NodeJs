import { Router } from "express";
5;
import MiddleWare from "../middleware/verifyAccessToken.js";
import ProfileController from "../controller/profileController.js";
const userRouter = Router();

userRouter.get(
  "/user/view",
  MiddleWare.verifyToken,
  ProfileController.ViewProfile
);

userRouter.put(
  "/user/:id",
  MiddleWare.verifyToken,
  ProfileController.updateProfile
);
export default userRouter;
