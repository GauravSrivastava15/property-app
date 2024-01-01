import express from "express";
import { createProperty, deleteProperty } from "./property.controller.js";
import { auth } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.route("/create").post(auth, createProperty);
router.route("/delete/:id").delete(auth, deleteProperty);

export default router;
