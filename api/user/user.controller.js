import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userLoginRepo, userSigninRepo } from "./user.repository.js";
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
      .json({ success: true, msg: "user login successful", token });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};
