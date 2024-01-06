import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./user/user.routes.js";
import cookieParser from "cookie-parser";
import { appLevelErrorHandlerMiddleware } from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";
import propertyRouter from './property/property.routes.js'
import path from 'path'

const app = express();

const __dirname = path.resolve()

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter)

app.use(express.static(path.join(__dirname,'/client/dist')))

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})
app.use(appLevelErrorHandlerMiddleware)

app.listen(3000, () => {
  connectDB()
  console.log("Server running on port 3000!!");
});
