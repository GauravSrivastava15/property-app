import exprees from "express";
import {
  deleteUser,
  google,
  signin,
  signup,
  updateUser,
  userSignOut,
} from "./user.controller.js";
import { auth } from "../middlewares/jwtAuth.js";

const router = exprees.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/update/:id", auth, updateUser);
router.delete("/delete/:id", auth, deleteUser);
router.get('/signout', userSignOut)
export default router;
