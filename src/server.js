import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./db/connectdb.js";
import authrouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import newsRouter from "./routes/news.route.js";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./config/ratelimiter.js";
import logger from "./config/logger.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(limiter);

app.get("/", (req, res) => {
  return res.json({
    message: "Server is Running on port ",
  });
});

app.use("/api", [authrouter, userRouter, newsRouter]);
import "./jobs/index.js";
logger.info("Hey I am Just Testing...");
dbConnect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
