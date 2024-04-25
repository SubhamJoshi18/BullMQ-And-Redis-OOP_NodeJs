import { Router } from "express";
import MiddleWare from "../middleware/verifyAccessToken.js";
import { NewsController } from "../controller/NewsController.js";

const newsRouter = Router();

newsRouter.post("/news", MiddleWare.verifyToken, NewsController.create);
newsRouter.get("/news", MiddleWare.verifyToken, NewsController.viewAllNews);
newsRouter.get("/news/:id", MiddleWare.verifyToken, NewsController.viewNewsId);
newsRouter.put(
  "/news/image/:id",
  MiddleWare.verifyToken,
  NewsController.AddImage
);
newsRouter.patch(
  "/news/:id",
  MiddleWare.verifyToken,
  NewsController.UpdateNews
);
newsRouter.delete(
  "/news/:id",
  MiddleWare.verifyToken,
  NewsController.DeleteNews
);

export default newsRouter;
