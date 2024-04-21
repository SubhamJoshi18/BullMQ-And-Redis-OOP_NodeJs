import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./db/connectdb.js";
import authrouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({
    message: "Server is Running on port ",
  });
});

app.use("/api", [authrouter, userRouter]);
dbConnect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
