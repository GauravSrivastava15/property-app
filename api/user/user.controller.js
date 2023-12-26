import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userSigninRepo } from "./user.repository.js";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export const signup = async (req, res, next) => {
  let { password } = req.body;
  password = await bcrypt.hash(password, 12);
  const resp = await userSigninRepo({ ...req.body, password });
  console.log("Response while registering ", resp);
  if (resp.success) {
    res.status(200).json({ msg: "user created", res: resp.res });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg))
  }
};
