import express from 'express'
import { createProperty } from './property.controller.js'
import { auth } from '../middlewares/jwtAuth.js'

const router = express.Router()

router.route("/create").post(auth,createProperty)

export default router