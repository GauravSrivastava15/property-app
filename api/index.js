import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const app = express();

mongoose.connect(process.env.DATABASE_URL).then(() =>{
    console.log("Database connected")
})

// console.log(process.env.DATABASE_URL)

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.listen(3000, () => {
  console.log("Server running on port 3000!!");
});


