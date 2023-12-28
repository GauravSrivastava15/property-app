import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { compareHashPassword } from "../utils/hashPassword.js";

const UserModel = mongoose.model("User", userSchema);

//Sign up Repo
export const userSigninRepo = async (userData) => {
  try {
    const { username, email, password, avatar } = userData;
    // console.log(username);
    const newUser = new UserModel({ username, email, password, avatar });
    await newUser.save();
    return { success: true, res: newUser };
  } catch (err) {
    // console.log("error in user signin " + err);
    return { success: false, error: { statusCode: 500, msg: err } };
  }
};

//Sign in Repo
export const userLoginRepo = async (userData) => {
  try {
    const { email, password } = userData;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    }else{
        let passwordValidation = await compareHashPassword(password, user.password)
        if(passwordValidation){
            return {success: true, res: user}
        }else{
            return {success:false, error:{statusCode: 404, msg: "invalid credentials"}}
        }
    }
  } catch (err) {
    // console.log("error in user signin " + err);
    return { success: false, error: { statusCode: 500, msg: err } };
  }
};

export const googleRepo = async (userData) =>{
    const { email, password } = userData;
    const user = await UserModel.findOne({email})
    return user
}
