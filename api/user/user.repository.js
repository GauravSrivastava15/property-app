import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";

const UserModel = mongoose.model("User", userSchema)

export const userSigninRepo = async(userData) =>{
    try{
        const {username, email, password} = userData
        const newUser = new UserModel({username,email,password})
        await newUser.save()
        return {success: true, res: newUser}
    }catch(err){
        console.log("error in user signin "+ err)
        return {success: false, error:{statusCode: 500, msg: err}}
    }
}