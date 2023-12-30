import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./user/user.routes.js";
import cookieParser from "cookie-parser";
import { appLevelErrorHandlerMiddleware } from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";

const app = express();


app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRouter);


app.use(appLevelErrorHandlerMiddleware)

app.listen(3000, () => {
  connectDB()
  console.log("Server running on port 3000!!");
});
