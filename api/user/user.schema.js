import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true, 
      required: [true, "name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
      match: [
        /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        "enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
  },
  { timestamps: true }
);



