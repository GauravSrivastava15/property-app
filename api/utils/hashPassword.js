import bcrypt from "bcrypt";
import { customErrorHandler } from "../middlewares/errorHandler.js";

export const hashPassword = async (password, next) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (err) {
    next(
      new customErrorHandler(400, "encounterd error while hashing password")
    );
  }
};

export const compareHashPassword = async (password, hashPassword, next) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (err) {
    next(new customErrorHandler(400, "Password does not match"));
  }
};
