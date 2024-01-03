import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { compareHashPassword, hashPassword } from "../utils/hashPassword.js";
import { PropertyModel } from "../property/property.repository.js";

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
    } else {
      let passwordValidation = await compareHashPassword(
        password,
        user.password
      );
      if (passwordValidation) {
        return { success: true, res: user };
      } else {
        return {
          success: false,
          error: { statusCode: 404, msg: "invalid credentials" },
        };
      }
    }
  } catch (err) {
    // console.log("error in user signin " + err);
    return { success: false, error: { statusCode: 500, msg: err } };
  }
};

//it checks wheteher the user is already present in the data base or not
export const googleRepo = async (userData) => {
  const { email, password } = userData;
  const user = await UserModel.findOne({ email });
  return user;
};

export const updateUserRepo = async (id, userData, next) => {
  try {
    if (userData.password) {
      const newHashedPassword = await hashPassword(userData.password, next);
      userData.password = newHashedPassword;
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          username: userData.username,
          email: userData.emai,
          password: userData.password,
          avatar: userData.avatar,
        },
      },
      { new: true }
    );

    return { success: true, res: updateUser };
  } catch (err) {
    return { success: false, error: { statusCode: 500, msg: err } };
  }
};

export const deleteUserRepo = async (id) => {
  try {
    await UserModel.findByIdAndDelete(id);
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

export const listingRepo = async (listData, params_id) =>{
  try{
    const listings = await PropertyModel.find({userRef: params_id})
    return {success: true, res: listings}
  }catch(err){
    return {success: false, error: err}
  }
}

export const getUserRepo = async (id) =>{
  try{
    const user = await UserModel.findById(id)
    if(user){
      return {success: true, res: user}
    }else{
      return {success: false, error: 'User not found'}
    }
  }catch(err){
    return {success: false, error: err}
  }
}
