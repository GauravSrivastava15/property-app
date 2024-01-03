import exprees from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
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
router.get('/listings/:id', auth, getUserListings )
router.get('/signout', userSignOut)
router.get('/:id', auth, getUser)

export default router;
