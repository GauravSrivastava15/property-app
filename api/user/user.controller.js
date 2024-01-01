import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  deleteUserRepo,
  googleRepo,
  listingRepo,
  updateUserRepo,
  userLoginRepo,
  userSigninRepo,
} from "./user.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export const signup = async (req, res, next) => {
  let { password } = req.body;
  password = await bcrypt.hash(password, 12);
  const resp = await userSigninRepo({ ...req.body, password });
  //   console.log("Response while registering ", resp);
  if (resp.success) {
    res.status(200).json({ msg: "user created", res: resp.res });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const resp = await userLoginRepo(req.body);
  if (resp.success) {
    const token = jwt.sign({ _id: resp.res._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = resp.res._doc; // rest obj is created without the password property
    res
      .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
      .status(200)
      .json({ success: true, msg: "user login successful", rest }); //we can also send rest
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await googleRepo(req.body);
    // console.log(user);
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("jwtToken", token, {
          maxAge: 1 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .status(200)
        .json({ success: true, msg: "user login successful", rest });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);
      const userData = {
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      };
      const resp = await userSigninRepo(userData);
      if (resp.success) {
        const token = jwt.sign({ _id: resp.res._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = resp.res._doc;
        res
          .cookie("jwtToken", token, {
            maxAge: 1 * 60 * 60 * 1000,
            httpOnly: true,
          })
          .status(200)
          .json({ success: true, msg: "user login successful", rest });
      }
    }
  } catch (err) {
    next(new customErrorHandler(500, "Google varification failed"));
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user !== req.params.id) {
    return next(
      new customErrorHandler(401, "You can only update your account!")
    );
  } else {
    const resp = await updateUserRepo(req.params.id, req.body, next);
    if (resp.success) {
      const { password, ...rest } = resp.res._doc;
      res.status(200).json(rest);
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user !== req.params.id) {
    return next(
      new customErrorHandler(401, "You can only delete your account!")
    );
  } else {
    const resp = await deleteUserRepo(req.params.id);
    if (resp.success) {
      res.clearCookie('jwtToken')
      res.status(200).json("User delete")
    } else {
      next(new customErrorHandler(400, resp.error));
    }
  }
};

export const userSignOut = async (req, res, next) =>{
  try{
    res.clearCookie('jwtToken')
    res.status(200).json("User has been logged out")
  }catch(err){
    next(new customErrorHandler(400, err))
  }
}

export const getUserListings = async (req, res, next) =>{
  if(req.user !== req.params.id){
    return next(
      new customErrorHandler(401, "You can only view your listings!")
    );
  }else{
    const resp = await listingRepo(req.body, req.params.id)
    if(resp.success){
      res.status(200).json(resp.res)  //resp.res contains the property lists
    }else{
      next( new customErrorHandler(400, resp.error))
    }
  }
}
