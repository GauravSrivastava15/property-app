import express from "express";
import { createProperty, deleteProperty, getListing, getListings, updateProperty } from "./property.controller.js";
import { auth } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.route("/create").post(auth, createProperty);
router.route("/delete/:id").delete(auth, deleteProperty);
router.route("/update/:id").post(auth, updateProperty);
router.route("/get/:id").get(getListing)
router.route("/get").get(getListings)

export default router;
