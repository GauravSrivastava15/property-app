import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./user/user.routes.js";
import cookieParser from "cookie-parser";
import { appLevelErrorHandlerMiddleware } from "./middlewares/errorHandler.js";

const app = express();

mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("Database connected");
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRouter);


app.use(appLevelErrorHandlerMiddleware)

app.listen(3000, () => {
  console.log("Server running on port 3000!!");
});
